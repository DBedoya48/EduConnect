const API_URL = "http://127.0.0.1:8000/api";

export async function getPosts() {
  const response = await fetch(`${API_URL}/posts/`);
  if (!response.ok) {
    throw new Error("Error al obtener posts");
  }
  return response.json();
}