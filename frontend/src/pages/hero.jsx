import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="hero-section relative bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 sm:w-64 h-32 sm:h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob bg-blue-400 dark:bg-blue-700"></div>
        <div className="absolute top-40 right-10 w-40 sm:w-72 h-40 sm:h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 bg-purple-400 dark:bg-purple-700"></div>
        <div className="absolute bottom-20 left-1/3 w-48 sm:w-80 h-48 sm:h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000 bg-green-400 dark:bg-green-700"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto text-center safe-area-inset-bottom px-4 sm:px-6 pt-16 sm:pt-20 pb-20 sm:pb-0 hero-content relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white leading-tight"
        >
          Transforming Ideas into{' '}
          <span className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-teal-400 to-blue-400 dark:from-blue-300 dark:via-teal-400 dark:to-blue-500">
            Powerful Solutions
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2"
        >
          Your strategic technology partner for custom software development, AI solutions, and digital transformation
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-center gap-4 px-4"
        >
          <a 
            href="#services" 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-blue-700/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Explore Our Services
          </a>
          <a 
            href="#contact" 
            className="w-full sm:w-auto bg-transparent text-blue-600 dark:text-white border-2 border-blue-600 dark:border-white hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Start Your Project
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.645, 0.045, 0.355, 1] }}
          className="mt-12 sm:mt-16"
        >
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;