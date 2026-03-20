import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";
import CommentList from "../components/comments/CommentList";
import CommentForm from "../components/comments/CommentForm";
import fondoImagen from '../fondos/darkFondo.png';

function Feed() {
  const user = JSON.parse(localStorage.getItem("user"));
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
  const [currentUrl, setCurrentUrl] = useState("/posts/");
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
    fetchPosts(currentUrl);
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
    const url = `/posts/?category=${categoryId}`;
    setCurrentUrl(url);
    setActiveFilter(categoryId);
    
    try {
      setLoading(true);
      const res = await axios.get(url);
      setPosts(res.data.results || res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error filtrando:", err);
      
      setLoading(false);
    }
  };

  const fetchRandomPosts = async () => {
    const url = "/posts/random/";
    setCurrentUrl(url);
    try {
      setLoading(true);
      const res = await axios.get(url);
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
      fetchPosts(currentUrl);
    } catch (err) {
      console.error("Error reaccionando:", err);
    }
  };
  
  const deleteComment = async (id) => {
    try {
      await axios.delete(`/comments/${id}/`);

      setPosts((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          comments: post.comments.filter((c) => c.id !== id),
        }))
      );
    } catch (error) {
      console.error("Error eliminando comentario", error);
    }
  };
  const editComment = async (id, newContent) => {
    try {
      await axios.patch(`/comments/${id}/`, {
        content: newContent,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) => ({
          ...post,
          comments: post.comments.map((c) =>
            c.id === id ? { ...c, content: newContent } : c
          ),
        }))
      );
    } catch (error) {
      console.error("Error editando comentario", error);
    }
  };
  console.log(posts);
  return (
    <MainLayout>
      
      <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${fondoImagen})` }}
      >
        <div className="w-full grid grid-cols-12 gap-6 px-10 pt-8">

          {/* 🔵 COLUMNA IZQUIERDA - FORM STICKY */}
          <div className="lg:col-span-3 pr-6 sticky top-40 self-start">
            <form
              onSubmit={handleCreatePost}
              className="bg-slate-500 shadow-md rounded-2xl p-3 "
            >
              <h3 className="font-semibold mb-4">Subir Post</h3>

              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Título"
                className="w-full border rounded-lg p-3 mb-3 bg-slate-300"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripcion"
                className="w-full border rounded-lg p-3 mb-2 bg-slate-300"
              />

              <div ref={dropdownRef} className="relative w-full bg-slate-300 rounded-md text-white">
                {/* BOTÓN PRINCIPAL */}
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="border rounded-lg p-3 mb-3 cursor-pointer text-white"
                  style={{
                    backgroundColor:
                      categoryForPost
                        ? categories.find(c => c.id === categoryForPost)?.color
                        : "bg-slate-300",
                    color: categoryForPost ? "white" : "#6b7280"
                  }}
                >
                  {categoryForPost
                    ? categories.find(c => c.id === (categoryForPost))?.name
                    : "Seleccionar categoría"}
                </div>

                {/* LISTA DESPLEGABLE */}
                {isOpen && (
                  <div className="absolute w-full mt-1 border rounded-md shadow z-10">
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
                className="w-full border rounded-lg p-3 bg-slate-300"
              />

              <input
                type="file"
                ref={fileRef}
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-4 py-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                file:text-gray-950 file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor:pointer"
              />

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-3">
                <p className="text-sm text-gray-400 mb-2">
                  Arrastra una imagen o haz click
                </p>
                <input
                  type="file"
                  accept="image/*"
                  ref={imageRef}
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full px-4 py-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                file:text-gray-950 file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor:pointer"
                />
              </div>

              <button
                type="submit"
                className="bg-slate-700 hover:bg-slate-600 text-gray-950 px-4 py-2 rounded-lg w-full"
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
              <div className="bg-slate-500 rounded-2xl shadow-md p-6 text-center text-gray-500">
                📭 Esta categoría aún no tiene publicaciones
              </div>
            )}

            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-400 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl p-6 border border-l-8 min-w-3"
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
                  <CommentList
                    comments={post.comments}
                    user={user}
                    editComment={editComment}
                    deleteComment={deleteComment}
                  />
                  <CommentForm
                    postId={post.id}
                    refreshPosts={() => fetchPosts(currentUrl)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 🟣 COLUMNA DERECHA - CATEGORÍAS */}
          <div className="lg:col-span-3 pl-6 sticky top-40 self-start">
            <div className="bg-slate-500 shadow-md rounded-2xl p-6">
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