import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (!token) {
      setLoading(false);
      return;
    }

    const validateUser = async () => {
      try {

        const res = await api.get("/users/me/");

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));

      } catch (error) {

        console.log("Token inválido");
        logout();

      } finally {

        setLoading(false);

      }
    };

    validateUser();

  }, []);

  const login = async (username, password) => {

    const res = await api.post("/login/", {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        role: user?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  return useContext(AuthContext);
};