import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Corporate SVG icons for each solution
const icons = [
  // Conversational AI
  <svg key="chat" className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 3.866-3.582 7-8 7a8.96 8.96 0 01-4-.93L3 21l1.07-3.21A7.963 7.963 0 013 12c0-3.866 3.582-7 8-7s8 3.134 8 7z" /></svg>,
  // Computer Vision
  <svg key="eye" className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  // Predictive Analytics
  <svg key="chart" className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19V6M7 19v-4M15 19v-2M19 19v-8" /></svg>,
  // NLP
  <svg key="doc" className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8H6a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" /></svg>
];

const AISolutions = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const solutions = [
    {
      title: "Conversational AI",
      description: "Build intelligent chatbots and virtual assistants powered by state-of-the-art language models.",
      icon: icons[0],
      benefits: ["24/7 customer support", "Reduced operational costs", "Personalized user experience"]
    },
    {
      title: "Computer Vision",
      description: "Implement image recognition and processing solutions for automation and data extraction.",
      icon: icons[1],
      benefits: ["Automated quality control", "Visual data analysis", "Object detection & tracking"]
    },
    {
      title: "Predictive Analytics",
      description: "Leverage machine learning to forecast trends and make data-driven business decisions.",
      icon: icons[2],
      benefits: ["Demand forecasting", "Risk assessment", "Customer behavior prediction"]
    },
    {
      title: "Natural Language Processing",
      description: "Extract insights from text data and automate document processing workflows.",
      icon: icons[3],
      benefits: ["Sentiment analysis", "Document classification", "Automated summarization"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <section id="ai-solutions" className="py-20 px-4 from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors duration-300" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center mb-4">
            <span className="text-blue-600 dark:text-blue-400">AI</span> & Machine Learning Solutions
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Harness the power of artificial intelligence to transform your business operations and create new opportunities for growth
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 group"
              tabIndex={0}
              aria-label={solution.title}
            >
              <div className="p-6 md:p-8">
                <div className="mb-4 flex items-center justify-center">{solution.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{solution.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{solution.description}</p>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Key Benefits:</h4>
                  <ul className="space-y-1">
                    {solution.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a href="#contact" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition-all duration-300">
            <span>Discuss AI Solutions</span>
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </motion.div> */}
      </div>
    </section>
  );
};

export default AISolutions;