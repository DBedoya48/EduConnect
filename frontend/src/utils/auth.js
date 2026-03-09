import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login/`, {
    username,
    password,
  });

  const data = response.data;
   console.log(response.data);

  // guardar tokens
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);

  // guardar usuario
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

export function logout () {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user")
  window.location.href = "/login";
}