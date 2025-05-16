import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const BlogPreview = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const blogPosts = [
    {
      title: "How AI is Transforming Web Development in 2025",
      excerpt: "Explore the latest AI-powered tools and techniques that are revolutionizing the way we build websites and web applications.",
      image: "/blog/ai-web-dev.jpg",
      date: "April 18, 2025",
      slug: "ai-transforming-web-development-2025",
      category: "Artificial Intelligence"
    },
    {
      title: "React.js vs Next.js: Choosing the Right Framework",
      excerpt: "A comprehensive comparison of React.js and Next.js to help you decide which framework best suits your project requirements.",
      image: "/blog/react-vs-next.jpg",
      date: "April 10, 2025",
      slug: "react-vs-nextjs-comparison",
      category: "Web Development"
    },
    {
      title: "Database Architecture: Best Practices for Scalability",
      excerpt: "Learn how to design database architectures that can handle exponential growth without compromising on performance.",
      image: "/blog/database-architecture.jpg",
      date: "April 2, 2025",
      slug: "database-architecture-scalability-best-practices",
      category: "Backend Development"
    }
  ];

  return (
    <section id="blog" className="py-20 px-4 bg-gray-50" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">Latest Insights</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Expert perspectives on technology trends, development practices, and digital transformation strategies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover-lift h-full flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  <Link to={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
                <Link 
                  to={`/blog/${post.slug}`}
                  className="text-blue-600 font-medium inline-flex items-center group"
                >
                  Read more
                  <svg 
                    className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link to="/blog" className="inline-flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300">
            View All Articles
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreview;