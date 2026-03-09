import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username, password) => {
    const res = await axios.post("/login/", {
      username,
      password,
    });

    const { access, refresh, user } = res.data;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    }

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    role: user?.role,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};