import axios from "../api/axios";
import { useEffect, useState, useRef } from "react";
import MainLayout from "../layouts/MainLayout";

function Feed() {
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryForPost, setCategoryForPost] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const dropdownRef = useRef(null);
  const imageRef = useRef(null);
  const fileRef = useRef(null);
  const fetchPosts = async (url) => {
    try {
      setLoading(true);
      const res = await axios.get(url);
      setPosts(res.data.results || res.data);
      setLoading(false);
    } catch (err) { /*...*/ }
  };
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories/");
      setCategories(res.data.results || res.data);
    } catch (err) { /*...*/ }
  };

  useEffect(() => {
    fetchPosts("/posts/");
    fetchCategories();
  }, []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterByCategory = async (categoryId) => {
    setActiveFilter(categoryId);
    
    try {
      setLoading(true);
      const res = await axios.get(`/posts/?category=${categoryId}`);
      setPosts(res.data.results || res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error filtrando:", err);
      setLoading(false);
    }
  };

  const fetchRandomPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/posts/random/");
      setPosts(res.data.results || res.data);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    formData.append("description", description);
    formData.append("link", link);
    if (categoryForPost) {
      formData.append("category", categoryForPost);
    }

    if (image) formData.append("image", image);
    if (file) formData.append("file", file);
    

    try {
      const res = await axios.post("/posts/", formData);

      // Agrega el nuevo post arriba del feed sin refetch
      setPosts((prevPosts) => [res.data, ...prevPosts]);

      setContent("");
      setDescription("");
      setImage(null);
      setFile(null);
      setLink("");
      setCategoryForPost("");
    } catch (err) {
      console.error("Error creando post:", err.response?.data);
    }
    if (imageRef.current) imageRef.current.value = "";
    if (fileRef.current) fileRef.current.value = "";
  };
  const handleReaction = async (postId, reactionType) => {
    try {
      await axios.post(`/posts/${postId}/react/`, {
        reaction: reactionType,
      });

      // Volver a pedir los posts para tener contadores reales
      fetchPosts("/posts/");
    } catch (err) {
      console.error("Error reaccionando:", err);
    }
  };
  console.log(posts);
  return (
    <MainLayout>
      <div className="bg-gray-400 min-h-screen mt-10">
        <div className="w-full grid grid-cols-12 gap-6 px-10">

          {/* 🔵 COLUMNA IZQUIERDA - FORM STICKY */}
          <div className="lg:col-span-3 pl-6 sticky top-40 self-start">
            <form
              onSubmit={handleCreatePost}
              className="bg-white shadow-md rounded-2xl p-3 "
            >
              <h3 className="font-semibold mb-4">Crear publicación</h3>

              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Título"
                className="w-full border rounded-lg p-3"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripcion"
                className="w-full border rounded-lg p-3"
              />

              <div ref={dropdownRef} className="relative w-full">
                {/* BOTÓN PRINCIPAL */}
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="border rounded-lg p-3 cursor-pointer text-white"
                  style={{
                    backgroundColor:
                      categoryForPost
                        ? categories.find(c => c.id === categoryForPost)?.color
                        : "#ffffff",
                    color: categoryForPost ? "#ffffff" : "#6b7280"
                  }}
                >
                  {categoryForPost
                    ? categories.find(c => c.id === (categoryForPost))?.name
                    : "Seleccionar categoría"}
                </div>

                {/* LISTA DESPLEGABLE */}
                {isOpen && (
                  <div className="absolute w-full mt-1 border rounded-lg bg-white shadow z-10">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={(e) => {
                        e.stopPropagation();
                        setCategoryForPost(cat.id);
                        setIsOpen(false);
                        }}
                        className="p-3 cursor-pointer text-white"
                        style={{ backgroundColor: cat.color }}
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                )}
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
                ref={fileRef}
                onChange={(e) => setFile(e.target.files[0])}
                className="m-3"
              />

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Arrastra una imagen o haz click
                </p>
                <input
                  type="file"
                  accept="image/*"
                  ref={imageRef}
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
              >
                Publicar
              </button>
            </form>
          </div>

          {/* 🟢 COLUMNA CENTRAL - FEED */}
          <div className="lg:col-span-6 mx-auto space-y-6">
            {loading && (
              <div className="text-center text-gray-500">
                Cargando publicaciones...
              </div>
            )}

            {!loading && posts.length === 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6 text-center text-gray-500">
                📭 Esta categoría aún no tiene publicaciones
              </div>
            )}

            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-300 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl p-6 border border-l-8 min-w-3"
                style={{ borderColor: post.category_color || "#e5e7eb",
                }}
                >
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">

                  <span>{post.author}</span>

                  <span>•</span>

                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: post.category_color,
                      color: "white"
                    }}
                  >
                    {post.category_name}
                  </span>

                </div>
                <h2 className="text-lg font-semibold mt-2">{post.content}</h2>
                <p className="mt-2 text-gray-700">{post.description}</p>
                {/* 🖼 Imagen */}
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="mt-3 rounded-xl max-h-96 w-full object-cover"
                  />
                )}

                {/* 📎 Archivo */}
                {post.file && (
                  <a
                    href={post.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-blue-600 underline"
                  >
                    📎 Descargar archivo
                  </a>
                )}
                <div className="flex gap-6 mt-4 text-sm">
                  <button
                    onClick={() => handleReaction(post.id, "like")}
                    className="hover:scale-110 transition"
                  >
                    👍 {post.likes_count}
                  </button>

                  <button
                    onClick={() => handleReaction(post.id, "love")}
                    className="hover:scale-110 transition"
                  >
                    ❤️ {post.love_count}
                  </button>

                  <button
                    onClick={() => handleReaction(post.id, "care")}
                    className="hover:scale-110 transition"
                  >
                    🤗 {post.care_count}
                  </button>
                </div>
                <div>
                  {post.comments?.length > 0 && (
                    <div className="mt-4 border-t pt-3 space-y-2">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="text-sm">
                          <span className="font-semibold">
                            {comment.user}
                          </span>{" "}
                          {comment.content}
                        </div>
                      ))}
                    </div>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const content = e.target.comment.value;
                      axios.post(`/posts/${post.id}/comment/`, { content })
                        .then(() => fetchPosts("/posts/"));
                        e.target.reset();
                        fetchPosts("/posts/");
                    }}
                  >
                    <input
                      name="comment"
                      placeholder="Escribe un comentario..."
                      className="w-full border rounded-lg p-2 mt-3"
                    />
                  </form>
                </div>
              </div>
            ))}
          </div>

          {/* 🟣 COLUMNA DERECHA - CATEGORÍAS */}
          <div className="lg:col-span-3 pr-6 sticky top-40 self-start">
            <div className="bg-white shadow-md rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Categorías</h3>
              <div
                onClick={fetchRandomPosts}
                className="cursor-pointer text-blue-600 font-medium mb-3"
              >
                🎲 Aleatorio
              </div>
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
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Feed;