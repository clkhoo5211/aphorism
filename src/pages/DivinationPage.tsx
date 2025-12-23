import React, { useEffect } from 'react';
import { DivinationSection } from '../components/Divination/DivinationSection';
import { motion } from 'framer-motion';

export const DivinationPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12 text-center"
      >
        <DivinationSection />
      </motion.div>
    </div>
  );
};
