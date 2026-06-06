import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Industries = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const industries = [
      "Fintech & Banking",
      "E-commerce & Retail",
      "SaaS Platforms",
      "Healthcare & Medical",
      "Transportation & Logistics",
      "EdTech & HR Tech",
      "Social Media & Tools"
    ];
  
    return (
      <section id="industries" className="section-corporate bg-white dark:bg-slate-950" ref={ref}>
        <div className="container-corporate">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              Industries We Serve
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Delivering specialized technology solutions across diverse sectors to drive digital innovation.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 text-center transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm"
              >
                <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">{industry}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  export default Industries;