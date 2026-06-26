import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '@/lib/userApi';

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('customer');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    localStorage.setItem('customer_token', res.data.data.token);
    localStorage.setItem('customer', JSON.stringify(res.data.data.user));
    setUser(res.data.data.user);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    localStorage.setItem('customer_token', res.data.data.token);
    localStorage.setItem('customer', JSON.stringify(res.data.data.user));
    setUser(res.data.data.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer');
    setUser(null);
  };

  return (
    <UserAuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => useContext(UserAuthContext);
