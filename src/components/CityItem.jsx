import React from "react";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";
import { useCities } from "../context/CitiesContext";

// 格式化日期函數，將日期對象轉換為特定格式的字符串
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

// 城市項目組件
export default function CityItem({ city }) {
  // 使用 useCities hook 從上下文中獲取當前城市和刪除城市的函數
  const { currentCity, deleteCity } = useCities();

  // 點擊刪除按鈕時的處理函數
  function handleclick(e) {
    e.preventDefault();
    deleteCity(city.id); // 調用 deleteCity 函數刪除城市
  }

  return (
    <li>
      {/* 使用 Link 組件將城市信息傳遞到 City 組件 */}
      <Link
        className={`${styles.cityItem} ${
          city.id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${city.id}?lat=${city.position.lat}&lng=${city.position.lng}`}
      >
        {/* 城市的表情符號 */}
        <span className={styles.emoji}>{city.emoji}</span>
        {/* 城市名稱 */}
        <h3 className={styles.name}>{city.cityName}</h3>
        {/* 遊覽日期 */}
        <time className={styles.date}>{formatDate(city.date)}</time>
        {/* 刪除按鈕 */}
        <button className={styles.deleteBtn} onClick={handleclick}>
          &times;
        </button>
      </Link>
    </li>
  );
}
