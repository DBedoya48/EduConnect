import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import fondoImagen from '../fondos/darkFondo.png';
import {useState, useRef, useEffect } from "react";
import defaultPic from '../images/foto_default.jpg';

function Profile() {
  const { user, role, loading } = useAuth();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    username: user?.username || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    password: "",
  });

  const [image, setImage] = useState(null);

  if (loading) return <p>Cargando perfil...</p>;
  if (!user) return <p>No autenticado</p>;

  useEffect(() => {
  if (user) {
    setForm({
      username: user.username || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      password: user.password || "",
    });
  }

}, [user]);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = (e.target.files[0]);
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    if (image) {
      data.append("profile_image", image);
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/me/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: data,
      });

      const result = await res.json();
      console.log("RESPONSE:", result);
      if (res.ok) {
        alert("Perfil actualizado, vuelve a iniciar sesión");
          localStorage.clear();
          window.location.href = "/login";
      } else {
        console.error("Error backend:", result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MainLayout>
        <div className="flex justify-center min-h-screen"
        style={{ backgroundImage: `url(${fondoImagen})` }}
        >
            <div className="bg-slate-500 shadow-lg rounded-xl p-8 w-full max-w-md">
                {/* HEADER */}
                <div className="flex items-center gap-6 mb-6">
                <img
                  src={preview || user.profile_image || defaultPic}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white"
                />

                <div>
                    <h2 className="text-2xl font-bold">
                    {user.username}
                    </h2>
                    <p className="text-gray-500">{user.email}</p>
                </div>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">

                  <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Username"
                      className="w-full border p-2 rounded bg-slate-300"
                  />

                  <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      placeholder="primer nombre"
                      className="w-full border p-2 rounded bg-slate-300"
                  />

                  <input
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      placeholder="Apellido"
                      className="w-full border p-2 rounded bg-slate-300"
                  />

                  <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full border p-2 rounded bg-slate-300"
                  />

                  <input
                    type="file"
                    ref={fileRef}
                    onChange={handleImage}
                    className="w-full px-4 py-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                    file:text-gray-950 file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor:pointer"
                  />
                  <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Nueva contraseña"
                      className="w-full border p-2 rounded mb-2 bg-slate-300"
                  />

                  <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">
                      Guardar cambios
                  </button>

                </form>
                {/* ACCIONES POR ROL */}
                <div className="mt-8 space-y-3">
                {role === "estudiante" && (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Ver cursos
                    </button>
                )}

                {role === "docente" && (
                    <button className="bg-green-500 text-white px-4 py-2 rounded">
                    Crear curso
                    </button>
                )}

                {role === "admin" && (
                    <button className="bg-purple-500 text-white px-4 py-2 rounded">
                    Administrar usuarios
                    </button>
                )}
                </div>
            </div>
        </div>            
    </MainLayout>
  );
}

export default Profile;