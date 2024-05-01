import { createContext, useContext, useEffect, useState } from "react";

// 定義 API 的基本 URL
const BASE_URL = "http://localhost:8000";

// 創建一個 Context 來管理城市相關的狀態
const CitiesContext = createContext();

// 城市提供者，用於提供城市相關的狀態和方法給子組件使用
function CitiesProvider({ children }) {
  // 狀態變量：存儲城市數據、加載狀態、當前城市
  const [cities, setCities] = useState([]); // 城市數據
  const [isLoading, setIsLoading] = useState(false); // 加載狀態
  const [currentCity, setCurrentCity] = useState({}); // 當前城市

  // 在組件渲染後，獲取所有城市數據
  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        // 發送 GET 請求獲取所有城市數據
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        // 更新狀態中的城市數據
        setCities(data);
      } catch {
        // 發生錯誤時彈出提示框
        alert("無法獲取城市數據");
      } finally {
        // 無論請求成功或失敗，都要將加載狀態設置為 false
        setIsLoading(false);
      }
    }
    // 執行獲取城市數據的函數
    fetchCities();
  }, []);

  // 函數：根據城市 ID 獲取單個城市的詳細信息
  async function getCity(id) {
    try {
      setIsLoading(true);
      // 發送 GET 請求獲取指定 ID 的城市信息
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      // 更新當前城市的狀態
      setCurrentCity(data);
    } catch {
      // 發生錯誤時彈出提示框
      alert("無法獲取城市詳細信息");
    } finally {
      setIsLoading(false);
    }
  }

  // 函數：創建新城市
  async function createCity(newCity) {
    try {
      setIsLoading(true);
      // 發送 POST 請求創建新城市，並將新城市數據添加到現有城市數據中
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCities((prevCities) => [...prevCities, data]);
    } catch {
      // 發生錯誤時彈出提示框
      alert("創建新城市時發生問題");
    } finally {
      setIsLoading(false);
    }
  }

  // 函數：刪除指定 ID 的城市
  async function deleteCity(id) {
    try {
      setIsLoading(true);
      // 發送 DELETE 請求刪除指定 ID 的城市，並更新城市列表數據
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      setCities((prevCities) => prevCities.filter((city) => city.id !== id));
    } catch {
      // 發生錯誤時彈出提示框
      alert("刪除城市時發生問題");
    } finally {
      setIsLoading(false);
    }
  }

  // 返回城市相關的狀態和方法，供其他組件使用
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

// 自定義 hook：用於在組件中使用城市相關的狀態和方法
function useCities() {
  const context = useContext(CitiesContext);
  // 如果在 CitiesProvider 之外使用 useCities，則拋出錯誤
  if (context === undefined) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}

// 導出 CitiesProvider 和 useCities，以便其他組件使用
export { CitiesProvider, useCities };
