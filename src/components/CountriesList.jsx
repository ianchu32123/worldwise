import React from "react";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../context/CitiesContext";

// 國家列表組件
export default function CountriesList() {
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

  // 將城市數據轉換為國家列表
  const countries = cities.reduce((arr, city) => {
    // 如果國家列表中不包含當前城市的國家，則將其添加到列表中
    if (!arr.map((el) => el.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else {
      return arr;
    }
  }, []);

  // 遍歷國家列表，對每個國家創建 CountryItem 組件並顯示在列表中
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
}
