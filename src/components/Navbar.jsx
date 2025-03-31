import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between items-center">
      <h1 className="text-lg font-bold">Chat App</h1>
      <div>
        {user ? (
          <button 
            onClick={handleLogout} 
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition">
            Logout
          </button>
        ) : (
          <Link to="/login" className="px-4 hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
