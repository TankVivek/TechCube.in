// const Footer = () => (
//     <footer className="bg-gray-900 text-gray-300 py-12 px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           <div>
//             <div className="flex items-center space-x-2 mb-6">
//               <h3 className="text-xl font-bold text-white">TechCube</h3>
//             </div>
//             <p className="text-gray-400 mb-4">
//               Building tomorrow's digital solutions today. We specialize in creating exceptional digital experiences with cutting-edge technology.
//             </p>
//             <p className="text-gray-400">
//               Mumbai, Maharashtra, India
//             </p>
//           </div>
          
//           <div>
//             <h4 className="text-lg font-medium text-white mb-4">Quick Links</h4>
//             <ul className="space-y-2">
//               {['Home', 'Services', 'Expertise', 'About', 'Contact'].map((item) => (
//                 <li key={item}>
//                   <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors duration-200">
//                     {item}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
          
//           <div>
//             <h4 className="text-lg font-medium text-white mb-4">Contact</h4>
//             <a href="mailto:info@techcube.in" className="text-gray-400 hover:text-white transition-colors duration-200 block mb-2">
//               info@techcube.in
//             </a>
            
//           </div>
//         </div>
//       </div>
//     </footer>
//   );

//   export default Footer;
import { Link } from 'react-router-dom';
import logo from '../../public/logo-white.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter section */}
      <div className="bg-blue-900 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
            <p className="text-blue-100 max-w-md leading-relaxed">
              Subscribe to our newsletter for the latest tech insights
            </p>
          </div>

          <form className="flex flex-col sm:flex-row w-full max-w-lg gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3.5 rounded-lg flex-grow focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer content */}
      <div className="py-8 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12">
            {/* Logo and company info */}
            <div className="flex flex-col space-y-4">
              <img src={logo} alt="TechCube Logo" className="h-16 w-auto" />
              <p className="text-gray-400 leading-relaxed">
                Building tomorrow's digital solutions today with cutting-edge technology and innovative approaches.
              </p>
              <address className="text-gray-400 not-italic leading-relaxed">
                <p>Mumbai, Maharashtra</p>
                <p>India</p>
              </address>
            </div>

            {/* Services column */}
            <div>
              <h4 className="text-xl font-medium text-white mb-6">Services</h4>
              <ul className="space-y-3">
                {[
                  ['Web Development', '#services'],
                  ['Mobile App Development', '#services'],
                  ['AI Solutions', '#ai-solutions'],
                  ['Backend Architecture', '#services'],
                  ['DevOps & CI/CD', '#services'],
                  ['E-commerce Solutions', '#services'],
                ].map(([label, url]) => (
                  <li key={label}>
                    <a
                      href={url}
                      className="text-gray-400 hover:text-white transition-colors duration-200 block"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company column */}
            <div>
              <h4 className="text-xl font-medium text-white mb-6">Company</h4>
              <ul className="space-y-3">
                {[
                  ['About Us', '#about'],
                  ['Our Expertise', '#expertise'],
                  ['Industries', '#industries'],
                  ['Blog', '/blog'],
                  ['Careers', '/careers'],
                  ['Contact', '#contact'],
                ].map(([label, url]) => (
                  <li key={label}>
                    {url.startsWith('/') ? (
                      <Link
                        to={url}
                        className="text-gray-400 hover:text-white transition-colors duration-200 block"
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={url}
                        className="text-gray-400 hover:text-white transition-colors duration-200 block"
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect column */}
            <div>
              <h4 className="text-xl font-medium text-white mb-6">Connect</h4>
              <a
                href="mailto:info@techcube.in"
                className="text-gray-400 hover:text-white transition-colors duration-200 block mb-4"
              >
                info@techcube.in
              </a>
              <div className="flex space-x-6 mt-6">
                {/* Social icons */}
                <a href="https://facebook.com" aria-label="Facebook" className="text-gray-400 hover:text-blue-500 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="https://twitter.com" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="https://instagram.com" aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-700 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.98 3.5C4.98 5 3.91 6.08 2.48 6.08c-1.43 0-2.48-1.08-2.48-2.58S1.05 1 2.48 1c1.42 0 2.5 1.08 2.5 2.5zM.03 24V7.5h4.9V24H.03zm7.32-16.5H.1v16.5h7.26v-9c0-4.97 6.62-5.36 6.62 0v9H24v-10c0-5.99-7.57-5.76-9.38-2.82h-.02V7.5z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <hr className="border-gray-700 mt-16" />

          {/* Bottom copyright */}
          <div className="mt-8 text-center text-gray-500 text-sm select-none">
            &copy; {currentYear} TechCube. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
