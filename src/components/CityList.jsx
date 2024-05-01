import React from "react";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../context/CitiesContext";

// 城市列表組件
export default function CityList() {
  // 使用 useCities hook 從上下文中獲取城市數據和加載狀態
  const { cities, isLoading } = useCities();

  // 如果正在加載中，則顯示 Spinner 組件
  if (isLoading) {
    return <Spinner />;
  }

  // 如果城市列表為空，則顯示消息組件提示用戶添加城市
  if (!cities.length) {
    return <Message message="添加你在地圖上的第一個城市" />;
  }

  // 遍歷城市數據，對每個城市創建 CityItem 組件並顯示在列表中
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}
