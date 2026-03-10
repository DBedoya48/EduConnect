import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";


function Profile() {

  const { user, role, loading } = useAuth();

  if (loading) {
    return <p>Cargando perfil...</p>;
  }

  if (!user) {
    return <p>No autenticado</p>;
  }
  
  return (
    <MainLayout>
        <div className="max-w-3xl mx-auto mt-24 p-6 bg-white rounded-xl shadow">

        <h2 className="text-2xl font-bold mb-4">
            Perfil de {user.username}
        </h2>

        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>

        <div className="mt-6 space-y-3">

            {/* OPCIONES ESTUDIANTE */}
            {role === "estudiante" && (
            <>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Ver cursos
                </button>

                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Inscribirme en proyectos
                </button>
            </>
            )}

            {/* OPCIONES DOCENTE */}
            {role === "docente" && (
            <>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                Crear curso
                </button>

                <button className="bg-green-500 text-white px-4 py-2 rounded">
                Gestionar estudiantes
                </button>
            </>
            )}

            {/* OPCIONES ADMIN */}
            {role === "admin" && (
            <>
                <button className="bg-purple-500 text-white px-4 py-2 rounded">
                Administrar usuarios
                </button>

                <button className="bg-purple-500 text-white px-4 py-2 rounded">
                Crear docentes
                </button>
            </>
            )}

        </div>

        </div>
    </MainLayout>    
  );
}

export default Profile;