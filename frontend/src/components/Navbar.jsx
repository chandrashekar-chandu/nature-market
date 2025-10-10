import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  console.log('Navbar user:', user);

  return (
    <nav className="bg-green-600 text-white p-4 shadow-lg relative">
      <div key={user ? user.id : 'guest'} className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">Natures Mart</div>
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
        <div className="flex items-center">
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
          <div className={`md:flex ${isOpen ? 'flex' : 'hidden'} flex-col md:flex-row absolute md:relative top-full left-0 md:top-auto md:left-auto bg-green-600 md:bg-transparent w-full md:w-auto p-4 md:p-0 space-y-2 md:space-y-0 md:space-x-6`}>
            <Link to="/" className="hover:text-green-200 transition duration-300">Home</Link>
            <Link to="/explore" className="hover:text-green-200 transition duration-300">Explore</Link>
            <div className="hover:text-green-200 transition duration-300">Call: 699201392</div>
            {user ? (
              <>
                <Link to="/profile" className="hover:text-green-200 transition duration-300">Profile</Link>
                {user.role === 'admin' && <Link to="/admin" className="hover:text-green-200 transition duration-300">Admin</Link>}
                <Link to="/cart" className="hover:text-green-200 transition duration-300">Cart</Link>
                <span className="text-green-200">Welcome, {user.name}</span>
                <button onClick={logout} className="hover:text-green-200 transition duration-300">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-200 transition duration-300">Login</Link>
                <Link to="/signup" className="hover:text-green-200 transition duration-300">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;