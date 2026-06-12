import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="hero-section relative bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/30 dark:bg-indigo-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-5xl mx-auto text-center px-4 sm:px-6 pt-32 pb-24 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 text-slate-900 dark:text-white leading-[1.1] tracking-tight"
        >
          Transforming Ideas into{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Powerful Solutions
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl md:text-2xl mb-12 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Your strategic technology partner for custom software development, AI solutions, and digital transformation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row justify-center gap-5"
        >
          <motion.a 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="#services" 
            className="inline-flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 px-8 rounded-lg transition-all duration-200 hover:shadow-xl hover:bg-slate-800 dark:hover:bg-slate-100"
          >
            Explore Our Services
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="#contact" 
            className="inline-flex items-center justify-center bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold py-4 px-8 rounded-lg transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
          >
            Start Your Project
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;