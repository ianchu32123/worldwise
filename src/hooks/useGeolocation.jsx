import { useState } from "react";

// 自定義 hook，用於獲取地理位置信息
export function useGeolocation(defaultPosition) {
  // 定義狀態變量，分別用於表示加載狀態、地理位置和錯誤信息
  const [isLoading, setIsLoading] = useState(false); // 表示是否正在加載地理位置信息
  const [position, setPosition] = useState(defaultPosition); // 表示地理位置信息，默認為傳入的默認位置
  const [error, setError] = useState(null); // 表示可能發生的錯誤信息

  // 函數，用於獲取地理位置
  function getPosition() {
    // 如果瀏覽器不支持地理位置功能，設置錯誤信息並返回
    if (!navigator.geolocation) {
      return setError("Your browser does not support geolocation");
    }

    // 啟動加載狀態
    setIsLoading(true);

    // 使用瀏覽器的地理位置 API 獲取用戶當前位置
    navigator.geolocation.getCurrentPosition(
      // 成功獲取地理位置時的回調函數
      (pos) => {
        // 將獲取到的地理位置信息設置到狀態中
        setPosition({
          lat: pos.coords.latitude, // 緯度
          lng: pos.coords.longitude, // 經度
        });
        // 停止加載狀態
        setIsLoading(false);
      },
      // 獲取地理位置失敗時的回調函數
      (error) => {
        // 設置錯誤信息
        setError(error.message);
        // 停止加載狀態
        setIsLoading(false);
      }
    );
  }

  // 返回加載狀態、地理位置、錯誤信息和獲取地理位置的函數
  return { isLoading, position, error, getPosition };
}
