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

    export default Expertise;
