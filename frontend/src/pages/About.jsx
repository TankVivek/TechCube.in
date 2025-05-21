 const About = () => (
    <section id="about" className="py-20 px-4 bg-white-800 text-black">
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
  

  export default About;
