import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />
        <Route path="/chat" element={<Chat />} /> 
        <Route path="/chat" element={<ProtectedRoute user={user} component={Chat} />} />
        <Route path="*" element={<Navigate to={user ? "/chat" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
