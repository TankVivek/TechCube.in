import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 sm:w-64 h-32 sm:h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-40 sm:w-72 h-40 sm:h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-48 sm:w-80 h-48 sm:h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto text-center safe-area-inset-bottom px-4 sm:px-6 pt-16 sm:pt-20 pb-20 sm:pb-0 hero-content">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white leading-tight"
        >
          Transforming Ideas into{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300">
            Powerful Solutions
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-3xl mx-auto px-2"
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
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-blue-700/50 hover:scale-105"
          >
            Explore Our Services
          </a>
          <a 
            href="#contact" 
            className="w-full sm:w-auto bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105"
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
          {/* <p className="text-blue-200 mb-4">Trusted by innovative companies</p> */}
          {/* <div className="flex flex-wrap justify-center items-center gap-8 opacity-70"> */}
            {/* Replace with actual client logos */}
            {/* <div className="h-12 w-auto grayscale hover:grayscale-0 transition-all">
              <img src="/logos/client1.svg" alt="Client Logo" className="h-full" />
            </div>
            <div className="h-12 w-auto grayscale hover:grayscale-0 transition-all">
              <img src="/logos/client2.svg" alt="Client Logo" className="h-full" />
            </div>
            <div className="h-12 w-auto grayscale hover:grayscale-0 transition-all">
              <img src="/logos/client3.svg" alt="Client Logo" className="h-full" />
            </div>
            <div className="h-12 w-auto grayscale hover:grayscale-0 transition-all">
              <img src="/logos/client4.svg" alt="Client Logo" className="h-full" />
            </div>
          </div> */}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <a href="#services" className="flex flex-col items-center text-white/70 hover:text-white transition-colors">
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
            <motion.div
              animate={{ 
                y: [0, 12, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "loop", 
                duration: 1.5,
                ease: "easeInOut"
              }}
              className="w-2 h-2 bg-white rounded-full"
            ></motion.div>
          </div>
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;