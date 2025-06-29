import React from 'react';
import { motion } from 'framer-motion';

const ExampleCorporate = () => {
  return (
    <div className="min-h-screen bg-corporate-gradient">
      <div className="container-corporate section-corporate">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="gradient-text-corporate mb-6">
            Modern Corporate Design
          </h1>
          <p className="text-corporate-secondary text-lg mb-8 max-w-2xl mx-auto">
            This is an example of the new corporate design system with improved typography, 
            spacing, and professional styling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary">
              Primary Button
            </button>
            <button className="btn btn-secondary">
              Secondary Button
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExampleCorporate; 