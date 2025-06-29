import { Link } from 'react-router-dom';
import logo from '../../public/logo-white.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 border-t border-gray-800 dark:border-gray-700">
      {/* Newsletter Section */}
      <div className="bg-blue-900 dark:bg-blue-950 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
            <p className="text-blue-100 max-w-md leading-relaxed">
              Subscribe to our newsletter for the latest tech insights.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row w-full max-w-lg gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3 rounded-lg flex-grow focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white dark:bg-gray-900 dark:placeholder-gray-400 bg-white placeholder-gray-500 border border-gray-200 dark:border-gray-700 transition"
              required
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12">
            {/* Logo and Company Info */}
            <div className="flex flex-col space-y-3 items-center sm:items-start">
              <div className="mb-2 transform hover:scale-105 transition-transform duration-300">
                <img src={logo} alt="TechCube Logo" className="h-16 w-auto rounded-xl p-2 shadow" />
              </div>
              {/* <p className="text-gray-400 leading-relaxed text-center sm:text-left text-xl">
                Building tomorrow's digital solutions today with cutting‐edge technology and innovative approaches.
              </p> */}
              {/* <address className="text-gray-400 not-italic leading-relaxed text-center sm:text-left text-md">
                <p>Mumbai, Maharashtra</p>
                <p>India</p>
              </address> */}
            </div>

            {/* Services Column */}
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-semibold text-white mb-5 border-b border-blue-500 pb-2 w-fit mx-auto sm:mx-0">Services</h4>
              <ul className="space-y-3">
                {[
                  ['Web Development', '#services'],
                  ['Mobile App Development', '#services'],
                  ['AI Solutions', '#ai-solutions'],
                  ['Backend Architecture', '#services'],
                  ['DevOps & CI/CD', '#services'],
                  ['E-commerce Solutions', '#services']
                ].map(([label, url]) => (
                  <li key={label}>
                    <a
                      href={url}
                      className="text-gray-400 hover:text-white transition-colors duration-200 block text-sm focus:outline-none focus:text-blue-400"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-semibold text-white mb-5 border-b border-blue-500 pb-2 w-fit mx-auto sm:mx-0">Company</h4>
              <ul className="space-y-3">
                {[
                  ['About Us', '#about'],
                  ['Our Expertise', '#expertise'],
                  ['Industries', '#industries'],
                  ['Blog', '/blog'],
                  ['Careers', '/careers'],
                  ['Contact', '#contact']
                ].map(([label, url]) => (
                  <li key={label}>
                    {url.startsWith('/') ? (
                      <Link
                        to={url}
                        className="text-gray-400 hover:text-white transition-colors duration-200 block text-sm focus:outline-none focus:text-blue-400"
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={url}
                        className="text-gray-400 hover:text-white transition-colors duration-200 block text-sm focus:outline-none focus:text-blue-400"
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect Column */}
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-semibold text-white mb-5 border-b border-blue-500 pb-2 w-fit mx-auto sm:mx-0">Connect</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 4 4 0 018 0z" />
                  </svg>
                  <p className="text-gray-400">Mumbai, Maharashtra, India</p>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href="mailto:info@techcube.in"
                    className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:text-blue-400"
                  >
                    info@techcube.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-800 dark:border-gray-700 my-10" />

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>&copy; {currentYear} TechCube. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <ul className="flex flex-wrap justify-center gap-4 md:gap-8">
                <li><a href="#" className="hover:text-white transition-colors focus:outline-none focus:text-blue-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors focus:outline-none focus:text-blue-400">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors focus:outline-none focus:text-blue-400">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;