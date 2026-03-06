import { useAuth } from "../context/AuthContext";

function SubNavbar() {

  const { user } = useAuth();

  return (
    <div className="w-full bg-gradient-to-r from-gray-900 via-violet-400 to-gray-500 shadow-sm fixed top-16 left-0 z-4">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 h-12 text-purple-950">

        <a href="/feed" className="font-medium hover:text-blue-600">
          Inicio
        </a>

        <a href="/explorar" className="font-medium hover:text-blue-600">
          Explorar
        </a>

        {user?.role === "teacher" && (
          <a href="/mis-clases" className="font-medium hover:text-blue-600">
            Mis clases
          </a>
        )}

        {user?.role === "admin" && (
          <a href="/admin" className="font-medium hover:text-red-600">
            Panel Admin
          </a>
        )}

        <div className="relative group">

          <button className="font-medium hover:text-blue-600">
            Recursos ▾
          </button>

          <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg mt-2 w-40 border">

            <a
              href="/documentos"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Documentos
            </a>

            <a
              href="/videos"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Videos
            </a>

            <a
              href="/links"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Links
            </a>

          </div>

        </div>

      </div>
    </div>
  );
}

export default SubNavbar;