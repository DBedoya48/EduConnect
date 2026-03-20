import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function SubNavbar() {

  const { user } = useAuth();

  return (
    <div className="w-full z-50 h-16 bg-gradient-to-r from-slate-800 via-gray-500 to-slate-900 shadow-md shadow-gray-500 fixed top-16 left-0 z-4">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 h-12"
      >

        {location.pathname !== "/" && (<Link to="/" className="font-medium hover:text-slate-300" >Inicio</Link>)}
        <Link to="/Profile" className="font-medium hover:text-slate-300">Perfil</Link>
        <Link to="/Notifications" className="font-medium hover:text-slate-300">Notificaciones</Link>
        {user?.role === "DOCENTE" && (
          <Link to="/docenteDashboard" className="font-medium hover:text-slate-300">crear eventos</Link>
        )}

        {user?.role === "ADMIN" && (
          <Link to="/Register" className="font-medium hover:text-slate-300">crear usuario</Link>
        )}
      </div>
    </div>
  );
}

export default SubNavbar;