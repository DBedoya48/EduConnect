import { logout } from "../utils/auth";
import { useEffect, useState } from "react";
import axios from "../api/axios";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts("http://127.0.0.1:8000/api/posts/");
  }, []);

  const fetchPosts = async (url) => {
    try {
      setLoading(true);
      const res = await axios.get(url);

      setPosts((prev) => [...prev, ...res.data.results]);
      setNextPage(res.data.next);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        nextPage &&
        !loading
      ) {
        fetchPosts(nextPage);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextPage, loading]);

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      <h3 className="text-xl font-bold">Publicaciones recientes</h3>

      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white shadow rounded-xl p-4"
        >
          <h4 className="font-semibold">{post.author}</h4>
          <p className="mt-2">{post.content}</p>

          <div className="flex gap-4 mt-4 text-sm text-gray-600">
            ❤️ {post.love_count}
            👍 {post.likes_count}
            🤗 {post.care_count}
          </div>
        </div>
      ))}

      {loading && (
        <div className="text-center text-gray-500">
          Cargando...
        </div>
      )}
    </div>
  );
}

export default Feed;