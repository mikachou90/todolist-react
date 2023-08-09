import { createContext, useState, useEffect } from 'react';
import { login, register, checkPermission } from '../api/auth';
import * as jwt from 'jsonwebtoken';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';

//定義共享的狀態和方法
const defaultAuthContext = {
  isAuthenticated: false,
  currentMember: null,
  register: null,
  login: null,
  logout: null,
};

const AuthContext = createContext(defaultAuthContext);

//自定義hook，在其他元件只要匯入 useAuth 就能取用這個 Context 的內容
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState(null);
  const { pathname } = useLocation();

  //在頁面轉換時驗證token
  useEffect(() => {
    const checkTokenIsValid = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setIsAuthenticated(false);
        setPayload(null);
        return;
      }
      const result = await checkPermission(authToken);
      if (result) {
        setIsAuthenticated(true);
        const tempPayload = jwt.decode(authToken);
        setPayload(tempPayload);
      } else {
        setIsAuthenticated(false);
        setPayload(null);
      }
    };

    checkTokenIsValid();
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentMember: payload,

        register: async (data) => {
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (authToken) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },

        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            email: data.email,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (authToken) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },

        logout: () => {
          localStorage.removeItem('authToken');
          setPayload(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
