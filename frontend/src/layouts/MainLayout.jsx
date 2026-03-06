import Navbar from "../components/Navbar";
import SubNavbar from "../components/SubNavbar";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <SubNavbar />

      <div className="pt-28">
        {children}
      </div>
    </>
  );
}