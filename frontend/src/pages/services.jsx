import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Services = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const services = [
    {
      title: "Web Development",
      description: "Custom-built web applications using React.js, Node.js, and Python that deliver exceptional user experiences and business outcomes.",
      icon: "",
      features: ["Responsive design", "API integration", "Progressive Web Apps"],
      cta: "Explore Web Solutions"
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications that engage users and extend your digital reach across iOS and Android devices.",
      icon: "",
      features: ["React Native", "Flutter", "Native iOS/Android"],
      cta: "Discover Mobile Solutions"
    },
    {
      title: "Backend Architecture",
      description: "Scalable, secure, and high-performance backend systems that power your applications and handle growing user demands.",
      icon: "",
      features: ["Microservices", "API development", "Database optimization"],
      cta: "Build Your Backend"
    },
    {
      title: "DevOps & CI/CD",
      description: "Streamlined development workflows and automated deployment pipelines that accelerate your time to market.",
      icon: "",
      features: ["Docker", "Cloud deployment", "CI/CD pipelines"],
      cta: "Optimize Your Workflow"
    },
    {
      title: "AI Integration",
      description: "Harness the power of artificial intelligence with custom solutions that automate processes and deliver actionable insights.",
      icon: "",
      features: ["Machine learning", "Data analysis", "Automation"],
      cta: "Explore AI Solutions"
    },
    {
      title: "E-commerce Solutions",
      description: "Comprehensive online store implementations with seamless payment processing, inventory management, and customer experiences.",
      icon: "",
      features: ["Payment gateways", "Inventory systems", "Customer portals"],
      cta: "Launch Your Store"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="services" className="py-12 sm:py-20 px-4 sm:px-6 bg-gray-50" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center px-4"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Our Services</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">
            We deliver cutting-edge technology solutions that transform businesses and create exceptional digital experiences
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="service-card bg-white p-5 sm:p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full"
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{service.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">{service.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">{service.description}</p>
              
              <div className="mt-auto">
                <div className="mt-3 sm:mt-4 mb-4 sm:mb-6">
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm sm:text-base text-gray-700">
                        <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <a 
                  href="#contact" 
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors group text-sm sm:text-base"
                >
                  {service.cta}
                  <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;