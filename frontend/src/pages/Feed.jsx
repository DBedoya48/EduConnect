import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";

function Feed() {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchPosts("/posts/");
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("/categories/");
    setCategories(res.data);
  };

  const filterByCategory = async (categoryId) => {
    setSelectedCategory(categoryId);

    const res = await axios.get(`/posts/?category=${categoryId}`);
    setPosts(res.data.results || []);
  };

  const fetchPosts = async (url) => {
    try {
      setLoading(true);
      const res = await axios.get(url);

      setPosts(res.data.results || []);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando posts:", err);
      setLoading(false);
    }
  };
  const fetchRandomPosts = async () => {
    const res = await axios.get("/posts/random/");
    setPosts(res.data);
  };
  const handleCreatePost = async (e) => {
  e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    formData.append("link", link);

    if (image) formData.append("image", image);
    if (file) formData.append("file", file);

    try {
      await axios.post("/posts/", formData);

      setContent("");
      setImage(null);
      setFile(null);
      setLink("");

      fetchPosts("/posts/"); // refrescar feed
    } catch (err) {
      console.error("Error creando post:", err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-100 min-h-screen pt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6 px-6">

          {/* 🔵 COLUMNA IZQUIERDA - FORM STICKY */}
          <div className="sticky top-24 h-fit">
            <form
              onSubmit={handleCreatePost}
              className="bg-white shadow-md rounded-2xl p-6"
            >
              <h3 className="font-semibold mb-4">Crear publicación</h3>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="título"
                className="w-full border rounded-lg p-3 mb-3"
              />
              <div>
              formData.append("category", selectedCategory);
              </div>

              <input
                type="url"
                placeholder="Agregar enlace"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full border rounded-lg p-3 mb-3"
              />

              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mb-3"
              />

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
              >
                Publicar
              </button>
            </form>
          </div>

          {/* 🟢 COLUMNA CENTRAL - FEED */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow-md hover:shadow-lg transition rounded-2xl p-6"
              >
                <h4 className="font-semibold">{post.author}</h4>

                <p className="mt-3">{post.content}</p>
                {/* 🖼 Imagen */}
                {post.image && (
                  <img
                    src={`http://127.0.0.1:8000${post.image}`}
                    alt="Post"
                    className="mt-3 rounded-xl max-h-96 w-full object-cover"
                  />
                )}

                {/* 📎 Archivo */}
                {post.file && (
                  <a
                    href={`http://127.0.0.1:8000${post.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-blue-600 underline"
                  >
                    📎 Descargar archivo
                  </a>
                )}
                <div className="flex gap-6 mt-4 text-sm text-gray-500">
                  ❤️ {post.love_count}
                  👍 {post.likes_count}
                  🤗 {post.care_count}
                </div>
              </div>
            ))}
          </div>

          {/* 🟣 COLUMNA DERECHA - CATEGORÍAS */}
          <div className="sticky top-24 h-fit">
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Categorías</h3>

              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => filterByCategory(cat.id)}
                  className="cursor-pointer flex items-center gap-2 mb-3"
                >
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </div>
              ))}

              <div
                onClick={fetchRandomPosts}
                className="cursor-pointer mt-4 text-blue-600 font-medium"
              >
                🎲 Aleatorio
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Feed;