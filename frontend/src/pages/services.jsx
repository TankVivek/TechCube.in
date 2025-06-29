import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  CpuChipIcon,
  CommandLineIcon,
  ServerIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

const services = [
  {
    id: 'web-development',
    title: 'Web Development',
    subtitle: 'Modern Web Applications',
    description: 'Custom web applications built with cutting-edge technologies and industry best practices.',
    icon: CodeBracketIcon,
    color: 'blue',
    features: [
      'Responsive & Progressive Web Apps',
      'E-commerce Solutions',
      'Single Page Applications (SPA)',
      'Full-Stack Development'
    ],
    benefits: [
      'Scalable architecture',
      'SEO optimized',
      'Performance focused',
      'Security first approach'
    ],
    status: 'available'
  },
  {
    id: 'mobile-development',
    title: 'Mobile Development',
    subtitle: 'Native & Cross-Platform',
    description: 'Native and cross-platform mobile applications for iOS and Android platforms.',
    icon: DevicePhoneMobileIcon,
    color: 'green',
    features: [
      'iOS & Android Native Development',
      'React Native & Flutter Apps',
      'App Store Optimization',
      'Mobile UI/UX Design'
    ],
    benefits: [
      'Native performance',
      'Cross-platform compatibility',
      'App store compliance',
      'Offline functionality'
    ],
    status: 'available'
  },
  {
    id: 'cloud-solutions',
    title: 'Cloud Solutions',
    subtitle: 'Scalable Infrastructure',
    description: 'Scalable cloud infrastructure and serverless applications for modern businesses.',
    icon: CloudIcon,
    color: 'purple',
    features: [
      'AWS, Azure & Google Cloud',
      'Serverless Architecture',
      'Microservices Design',
      'DevOps & CI/CD'
    ],
    benefits: [
      'Auto-scaling',
      'Cost optimization',
      'High availability',
      'Global deployment'
    ],
    status: 'available'
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    subtitle: 'Intelligent Solutions',
    description: 'Intelligent solutions powered by cutting-edge AI and machine learning technologies.',
    icon: CpuChipIcon,
    color: 'orange',
    features: [
      'Machine Learning Models',
      'Natural Language Processing',
      'Computer Vision',
      'Predictive Analytics'
    ],
    benefits: [
      'Data-driven insights',
      'Automated processes',
      'Predictive capabilities',
      'Custom AI solutions'
    ],
    status: 'coming-soon'
  },
  {
    id: 'devops',
    title: 'DevOps & CI/CD',
    subtitle: 'Automated Workflows',
    description: 'Automated deployment pipelines and infrastructure as code for seamless delivery.',
    icon: CommandLineIcon,
    color: 'red',
    features: [
      'Continuous Integration/Deployment',
      'Infrastructure as Code',
      'Container Orchestration',
      'Monitoring & Logging'
    ],
    benefits: [
      'Faster deployments',
      'Reduced errors',
      'Better collaboration',
      'Automated testing'
    ],
    status: 'available'
  },
  {
    id: 'backend-development',
    title: 'Backend Development',
    subtitle: 'Robust APIs & Systems',
    description: 'Robust and scalable backend systems and APIs for enterprise applications.',
    icon: ServerIcon,
    color: 'indigo',
    features: [
      'RESTful & GraphQL APIs',
      'Database Design & Optimization',
      'Microservices Architecture',
      'System Integration'
    ],
    benefits: [
      'High performance',
      'Scalable architecture',
      'Secure APIs',
      'Easy maintenance'
    ],
    status: 'available'
  }
];

const colorClasses = {
  blue: {
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-700',
    hover: 'hover:border-blue-300 dark:hover:border-blue-600',
    gradient: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/20'
  },
  green: {
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
    icon: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-700',
    hover: 'hover:border-green-300 dark:hover:border-green-600',
    gradient: 'from-green-500 to-green-600',
    shadow: 'shadow-green-500/20'
  },
  purple: {
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-700',
    hover: 'hover:border-purple-300 dark:hover:border-purple-600',
    gradient: 'from-purple-500 to-purple-600',
    shadow: 'shadow-purple-500/20'
  },
  orange: {
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
    icon: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-700',
    hover: 'hover:border-orange-300 dark:hover:border-orange-600',
    gradient: 'from-orange-500 to-orange-600',
    shadow: 'shadow-orange-500/20'
  },
  red: {
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
    icon: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-700',
    hover: 'hover:border-red-300 dark:hover:border-red-600',
    gradient: 'from-red-500 to-red-600',
    shadow: 'shadow-red-500/20'
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
    icon: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-700',
    hover: 'hover:border-indigo-300 dark:hover:border-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600',
    shadow: 'shadow-indigo-500/20'
  }
};

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleServiceClick = (service) => {
    if (service.status === 'available') {
      setSelectedService(selectedService?.id === service.id ? null : service);
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="services" className="">
      <div className="container-corporate">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="gradient-text-corporate mb-6 text-4xl md:text-5xl font-bold">Our Services</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We offer a comprehensive range of software development services to help your business thrive in the digital age.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto sm:px-8 lg:px-8 max-w-8xl" ref={ref}>
          {services.map((service, index) => {
            const colors = colorClasses[service.color];
            const isDisabled = service.status === 'coming-soon';
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-400 group flex flex-col h-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-800 ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} overflow-hidden`}
                tabIndex={0}
                aria-label={service.title}
              >
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                {console.log(colors.bg ,'121121')
                }
                {/* Icon container with enhanced styling */}
                <div className="relative w-20 h-10 rounded-2xl text-gray-500 flex items-center justify-center mb-6 group hover:scale-110 border border-gray-500 hover:shadow-lg transition-all duration-500 transform">
                <service.icon className="w-8 h-8 group-hover:text-gray-500 transition-colors duration-300" />
                </div>


                {/* Content */}
                <div className="relative flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">
                    {service.subtitle}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Features list with enhanced styling */}
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-start text-gray-600 dark:text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3, delay: (index * 0.1) + (featureIndex * 0.05) }}
                      >
                        <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <CheckCircleIcon className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                {/* Bottom section */}
                <div className="relative flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  {service.status === 'available' ? (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToContact();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-primary text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Get Started
                      <ArrowRightIcon className="ml-2 w-5 h-5" />
                    </motion.button>
                  ) : (
                    <button
                      disabled
                      className="btn btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                    >
                      Coming Soon
                    </button>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    {service.status === 'available' ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Ready to deploy
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-3 h-3 mr-2" />
                        In development
                      </>
                    )}
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services; 