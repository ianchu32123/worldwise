import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/FakeAuthContext";
import styles from "./User.module.css";

// 使用者組件
function User() {
  const { user, logout } = useAuth(); // 使用假身份上下文中的用戶數據和登出函數
  const navigate = useNavigate(); // 使用導航鉤子

  // 點擊登出按鈕時處理函數
  function handleClick() {
    logout(); // 呼叫登出函數
    navigate("/"); // 導航到首頁
  }

  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.name} /> {/* 用戶頭像 */}
      <span>Welcome, {user.name}</span> {/* 歡迎消息 */}
      <button onClick={handleClick}>Logout</button> {/* 登出按鈕 */}
    </div>
  );
}

export default User;

/*
CHALLENGE

1) Add `AuthProvider` to `App.jsx`
2) In the `Login.jsx` page, call `login()` from context
3) Inside an effect, check whether `isAuthenticated === true`. If so, programatically navigate to `/app`
4) In `User.js`, read and display logged in user from context (`user` object). Then include this component in `AppLayout.js`
5) Handle logout button by calling `logout()` and navigating back to `/`
*/
