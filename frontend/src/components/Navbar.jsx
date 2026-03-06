import { logout } from "../utils/auth";

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 h-16 bg-gradient-to-r from-gray-900 via-violet-400 to-gray-500">
      <div className="max-w-4xl mx-auto h-full p-4">
        <h1 className="text-fuchsia-900 text-4xl text-center font-serif z-10">
          EduConnect
        </h1>

        <button
          onClick={logout}
          className="bg-purple-600 hover:bg-purple-500 transition text-black px-4 py-2 rounded-lg absolute bottom-3 right-3 "
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;