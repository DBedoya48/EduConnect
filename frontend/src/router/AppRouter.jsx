import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Feed from "../pages/Feed";

import AdminDashboard from "../pages/AdminDashboard";
import TeacherDashboard from "../pages/DocenteDashboard";
import StudentDashboard from "../pages/EstudianteDashboard";
import InvestDashboard from "../pages/InvestigadorDashboard";

import PrivateRoute from "../components/PrivateRoute";

function AppRouter() {

  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLICAS */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* FEED */}

        <Route 
          path="/"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }  
        />

        {/* PERFIL */}

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* DOCENTE */}

        <Route
          path="/docente"
          element={
            <PrivateRoute roles={["docente"]}>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />

        {/* ESTUDIANTE */}

        <Route
          path="/estudiante"
          element={
            <PrivateRoute roles={["estudiante"]}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/investigador"
          element={
            <PrivateRoute roles={["investigador"]}>
              <InvestDashboard />
            </PrivateRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );

}

export default AppRouter;