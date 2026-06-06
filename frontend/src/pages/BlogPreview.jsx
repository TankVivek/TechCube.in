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
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
      date: "April 18, 2025",
      slug: "ai-transforming-web-development-2025",
      category: "Artificial Intelligence"
    },
    {
      title: "React.js vs Next.js: Choosing the Right Framework",
      excerpt: "A comprehensive comparison of React.js and Next.js to help you decide which framework best suits your project requirements.",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
      date: "April 10, 2025",
      slug: "react-vs-nextjs-comparison",
      category: "Web Development"
    },
    {
      title: "Database Architecture: Best Practices for Scalability",
      excerpt: "Learn how to design database architectures that can handle exponential growth without compromising on performance.",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800",
      date: "April 2, 2025",
      slug: "database-architecture-scalability-best-practices",
      category: "Backend Development"
    }
  ];

  return (
    <section id="blog" className="section-corporate bg-white dark:bg-slate-950" ref={ref}>
      <div className="container-corporate">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Latest Insights
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Expert perspectives on technology trends, development practices, and digital transformation strategies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden group flex flex-col transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400"
            >
              <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    {post.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-snug">
                  <Link to={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-grow leading-relaxed">{post.excerpt}</p>
                <Link 
                  to={`/blog/${post.slug}`}
                  className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest inline-flex items-center group/link"
                >
                  Read Article
                  <svg 
                    className="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link to="/blog" className="inline-flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 px-10 rounded-md transition-all duration-200 hover:bg-slate-800 dark:hover:bg-slate-100">
            Explore All Insights
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreview;