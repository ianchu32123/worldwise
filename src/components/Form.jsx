import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../context/CitiesContext";

// 函數將國家代碼轉換為 Emoji 圖示
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

// 表單組件
function Form() {
  const [cityName, setCityName] = useState(""); // 城市名稱狀態
  const [country, setCountry] = useState(""); // 國家狀態
  const [date, setDate] = useState(new Date()); // 日期狀態
  const [notes, setNotes] = useState(""); // 備註狀態
  const [searchParams] = useSearchParams(); // 獲取 URL 查詢參數
  const lat = searchParams.get("lat"); // 獲取緯度
  const lng = searchParams.get("lng"); // 獲取經度
  const [isLoadingGeo, setisLoadingGeo] = useState(false); // 是否正在加載地理位置信息狀態
  const [emoji, setEmoji] = useState(""); // Emoji 圖示狀態
  const [geocodingError, setGeocodingError] = useState(""); // 地理編碼錯誤狀態
  const { createCity, isLoading } = useCities(); // 使用城市上下文中的 createCity 和 isLoading 狀態
  const navigate = useNavigate(); // 瀏覽導航功能

  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"; // 地理編碼 API 的基本 URL

  // 在組件加載後獲取地理位置信息
  useEffect(
    function () {
      if (!lat && !lng) return; // 如果經緯度不存在，則返回

      async function fetchCityData() {
        try {
          setisLoadingGeo(true); // 設置正在加載地理位置信息狀態為真
          setGeocodingError(""); // 清空地理編碼錯誤

          // 發送地理編碼請求
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json(); // 解析響應數據
          console.log(data);

          // 如果未返回國家代碼，則拋出錯誤
          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Click somewhere else 😉"
            );

          // 更新城市名稱、國家名稱和 Emoji 圖示
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setGeocodingError(err.message); // 設置地理編碼錯誤
        } finally {
          setisLoadingGeo(false); // 設置正在加載地理位置信息狀態為假
        }
      }
      fetchCityData(); // 調用函數獲取地理位置信息
    },
    [lat, lng]
  );

  // 提交表單時的處理函數
  async function handleSubmit(e) {
    e.preventDefault(); // 阻止表單提交默認行為

    if (!cityName || !date) return; // 如果城市名稱或日期不存在，則返回

    // 創建新城市對象
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await createCity(newCity); // 調用 createCity 函數創建新城市
    navigate("/app/cities"); // 導航到城市列表頁面
  }

  // 如果正在加載地理位置信息，則顯示 Spinner 組件
  if (isLoadingGeo) return <Spinner />;
  // 如果存在地理編碼錯誤，則顯示錯誤消息組件
  if (geocodingError) return <Message message={geocodingError} />;
  // 如果經緯度不存在，則顯示消息提示用戶點擊地圖
  if (!lat && !lng) {
    return <Message message="點擊地圖某處開始" />;
  }

  // 返回表單組件
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* 使用日期選擇器 */}
        <DatePicker
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
