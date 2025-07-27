import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Gamepad2, Sun, Moon, Home } from 'lucide-react';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-orange-200 dark:border-orange-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-200"
          >
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-200">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                GameHub
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Play & Enjoy
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <Home className="h-4 w-4" />
              <span className="font-medium">Home</span>
            </Link>
            
            <button
              onClick={toggleTheme}
              className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-orange-100 dark:hover:bg-orange-900 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-orange-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;