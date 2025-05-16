import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';

// Simple custom CSS to complement Tailwind
const styles = `
  html {
    scroll-behavior: smooth;
  }
  
  .service-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  
  .gradient-bg {
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
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
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-lg px-4 py-3 absolute w-full">
          {['Home', 'Services', 'Expertise', 'About', 'Contact'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

const Hero = () => (
  <section id="home" className="gradient-bg min-h-screen flex items-center justify-center text-white px-4 pt-16">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        Empowering Digital Transformation
      </h1>
      {/* <p className="text-xl md:text-2xl mb-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
        Your Partner in Scalable Software Solutions
      </p> */}
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
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="service-card bg-white p-6 rounded-lg shadow-md transition-all duration-300"
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
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Our Technical Expertise</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 text-white py-4 px-6">
                <h3 className="text-xl font-bold">{category.name}</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex} 
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
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
        <h3 className="text-xl font-bold mb-4">Why Choose TechCube?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Quality-First Development",
            "Agile Project Execution",
            "Transparent Communication",
            "Business-Oriented Solutions",
            "Scalable & Maintainable Codebase",
            "Long-term Partnership Mentality"
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="text-green-400 mt-1">✓</div>
              <p>{item}</p>
            </div>
          ))}
        </div>
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
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Industries We Serve</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((industry, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
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
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">Contact Us</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8 md:p-12">
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
                  <a href="mailto:info@techcube.in" className="text-gray-700 hover:text-blue-600">info@techcube.in</a>
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
            </div>
            
            <div className="md:w-1/2">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <h3 className="text-xl font-bold text-white">TechCube</h3>
          </div>
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
      
      <div className="border-t border-gray-800 mt-8 pt-8 text-center">
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} TechCube. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

const App = () => (
  <>
    <style dangerouslySetInnerHTML={{ __html: styles }} />
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <Services />
      <Expertise />
      <About />
      <Industries />
      <Contact />
      <Footer />
    </div>
  </>
);


ReactDOM.createRoot(document.getElementById('root')).render(<App />);