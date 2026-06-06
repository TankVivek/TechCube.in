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
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="services" className="section-corporate bg-white dark:bg-slate-950">
      <div className="container-corporate">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Comprehensive Digital Services
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            We provide end-to-end technology solutions designed to scale your business and drive digital excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={ref}>
          {services.map((service, index) => {
            const isDisabled = service.status === 'coming-soon';
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group p-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ${isDisabled ? 'opacity-50' : 'hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm'}`}
              >
                <div className="w-12 h-12 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                  <service.icon className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {service.features.slice(0, 3).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {!isDisabled ? (
                  <button
                    onClick={scrollToContact}
                    className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center group-hover:translate-x-1 transition-transform"
                  >
                    Learn More
                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Coming Soon
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services; 