import React from 'react';
import { useTheme } from '../Pages/Dashboard/DashboardPages/ThemeContext'; 
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition"
    >
      {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
};

export default ThemeToggle;