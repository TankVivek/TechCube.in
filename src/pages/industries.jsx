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

  export default Industries;
