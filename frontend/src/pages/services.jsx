import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  CpuChipIcon,
  CommandLineIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';

const services = [
  {
    title: 'Web Development',
    description: 'Custom web applications built with modern technologies and best practices.',
    icon: CodeBracketIcon,
    features: [
      'Responsive Design',
      'Progressive Web Apps',
      'E-commerce Solutions',
      'CMS Development'
    ]
  },
  {
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile applications for iOS and Android.',
    icon: DevicePhoneMobileIcon,
    features: [
      'iOS Development',
      'Android Development',
      'Cross-platform Apps',
      'App Store Optimization'
    ]
  },
  {
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and serverless applications.',
    icon: CloudIcon,
    features: [
      'AWS Solutions',
      'Azure Services',
      'Google Cloud',
      'Serverless Architecture'
    ]
  },
  {
    title: 'AI & Machine Learning',
    description: 'Intelligent solutions powered by cutting-edge AI and ML technologies.',
    icon: CpuChipIcon,
    features: [
      'Machine Learning Models',
      'Natural Language Processing',
      'Computer Vision',
      'Predictive Analytics'
    ]
  },
  {
    title: 'DevOps & CI/CD',
    description: 'Automated deployment pipelines and infrastructure as code.',
    icon: CommandLineIcon,
    features: [
      'Continuous Integration',
      'Continuous Deployment',
      'Infrastructure as Code',
      'Container Orchestration'
    ]
  },
  {
    title: 'Backend Development',
    description: 'Robust and scalable backend systems and APIs.',
    icon: ServerIcon,
    features: [
      'API Development',
      'Database Design',
      'Microservices',
      'System Architecture'
    ]
  }
];

const Services = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container py-16 md:py-24">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-blue-600">Services</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer a comprehensive range of software development services to help your business thrive in the digital age.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <service.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                <a
                  href="/contact"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Learn More
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          >
            Get Started
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;