// src/components/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/chat"); // Redirect to chat dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-green-100 to-green-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Create an Account
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Join us for an amazing chat experience.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 border border-red-300 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="auth-input"
            placeholder="Full Name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            placeholder="Password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-input"
            placeholder="Confirm Password"
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              className="mr-2"
            />
            <span className="text-gray-600">
              I agree to the <Link to="/terms" className="auth-link">Terms & Conditions</Link>
            </span>
          </div>

          <button type="submit" className="auth-button">Register</button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
