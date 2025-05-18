import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AISolutions = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const solutions = [
    {
      title: "Conversational AI",
      description: "Build intelligent chatbots and virtual assistants powered by state-of-the-art language models.",
      icon: "",
      benefits: ["24/7 customer support", "Reduced operational costs", "Personalized user experience"]
    },
    {
      title: "Computer Vision",
      description: "Implement image recognition and processing solutions for automation and data extraction.",
      icon: "",
      benefits: ["Automated quality control", "Visual data analysis", "Object detection & tracking"]
    },
    {
      title: "Predictive Analytics",
      description: "Leverage machine learning to forecast trends and make data-driven business decisions.",
      icon: "",
      benefits: ["Demand forecasting", "Risk assessment", "Customer behavior prediction"]
    },
    {
      title: "Natural Language Processing",
      description: "Extract insights from text data and automate document processing workflows.",
      icon: "",
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
    <section id="ai-solutions" className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
            <span className="text-blue-600">AI</span> & Machine Learning Solutions
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
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
              className="bg-white rounded-xl shadow-md overflow-hidden hover-lift"
            >
              <div className="p-6 md:p-8">
                <div className="text-4xl mb-4">{solution.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{solution.title}</h3>
                <p className="text-gray-600 mb-4">{solution.description}</p>

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Benefits:</h4>
                  <ul className="space-y-1">
                    {solution.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mt-1 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
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
        </motion.div>
      </div>
    </section>
  );
};

export default AISolutions;