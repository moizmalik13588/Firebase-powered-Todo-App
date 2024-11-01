import { signOut } from 'firebase/auth';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase/firebaseconfig';

const Navbar = () => {
  const navigate = useNavigate();

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <nav className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-center items-center space-x-6">
        <Link 
          to="/" 
          className="text-lg hover:text-blue-400 transition duration-300"
        >
          Home
        </Link>
        <Link 
          to="/login" 
          className="text-lg hover:text-blue-400 transition duration-300"
        >
          Login
        </Link>
        <Link 
          to="/register" 
          className="text-lg hover:text-blue-400 transition duration-300"
        >
          Register
        </Link>
        <button 
          onClick={logoutUser} 
          className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
