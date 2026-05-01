import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const isAdmin = localStorage.getItem("isAdmin");
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("isAdmin");
    nav("/login", { replace: true });
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-4 flex items-center">

      <h1 className="text-xl font-semibold">LeadFlow</h1>

      {!isAdmin && (
        <div className="ml-10 flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/login">Dashboard</Link>
        </div>
      )}

      {/* Logout Button */}
      {isAdmin && (
        <button
          onClick={logout}
          className="ml-auto bg-white text-indigo-600 px-4 py-1 rounded-full font-medium hover:bg-gray-100"
        >
          Logout
        </button>
      )}
    </div>
  );
}