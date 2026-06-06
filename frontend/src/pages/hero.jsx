import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="hero-section relative bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto text-center px-4 sm:px-6 pt-24 pb-20 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-slate-900 dark:text-white leading-[1.1] tracking-tight"
        >
          Transforming Ideas into{' '}
          <span className="text-blue-600 dark:text-blue-500">
            Powerful Solutions
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl md:text-2xl mb-10 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Your strategic technology partner for custom software development, AI solutions, and digital transformation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <a 
            href="#services" 
            className="inline-flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold py-4 px-8 rounded-md transition-all duration-200 hover:bg-slate-800 dark:hover:bg-slate-100 hover:shadow-sm"
          >
            Explore Our Services
          </a>
          <a 
            href="#contact" 
            className="inline-flex items-center justify-center bg-white dark:bg-transparent text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold py-4 px-8 rounded-md transition-all duration-200"
          >
            Start Your Project
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;