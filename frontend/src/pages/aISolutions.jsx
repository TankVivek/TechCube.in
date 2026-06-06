import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Corporate SVG icons for each solution (unified color)
const icons = [
  // Conversational AI
  <svg key="chat" className="w-8 h-8 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 3.866-3.582 7-8 7a8.96 8.96 0 01-4-.93L3 21l1.07-3.21A7.963 7.963 0 013 12c0-3.866 3.582-7 8-7s8 3.134 8 7z" /></svg>,
  // Computer Vision
  <svg key="eye" className="w-8 h-8 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  // Predictive Analytics
  <svg key="chart" className="w-8 h-8 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19V6M7 19v-4M15 19v-2M19 19v-8" /></svg>,
  // NLP
  <svg key="doc" className="w-8 h-8 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8H6a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" /></svg>
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
        staggerChildren: 0.1,
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
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section id="ai-solutions" className="section-corporate bg-white dark:bg-slate-950" ref={ref}>
      <div className="container-corporate">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            AI & Machine Learning Solutions
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Harness the power of artificial intelligence to transform your business operations and create new opportunities for growth.
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
              className="p-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400 group"
            >
              <div className="w-12 h-12 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                {solution.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{solution.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{solution.description}</p>

              <div className="space-y-3">
                {solution.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center text-xs font-medium text-slate-500">
                    <div className="w-1 h-1 rounded-full bg-blue-500 mr-2" />
                    {benefit}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AISolutions;