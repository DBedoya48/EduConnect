import Navbar from "../components/Navbar";
import SubNavbar from "../components/SubNavbar";

export default function MainLayout({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      {user && <Navbar />}
      {user && <SubNavbar />}

      <div className="pt-28">
        {children}
      </div>
    </>
  );
}