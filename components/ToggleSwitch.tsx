import React from 'react';
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

const spring = {
  type: 'spring',
  stiffness: 700,
  damping: 30
};

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle }) => {
  return (
    <motion.div
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${isOn ? 'bg-brand-blue justify-end' : 'bg-slate-300 justify-start'}`}
      onClick={onToggle}
      animate
    >
      <motion.div
        className="w-6 h-6 bg-white rounded-full shadow-md"
        layout
        transition={spring}
      />
    </motion.div>
  );
};
