import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Add useEffect to handle message timeout
  useEffect(() => {
    let timeoutId;
    if (formStatus === 'success') {
      timeoutId = setTimeout(() => {
        setFormStatus(null);
      }, 2000); // 2 seconds
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [formStatus]);

  // Update handleSubmit to use loading state
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);
    setIsLoading(true); // Set loading state when starting submission
    
    try {
      const response = await axios.post('https://techcube.in/api/email/send', {
        name: formData.name,
        email: formData.email,
        message: formData.message
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setFormStatus('success');
        // Reset form
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus('error');
    } finally {
      setIsLoading(false); // Reset loading state when done
    }
  };

  return (
    <section id="contact" className="section-corporate bg-white dark:bg-slate-950" ref={ref}>
      <div className="container-corporate max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Let's Start a Conversation
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Ready to transform your business with cutting-edge technology? Get in touch with our team of experts today.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">Contact Information</h3>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Email Us</h4>
                  <a href="mailto:info@techcube.in" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">info@techcube.in</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Our Office</h4>
                  <p className="text-slate-600 dark:text-slate-400">Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 px-8 rounded-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
                <ArrowRightIcon className="w-4 h-4" />
              </button>
              
              {formStatus === 'success' && (
                <div className="text-sm font-bold text-green-600 dark:text-green-400 py-3 px-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-md">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;