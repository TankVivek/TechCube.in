import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
      {/* Newsletter Section */}
      <div className="border-b border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Stay Updated</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Subscribe to our newsletter for the latest tech insights and company updates.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row w-full max-w-lg gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-md flex-grow focus:ring-1 focus:ring-blue-500 outline-none text-slate-900 dark:text-white dark:bg-slate-900 bg-slate-50 border border-slate-200 dark:border-slate-800 transition-all"
              required
            />
            <button
              type="submit"
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-3 rounded-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
            {/* Logo and Company Info */}
            <div className="flex flex-col space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-900 dark:bg-white rounded flex items-center justify-center">
                  <span className="text-white dark:text-slate-900 font-bold">TC</span>
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">TechCube</span>
              </div>
              <p className="text-sm leading-relaxed">
                Building tomorrow's digital solutions today with cutting-edge technology and innovative approaches.
              </p>
            </div>

            {/* Services Column */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Services</h4>
              <ul className="space-y-4">
                {[
                  ['Web Development', '#services'],
                  ['Mobile App Development', '#services'],
                  ['AI Solutions', '#ai-solutions'],
                  ['Cloud Infrastructure', '#services'],
                  ['DevOps & CI/CD', '#services']
                ].map(([label, url]) => (
                  <li key={label}>
                    <a href={url} className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Company</h4>
              <ul className="space-y-4">
                {[
                  ['About Us', '#about'],
                  ['Our Expertise', '#expertise'],
                  ['Industries', '#industries'],
                  ['Careers', '/careers'],
                  ['Contact', '#contact']
                ].map(([label, url]) => (
                  <li key={label}>
                    <a href={url} className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect Column */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Connect</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm">
                  <span className="text-slate-400 dark:text-slate-600">Location:</span>
                  <span>Mumbai, India</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="text-slate-400 dark:text-slate-600">Email:</span>
                  <a href="mailto:info@techcube.in" className="hover:text-blue-600 transition-colors">info@techcube.in</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium">
            <p>&copy; {currentYear} TechCube. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;