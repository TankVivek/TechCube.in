import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">TechCube</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We are a team of passionate developers, designers, and strategists dedicated to creating exceptional digital experiences.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
              <p className="text-gray-600">
                To empower businesses with innovative technology solutions that drive growth and success in the digital age.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Our Vision</h2>
              <p className="text-gray-600">
                To be the leading force in digital transformation, setting new standards in software development and user experience.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Innovation",
                  description: "Pushing boundaries and exploring new technologies to deliver cutting-edge solutions."
                },
                {
                  title: "Excellence",
                  description: "Committed to delivering the highest quality in everything we do."
                },
                {
                  title: "Collaboration",
                  description: "Working together with our clients to achieve their goals and exceed expectations."
                }
              ].map((value, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Our Expertise</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Web Development",
                "Mobile Apps",
                "UI/UX Design",
                "Cloud Solutions",
                "AI & ML",
                "DevOps",
                "Blockchain",
                "Cybersecurity"
              ].map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
