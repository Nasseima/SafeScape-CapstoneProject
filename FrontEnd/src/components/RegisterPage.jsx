import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        firstname,
        lastname,
        username,
        email,
        password
      });

      console.log("Registration Response:", response);

      if (response.request.status === 200) {
        localStorage.setItem('token', response.data.access_token);
        toast.success("Registration successful! Redirecting to login...", {
          autoClose: 900,
          onClose: () => navigate("/login")
        });
      } 
      
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      setError("Registration error. Please check your information and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light" 
        transition={Bounce} 
      />
      <div className="max-w-md w-full bg-white shadow-md rounded p-8">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-gray-700 mb-2">Firstname</label>
            <input
              type="text"
              id="firstname"
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter your firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lastname" className="block text-gray-700 mb-2">Lastname</label>
            <input
              type="text"
              id="lastname"
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter your lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Register</button>
          
          <p className="mt-4 text-center">
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          </p>
        </form>
        
        <Link to="/" className="text-blue-500 hover:underline block mt-4 text-center">Back to Home</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
