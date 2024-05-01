import { useNavigate } from "react-router-dom";
import Pagenav from "../components/Pagenav";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useAuth } from "../context/FakeAuthContext";

export default function Login() {
  // 開發時預先填充資料
  const [email, setEmail] = useState("jack@example.com"); // 用於儲存電子郵件輸入值的狀態
  const [password, setPassword] = useState("qwerty"); // 用於儲存密碼輸入值的狀態
  const { login, isAuthenticated } = useAuth(); // 使用身份驗證上下文的 hook 來獲取登入函數和身份驗證狀態
  const navigate = useNavigate(); // 路由導航的 hook，用於導航到不同的路由

  // 處理表單提交的函數
  function handleSubmit(e) {
    e.preventDefault(); // 阻止默認表單提交行為

    // 檢查電子郵件和密碼不為空
    if (email && password) {
      login(email, password); // 呼叫身份驗證上下文中的登入函數
    }
  }

  // 效果 hook 用於在驗證通過時將用戶重定向到“/app”路由
  useEffect(
    function () {
      if (isAuthenticated) {
        navigate("/app", { replace: true }); // 導航到“/app”路由，並替換當前的歷史記錄條目
      }
    },
    [isAuthenticated, navigate] // 包含 isAuthenticated 和 navigate 的依賴數組
  );

  return (
    <main className={styles.login}>
      <Pagenav /> {/* 頁面導航組件 */}
      {/* 登錄表單 */}
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* 電子郵件輸入欄位 */}
        <div className={styles.row}>
          <label htmlFor="email">電子郵件地址</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)} // 更新電子郵件狀態
            value={email} // 將電子郵件輸入值綁定到狀態
          />
        </div>

        {/* 密碼輸入欄位 */}
        <div className={styles.row}>
          <label htmlFor="password">密碼</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)} // 更新密碼狀態
            value={password} // 將密碼輸入值綁定到狀態
          />
        </div>

        {/* 登錄按鈕 */}
        <div>
          <Button type="primary">登錄</Button> {/* 登錄按鈕組件 */}
        </div>
      </form>
    </main>
  );
}
