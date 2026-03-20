import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import fondoImagen from '../fondos/darkFondo.png';

function Notifications() {
  const { user, role, loading } = useAuth();

  const [form, setForm] = useState({
    username: user?.username || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
  });

  const [image, setImage] = useState(null);

  if (loading) return <p>Cargando perfil...</p>;
  if (!user) return <p>No autenticado</p>;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
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
      const res = await fetch("/api/profile/update/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: data,
      });

      if (res.ok) {
        alert("Perfil actualizado");
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
            <div className="max-w-4xl mx-auto mt-24 bg-white p-8 rounded-xl shadow">
                {/* HEADER */}
                <div className="flex items-center gap-6 mb-6">
                <img
                    src={user.profile_image || "/default-avatar.png"}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover"
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
                    className="w-full border p-2 rounded"
                />

                <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="esto es una actualizacion"
                    className="w-full border p-2 rounded"
                />

                <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Apellido"
                    className="w-full border p-2 rounded"
                />

                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                />

                <input
                    type="file"
                    onChange={handleImage}
                    className="w-full"
                />

                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Guardar cambios
                </button>
                </form>

                {/* CAMBIAR CONTRASEÑA */}
                <div className="mt-10">
                <h3 className="text-xl font-bold mb-3">
                    Cambiar contraseña
                </h3>

                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    className="w-full border p-2 rounded mb-2"
                />

                <button className="bg-red-500 text-white px-4 py-2 rounded">
                    Actualizar contraseña
                </button>
                </div>

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

export default Notifications;