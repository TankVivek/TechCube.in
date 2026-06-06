import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Testimonials = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      quote: "TechCube transformed our outdated platform into a modern, responsive application that has significantly improved our user engagement and conversion rates.",
      author: "Priya Sharma",
      title: "CTO, FinEdge Solutions",
      image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=0D8ABC&color=fff"
    },
    {
      quote: "The team at TechCube not only delivered our e-commerce platform ahead of schedule but also provided invaluable insights that helped optimize our entire sales funnel.",
      author: "Rahul Mehra",
      title: "Founder, Urban Basket",
      image: "https://ui-avatars.com/api/?name=Rahul+Mehra&background=0D8ABC&color=fff"
    },
    {
      quote: "Working with TechCube on our AI-powered analytics dashboard was a game-changer. Their technical expertise and attention to detail were exceptional.",
      author: "Ananya Patel",
      title: "Product Director, MetricsMind",
      image: "https://ui-avatars.com/api/?name=Ananya+Patel&background=0D8ABC&color=fff"
    }
  ];
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section id="testimonials" className="section-corporate bg-slate-50 dark:bg-slate-900/50" ref={ref}>
      <div className="container-corporate">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">Client Success Stories</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Trusted by innovative companies to deliver exceptional digital experiences.
          </p>
        </motion.div>
        
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-slate-950 rounded-lg p-10 md:p-16 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-8">
                  <svg className="w-10 h-10 text-blue-600 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V5C14.017 3.89543 14.9124 3 16.017 3H19.017C21.2261 3 23.017 4.79086 23.017 7V15C23.017 18.3137 20.3307 21 17.017 21H14.017ZM1.017 21L1.017 18C1.017 16.8954 1.91243 16 3.017 16H6.017C6.56928 16 7.017 15.5523 7.017 15V9C7.017 8.44772 6.56928 8 6.017 8H3.017C1.91243 8 1.017 7.10457 1.017 6V5C1.017 3.89543 1.91243 3 3.017 3H6.017C8.22614 3 10.017 4.79086 10.017 7V15C10.017 18.3137 7.33072 21 4.017 21H1.017Z" />
                  </svg>
                </div>
                
                <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed mb-10 italic">
                  "{testimonials[activeIndex].quote}"
                </p>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-slate-100 dark:border-slate-800">
                    <img 
                      src={testimonials[activeIndex].image} 
                      alt={testimonials[activeIndex].author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white tracking-tight">{testimonials[activeIndex].author}</h4>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1">{testimonials[activeIndex].title}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-center mt-12 space-x-6">
            <button 
              onClick={prevTestimonial}
              className="p-3 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <div className="flex space-x-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeIndex === index ? 'bg-blue-600 w-6' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="p-3 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;