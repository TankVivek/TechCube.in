import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CloudIcon,
  CodeBracketIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon,
  ServerIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import SEOHead from '../components/SEOHead';
import Header from './header';
import Contact from './contact';
import Footer from './footer';

const services = [
  {
    title: 'Custom Software Development',
    description: 'Business applications, internal tools, booking platforms, admin panels, and API-driven systems built around your workflow.',
    icon: CodeBracketIcon,
  },
  {
    title: 'Web & SaaS Platforms',
    description: 'Responsive web apps, SaaS dashboards, customer portals, subscription products, and scalable full-stack platforms.',
    icon: ServerIcon,
  },
  {
    title: 'Mobile App Development',
    description: 'Android, iOS, React Native, and Flutter applications with clean UX, secure APIs, and release-ready implementation.',
    icon: DevicePhoneMobileIcon,
  },
  {
    title: 'AI & Automation Solutions',
    description: 'AI chatbots, document automation, data extraction, workflow automation, analytics, and custom AI integrations.',
    icon: CpuChipIcon,
  },
  {
    title: 'Cloud & DevOps',
    description: 'Cloud deployment, CI/CD, server optimization, monitoring, Docker setup, and production infrastructure support.',
    icon: CloudIcon,
  },
  {
    title: 'Product Modernization',
    description: 'Legacy system upgrades, performance optimization, UI refreshes, security hardening, and codebase audits.',
    icon: SparklesIcon,
  },
];

const proofPoints = [
  'Mumbai-focused discovery for local business workflows, users, and conversion goals',
  'Full-stack delivery across React, Node.js, Python, Firebase, MongoDB, SQL, and cloud services',
  'Mobile-first interfaces because Search Console shows most TechCube traffic is mobile',
  'SEO-aware architecture with canonical URLs, sitemap support, fast pages, and clean metadata',
];

const industries = [
  'FinTech',
  'HealthTech',
  'Real estate',
  'Logistics',
  'Education',
  'Retail',
  'Travel',
  'Professional services',
];

const testimonials = [
  {
    quote: 'TechCube helped us move from manual operations to a faster digital workflow with a clean admin system and reliable backend.',
    name: 'Operations Lead',
    company: 'Mumbai services business',
  },
  {
    quote: 'The team understood our product goals quickly and shipped a polished web app that worked smoothly on mobile from day one.',
    name: 'Founder',
    company: 'Startup client',
  },
];

const SoftwareCompanyMumbai = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <SEOHead
        title="Software Company in Mumbai | Custom Software Development | TechCube"
        description="TechCube is a software company serving Mumbai businesses with custom software development, web apps, mobile apps, SaaS platforms, AI automation, cloud services, and product modernization."
        canonicalUrl="https://techcube.in/software-company-in-mumbai"
      />
      <Header />

      <main>
        <section className="relative overflow-hidden bg-white dark:bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_32%)]" />
          <div className="container-corporate relative z-10 pt-24 pb-20 lg:pt-28 lg:pb-24">
            <div className="max-w-4xl">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-5 text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400"
              >
                Software company in Mumbai
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight"
              >
                Custom software, AI, web, and mobile app development for Mumbai businesses.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-7 max-w-3xl text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-slate-400"
              >
                TechCube helps startups, SMEs, and growth teams turn business requirements into production-ready software with clear UX, scalable architecture, and practical automation.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-10 flex flex-col sm:flex-row gap-4"
              >
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-md bg-slate-900 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  Discuss Your Project
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="#mumbai-services"
                  className="inline-flex items-center justify-center rounded-md border border-slate-200 px-7 py-4 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-white dark:hover:bg-slate-900"
                >
                  View Services
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="mumbai-services" className="section-corporate bg-slate-50 dark:bg-slate-900/40">
          <div className="container-corporate">
            <div className="mb-12 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                Software development services for Mumbai teams
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                From MVPs to enterprise systems, TechCube covers the core product, engineering, and cloud work needed to launch and scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-corporate bg-white dark:bg-slate-950">
          <div className="container-corporate grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                Why choose TechCube as your Mumbai software partner?
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                You get a focused product team that can plan, design, build, deploy, and improve software without making your business manage every technical detail.
              </p>
              <ul className="mt-8 space-y-4">
                {proofPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60">
              <h3 className="text-xl font-bold text-slate-950 dark:text-white">Industries we support</h3>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {industries.map((industry) => (
                  <div
                    key={industry}
                    className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  >
                    {industry}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-corporate bg-slate-50 dark:bg-slate-900/40">
          <div className="container-corporate">
            <div className="mb-10 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                Client outcomes
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Practical software delivery, cleaner business operations, and digital products that are easier for customers and teams to use.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <figure
                  key={testimonial.name}
                  className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"
                >
                  <blockquote className="text-base leading-7 text-slate-700 dark:text-slate-300">
                    "{testimonial.quote}"
                  </blockquote>
                  <figcaption className="mt-5 text-sm font-bold text-slate-950 dark:text-white">
                    {testimonial.name}
                    <span className="block pt-1 text-xs font-semibold text-slate-500 dark:text-slate-500">
                      {testimonial.company}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default SoftwareCompanyMumbai;
