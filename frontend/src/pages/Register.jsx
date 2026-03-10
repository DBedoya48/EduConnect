import { useState } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";

function Register() {

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    institution: "",
    role: "estudiante"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post("/users/", formData);

      setMessage(response.data.message || "Usuario creado correctamente");

    } catch (error) {

      console.log("ERROR BACKEND:", error.response?.data);

      setMessage(
        JSON.stringify(error.response?.data)
      );

    }

  };

  return (
    <MainLayout>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">

        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

            <h2 className="text-2xl font-bold text-center mb-6">
            Registro de Usuario
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

            <input
                type="text"
                name="username"
                placeholder="Usuario"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
            />

            <input
                type="email"
                name="email"
                placeholder="Correo"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
            />

            <input
                type="password"
                name="password"
                placeholder="Contraseña"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
            />

            <input
                type="text"
                name="first_name"
                placeholder="Nombre"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
            />

            <input
                type="text"
                name="last_name"
                placeholder="Apellido"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
            />

            <input
                type="text"
                name="institution"
                placeholder="Institución"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
            />

            {/* Selector de rol SOLO para docente o admin */}

            {(role === "admin" || role === "docente") && (

                <select
                name="role"
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                >

                <option value="estudiante">Estudiante</option>

                <option value="investigador">Investigador</option>

                {role === "admin" && (
                    <option value="docente">Docente</option>
                )}

                </select>

            )}

            <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
            >
                Crear usuario
            </button>

            </form>

            {message && (
            <p className="mt-4 text-center text-sm text-red-500">
                {message}
            </p>
            )}

        </div>

        </div>
   </MainLayout>
  );
}

export default Register;