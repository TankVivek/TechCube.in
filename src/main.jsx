import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';

// Enhanced custom CSS with improved mobile responsiveness
const styles = `
  html {
    scroll-behavior: smooth;
  }
  
  .service-card {
    transition: all 0.3s ease;
  }
  
  .service-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  
  .gradient-bg {
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
  }
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
  
  /* Mobile-specific styles */
  @media (max-width: 768px) {
    .hero-content {
      padding-top: 6rem;
    }
    
    .mobile-menu {
      transition: all 0.3s ease;
      max-height: 0;
      overflow: hidden;
    }
    
    .mobile-menu.open {
      max-height: 300px;
    }
    
    .service-card {
      margin-bottom: 1rem;
    }
  }
  
  /* Improved form styles */
  .input-focus {
    transition: all 0.3s ease;
  }
  
  .input-focus:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  /* Card hover effects */
  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }
`;

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Lock body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className={`text-2xl font-bold ${scrolled ? 'text-gray-800' : 'text-white'}`}>TechCube</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {['Home', 'Services', 'Expertise', 'About', 'Contact'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className={`font-medium transition-colors duration-200 ${
                scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-100 hover:text-white'
              }`}
            >
              {item}
            </a>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-6 w-6 transition-colors ${scrolled ? 'text-gray-800' : 'text-white'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation - Improved animation and styling */}
      <div className={`md:hidden bg-white shadow-lg absolute w-full left-0 transition-all duration-300 ${mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <nav className="px-4 py-2">
          {['Home', 'Services', 'Expertise', 'About', 'Contact'].map((item, index) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="block py-3 text-gray-700 hover:text-blue-600 font-medium border-b border-gray-100 last:border-b-0"
              onClick={() => setMobileMenuOpen(false)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

const Hero = () => (
  <section id="home" className="gradient-bg min-h-screen flex items-center justify-center text-white px-4 pt-16">
    <div className="max-w-4xl mx-auto text-center hero-content">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        Empowering Digital Transformation
      </h1>
      <p className="text-xl md:text-2xl mb-8 animate-fade-in opacity-90" style={{ animationDelay: "0.5s" }}>
        Your Partner in Scalable Software Solutions
      </p>
      <div className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
        <a href="#services" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition-all duration-300 inline-block mr-4 mb-4">
          Our Services
        </a>
        <a href="#contact" className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 font-medium py-3 px-8 rounded-lg transition-all duration-300 inline-block mb-4">
          Contact Us
        </a>
      </div>
    </div>
  </section>
);

const Services = () => {
  const services = [
    {
      title: "Web Development",
      description: "We build fast, scalable websites using React.js, Node.js, and Python. From custom web apps to API integrations.",
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform apps with React Native, Flutter, and native iOS/Android development.",
    },
    {
      title: "Backend Architecture",
      description: "Scalable microservices, secure auth flows, and database optimization for your next big idea.",
    },
    {
      title: "DevOps & CI/CD",
      description: "Streamlined deployment pipelines, container orchestration, and cloud infrastructure management.",
    },
    {
      title: "AI Integration",
      description: "Custom AI-powered apps and automation workflows using OpenAI, LangChain, and Python.",
    },
    {
      title: "E-commerce Solutions",
      description: "High-performance online stores using Shopify, WooCommerce, and custom development.",
    }
  ];

  return (
    <section id="services" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">Our Services</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Delivering cutting-edge technology solutions to transform your business</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="service-card bg-white p-6 md:p-8 rounded-xl shadow-md hover-lift overflow-hidden"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Expertise = () => {
  const categories = [
    {
      name: "Web Development",
      skills: ["Python", "Django", "FastAPI", "Node.js", "Express.js", "React.js", "Next.js", "HTML5/CSS3", "Tailwind CSS"]
    },
    {
      name: "Backend Architecture",
      skills: ["Microservices", "RESTful APIs", "JWT Auth", "PostgreSQL", "MongoDB", "MySQL", "Redis", "Docker", "AWS"]
    },
    {
      name: "Mobile Development",
      skills: ["React Native", "Flutter", "Android (Kotlin)", "iOS (Swift)", "Push Notifications", "Camera & File Access", "Payment Gateway Integration"]
    },
    {
      name: "DevOps & CI/CD",
      skills: ["GitHub Actions", "Jenkins", "Docker", "AWS CodeDeploy", "Linux Server Management", "CI/CD Pipelines", "Nginx"]
    }
  ];

  return (
    <section id="expertise" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">Our Technical Expertise</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">We leverage cutting-edge technologies to build robust, scalable solutions</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover-lift">
              <div className="bg-blue-600 text-white py-4 px-6">
                <h3 className="text-xl font-bold">{category.name}</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex} 
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mb-2"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => (
  <section id="about" className="py-20 px-4 bg-gray-800 text-white">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">About TechCube</h2>
      
      <div className="mb-10">
        <p className="text-lg mb-4">
          TechCube is a dynamic development agency delivering tailored digital solutions powered by Python, Node.js, and React.js. We specialize in building robust backend systems, responsive user interfaces, and automation tools that simplify complex business challenges.
        </p>
        <p className="text-lg mb-4">
          Our mission is to help startups, SMEs, and enterprises drive digital growth through clean code, scalable architecture, and end-to-end development expertise.
        </p>
      </div>
      
      <div>
      </div>
        <h3 className="text-xl font-bold mb-4">Why Choose TechCube?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "Quality-First Development",
            "Agile Project Execution",
            "Transparent Communication",
            "Business-Oriented Solutions",
            "Scalable & Maintainable Codebase",
            "Long-term Partnership Mentality"
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="text-green-400 mt-1 flex-shrink-0">✓</div>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>
  </section>
);

const Industries = () => {
  const industries = [
    "Fintech & Banking",
    "E-commerce & Retail",
    "SaaS Platforms",
    "Healthcare & Medical",
    "Transportation & Logistics",
    "EdTech & HR Tech",
    "Social Media & Content Tools"
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">Industries We Serve</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Delivering specialized solutions across diverse sectors</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((industry, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-6 text-center hover-lift"
            >
              <p className="font-medium text-gray-800">{industry}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="py-20 px-4">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">Contact Us</h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Ready to start your next project? Get in touch with our team</p>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Get In Touch</h3>
              <p className="text-gray-600 mb-6">
                Let's discuss how we can help with your next project. Fill out the form or reach out directly.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="text-blue-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <a href="mailto:info@techcube.in" className="text-gray-700 hover:text-blue-600 transition-colors">info@techcube.in</a>
                </div>
                
                <div className="flex items-center">
                  <div className="text-blue-600 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Mumbai, Maharashtra, India</span>
                </div>
              </div>
              
              {/* Social Media Icons - Mobile Visible */}
              <div className="mt-8 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 input-focus"
                    placeholder="Your Name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 input-focus"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 input-focus"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 w-full sm:w-auto"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-12 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <h3 className="text-xl font-bold text-white">TechCube</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Building tomorrow's digital solutions today. We specialize in creating exceptional digital experiences with cutting-edge technology.
          </p>
          <p className="text-gray-400">
            Mumbai, Maharashtra, India
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {['Home', 'Services', 'Expertise', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors duration-200">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Contact</h4>
          <a href="mailto:info@techcube.in" className="text-gray-400 hover:text-white transition-colors duration-200 block mb-2">
            info@techcube.in
          </a>
          
        </div>
      </div>
    </div>
  </footer>
);

const App = () => (
  <>
    <style>{styles}</style>
    <Header />
    <Hero />
    <Services />
    <Expertise />
    <About />
    <Industries />
    <Contact />
    <Footer />
  </>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
         