import React from 'react';
import { motion } from 'framer-motion';

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    message: string;
}

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    // FIX: Added 'as const' to the transition 'ease' property to ensure TypeScript infers the literal type required by framer-motion.
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export const InfoCard: React.FC<InfoCardProps> = ({ icon, title, message }) => {
    return (
        <motion.div 
            className="bg-white rounded-xl shadow-lg p-8 text-center flex flex-col items-center"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="bg-blue-100 text-brand-blue rounded-full p-4 mb-4">
                {icon}
            </div>
            <h2 className="text-xl font-bold text-brand-dark mb-2">{title}</h2>
            <p className="text-slate-500 max-w-sm">{message}</p>
        </motion.div>
    );
};