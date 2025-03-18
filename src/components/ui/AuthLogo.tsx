import React from 'react';
import { motion } from 'framer-motion';
import '../styles/auth.css';

export const AuthLogo = () => {
  return (
    <div className="logo">
      <div className="relative">
        <span>O</span>
        <motion.div
          className="absolute -bottom-[6px] left-[2px]"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
        >
          <span className="text-cyan-400 text-[10px] font-mono">≈</span>
        </motion.div>
      </div>
      <span>YSTER CULT</span>
    </div>
  );
};
