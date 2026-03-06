import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App;