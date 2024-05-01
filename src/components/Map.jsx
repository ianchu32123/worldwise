import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../context/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";

// 地圖組件
function Map() {
  const { cities } = useCities(); // 使用城市上下文中的城市數據
  const [mapPosition, setMapPosition] = useState([40, 0]); // 地圖位置狀態
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation(); // 使用地理定位鉤子
  const [searchParams] = useSearchParams(); // 使用 URL 查詢參數
  const mapLat = searchParams.get("lat"); // 地圖緯度
  const mapLng = searchParams.get("lng"); // 地圖經度

  // 在組件加載時根據 URL 查詢參數設置地圖位置
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  // 在組件加載時根據地理定位設置地圖位置
  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {/* 使用按鈕觸發地理定位 */}
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}

      {/* 地圖容器 */}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        {/* 地圖瓦片 */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {/* 渲染城市標記 */}
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}

        {/* 更改地圖中心 */}
        <ChangeCenter position={mapPosition} />
        {/* 檢測地圖點擊事件 */}
        <DetectClick />
      </MapContainer>
    </div>
  );
}

// 更改地圖中心組件
function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position); // 設置地圖視圖位置
  return null;
}

// 檢測地圖點擊組件
function DetectClick() {
  const navigate = useNavigate();
  const map = useMap();

  // 使用地圖事件鉤子檢測點擊事件
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng; // 獲取點擊位置的緯度和經度
      navigate(`form?lat=${lat}&lng=${lng}`); // 導航到表單頁面並帶上經緯度參數
      map.setView([lat, lng]); // 設置地圖視圖位置
    },
  });

  return null;
}

export default Map;
