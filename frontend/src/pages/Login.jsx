import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import fondoImagen from "../fondos/darkFondo.png";

function Login() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      await login(username, password);

      navigate("/");

    } catch (err) {

      setError("Credenciales incorrectas");

    }

  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${fondoImagen})` }}
    >

      <div className="w-full max-w-md bg-slate-600 p-8 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Bienvenido a EduConnect
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />

          {error && (
            <p className="text-slate-800 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-slate-500 text-white p-3 rounded-lg hover:bg-slate-400"
          >
            Ingresar
          </button>

          <div className="mt-3 text-center">
            <p>¿No tienes cuenta?</p>

            <a
              href="/register"
              className="text-blue-300 hover:underline"
            >
              Registrarse como estudiante
            </a>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Login;