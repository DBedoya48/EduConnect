export const login = (tokens) => {
  localStorage.setItem("access", tokens.access);
  localStorage.setItem("refresh", tokens.refresh);
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access");
};