import { useParams, useSearchParams } from "react-router-dom";
import styles from "./City.module.css";
import { useCities } from "../context/CitiesContext";
import { useEffect } from "react";

import Spinner from "./Spinner";
import BackButton from "./BackButton";

// 格式化日期函數，將日期對象轉換為特定格式的字符串
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  // 使用 useParams hook 獲取路由中的 id 參數
  const { id } = useParams();
  // 使用 useCities hook 從上下文中獲取相關城市數據和操作
  const { getCity, currentCity, isLoading } = useCities();

  // 使用 useEffect hook 來在組件加載時獲取特定城市的詳細信息
  useEffect(
    function () {
      getCity(id); // 根據 id 參數獲取城市信息
    },
    [id] // 當 id 參數發生變化時觸發 useEffect
  );

  // 如果數據正在加載中，則顯示加載動畫
  if (isLoading) {
    return <Spinner />;
  }

  // 從 currentCity 中獲取城市的相關信息
  const { cityName, emoji, date, notes } = currentCity;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>城市名稱</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>你在 {cityName} 的時間</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {/* 如果有備註，則顯示備註信息 */}
      {notes && (
        <div className={styles.row}>
          <h6>你的備註</h6>
          <p>{notes}</p>
        </div>
      )}

      {/* 提供了相關的外部連結到維基百科 */}
      <div className={styles.row}>
        <h6>了解更多</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          查看 {cityName} 的維基百科條目 &rarr;
        </a>
      </div>

      {/* 返回按鈕 */}
      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
