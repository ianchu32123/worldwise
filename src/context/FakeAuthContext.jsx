import { createContext, useContext, useReducer } from "react";

// 創建一個上下文，用於管理身份驗證相關的狀態和操作
const AuthContext = createContext();

// 定義初始狀態
const initialState = {
  user: null, // 用戶信息
  isAuthenticated: false, // 是否已通過身份驗證
};

// reducer 函數，根據不同的操作類型更新狀態
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true }; // 登錄操作：更新用戶信息和身份驗證狀態
    case "logout":
      return { ...state, user: null, isAuthenticated: false }; // 登出操作：清空用戶信息並設置為未通過身份驗證
    default:
      throw new Error("未知錯誤"); // 預設操作：拋出未知錯誤
  }
}

// 虛擬用戶信息
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

// 身份驗證提供者，用於提供身份驗證相關的狀態和操作給子組件使用
function AuthProvider({ children }) {
  // 使用 useReducer hook 創建狀態和 dispatch 函數
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // 登錄操作，驗證用戶名稱和密碼，並根據結果 dispatch 對應的 action
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER }); // 登錄成功：dispatch 登錄操作並傳遞用戶信息
    }
  }

  // 登出操作，清空用戶信息
  function logout() {
    dispatch({ type: "logout" }); // 調用 logout action 清空用戶信息
  }

  // 將用戶信息、身份驗證狀態、登錄和登出函數作為值提供給 AuthContext.Provider
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定義 hook：用於在組件中獲取身份驗證相關的狀態和操作
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("authcontext was used outside authprovider"); // 確保在 AuthProvider 之內使用 useAuth，否則拋出錯誤
  }
  return context;
}

// 導出 AuthProvider 和 useAuth，以便其他組件使用
export { AuthProvider, useAuth };
