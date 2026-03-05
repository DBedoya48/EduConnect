import { logout } from "../utils/auth";

function Navbar() {
  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50 h-16">
      <div className="max-w-4xl mx-auto flex justify-between items-center h-full p-4">
        <h1 className="text-xl font-bold text-blue-600">
          EduConnect
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded-lg"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;