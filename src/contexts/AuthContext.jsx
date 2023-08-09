import { createContext, useState } from 'react';
import { login, register } from '../api/auth';
import * as jwt from 'jsonwebtoken';

//定義共享的狀態和方法
const defaultAuthContext = {
  isAuthenticated: false,
  currentMember: null,
  register: null,
  login: null,
  logout: null,
};

const AuthContext = createContext(defaultAuthContext);
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState(null);

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

export default AuthContext;
