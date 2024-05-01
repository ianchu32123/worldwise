import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Product from "./pages/product";
import Pricing from "./pages/pricing";
import Homepage from "./pages/Homepage";
import Pagenotfound from "./pages/Pagenotfound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountriesList from "./components/CountriesList";
import City from "./components/City";
import Form from "./components/Form";
import { CitiesProvider } from "./context/CitiesContext"; // 导入城市上下文提供者
import { AuthProvider } from "./context/FakeAuthContext"; // 导入身份认证上下文提供者
import ProtectRoute from "./pages/ProtectRoute"; // 导入受保护路由组件

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* 使用身份认证上下文提供者包裹整个应用 */}
      <CitiesProvider>
        {" "}
        {/* 使用城市上下文提供者包裹整个应用 */}
        <BrowserRouter>
          {" "}
          {/* 使用 BrowserRouter 包裹整个应用 */}
          <Routes>
            {" "}
            {/* 定义路由 */}
            <Route path="/" element={<Homepage />} />{" "}
            {/* 匹配根路径并渲染 Homepage 组件 */}
            <Route path="product" element={<Product />} />{" "}
            {/* 匹配 "/product" 路径并渲染 Product 组件 */}
            <Route path="pricing" element={<Pricing />} />{" "}
            {/* 匹配 "/pricing" 路径并渲染 Pricing 组件 */}
            <Route path="login" element={<Login />} />{" "}
            {/* 匹配 "/login" 路径并渲染 Login 组件 */}
            {/* 匹配 "/app" 路径并渲染受保护的应用布局 */}
            <Route
              path="app"
              element={
                <ProtectRoute>
                  {" "}
                  {/* 使用受保护路由组件包裹 */}
                  <AppLayout /> {/* 渲染应用布局组件 */}
                </ProtectRoute>
              }
            >
              <Route index element={<Navigate replace to="cities" />} />{" "}
              {/* 匹配 "/app" 路径下的默认路由，并将用户重定向到 "/cities" */}
              <Route path="cities" element={<CityList />} />{" "}
              {/* 匹配 "/app/cities" 路径并渲染 CityList 组件 */}
              <Route path="cities/:id" element={<City />} />{" "}
              {/* 匹配 "/app/cities/:id" 路径并渲染 City 组件 */}
              <Route path="countries" element={<CountriesList />} />{" "}
              {/* 匹配 "/app/countries" 路径并渲染 CountriesList 组件 */}
              <Route path="form" element={<Form />} />{" "}
              {/* 匹配 "/app/form" 路径并渲染 Form 组件 */}
            </Route>
            <Route path="*" element={<Pagenotfound />} />{" "}
            {/* 匹配所有未匹配到的路径并渲染 Pagenotfound 组件 */}
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
