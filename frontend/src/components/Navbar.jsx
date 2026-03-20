import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, role } = useAuth();
  return (
    <nav className="fixed top-0 w-full z-50 h-16 bg-gradient-to-r from-slate-800 via-gray-500 to-slate-900">
      <div className="max-w-4xl mx-auto h-full p-4">
        <h1 className="text-neutral-950 text-4xl text-center font-serif z-10">
          EduConnect
        </h1>
        <div className="flex gap-4">

          {role === "docente" && (
            <button>Crear post</button>
          )}
        </div>
        <button
          onClick={logout}
          className="bg-slate-700 hover:bg-slate-600 text-gray-950 transition px-4 py-2 rounded-lg absolute bottom-3 right-3 "
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;