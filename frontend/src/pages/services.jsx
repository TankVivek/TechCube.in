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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white section-padding">
      <div className="container-responsive">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="gradient-text mb-6">Our Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer a comprehensive range of software development services to help your business thrive in the digital age.
          </p>
        </motion.div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12" ref={ref}>
      {services.map((service, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition-all duration-300 border border-gray-100 hover:border-blue-200 group flex flex-col h-full"
        >
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-all duration-300 transform group-hover:scale-110">
            <service.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{service.title}</h3>
          <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
          <ul className="space-y-3">
            {service.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-start text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a href="/contact" className="btn-primary">
            Get Started
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;