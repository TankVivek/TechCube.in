import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo-small.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [mobileMenuOpen]);

  return (
    <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-6xl mx-auto px-4 xl:px-0 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-4"
        >
          <div className="flex items-center gap-1">
            <img src={logo} alt="TechCube Logo" className="h-9 w-9" />
            <h2 className={`text-2xl font-bold ${scrolled ? 'text-gray-800' : 'text-white'}`}>
              TechCube
            </h2>
          </div>
        </motion.div>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
          {['Home', 'Services', 'Expertise', 'AI Solutions', 'Contact'].map((item, index) => (
            <motion.a
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className={`font-medium text-sm lg:text-base transition-colors duration-200 ${scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-100 hover:text-white'} relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all hover:after:w-full`}
            >
              {item}
            </motion.a>
          ))}
        </nav>

        <button
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-7 w-7 transition-colors ${scrolled ? 'text-gray-800' : 'text-white'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ease-out ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />

        <div className="relative z-50 bg-white/95 backdrop-blur-sm shadow-xl h-[100vh] flex flex-col">
          <div className="flex gap-2 items-center justify-between px-6 py-4 bg-white shadow-md mb-5">
            <div className="flex items-center gap-1">
              <img src={logo} alt="TechCube Logo" className="h-9 w-9" />
              <h2 className={`text-2xl font-bold ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                TechCube
              </h2>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="text-gray-700 hover:text-red-500 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="px-4 pb-4 space-y-3 overflow-y-auto">
            {['Home', 'Services', 'Expertise', 'AI Solutions', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-lg text-gray-700 font-medium hover:text-purple-600 border-b border-gray-100 pb-3 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const section = document.querySelector(e.currentTarget.getAttribute('href'));
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 300);
                }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;