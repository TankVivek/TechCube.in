import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Expertise = () => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

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
            name: "DevOps & CI/CD",
            skills: ["GitHub Actions", "Jenkins", "Docker", "AWS CodeDeploy", "Linux Server Management", "CI/CD Pipelines", "Nginx"]
        }
    ];

    return (
        <section id="expertise" className="section-corporate bg-white dark:bg-slate-950" ref={ref}>
            <div className="container-corporate">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                        Our Technical Expertise
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        We leverage cutting-edge technologies to build robust, scalable solutions that stand the test of time.
                    </p>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400"
                        >
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight border-b border-slate-100 dark:border-slate-800 pb-4">{category.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                {category.skills.map((skill, skillIndex) => (
                                    <span 
                                        key={skillIndex} 
                                        className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded text-xs font-bold border border-slate-200 dark:border-slate-700"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Expertise;