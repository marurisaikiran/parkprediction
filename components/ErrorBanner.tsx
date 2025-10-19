import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationCircleIcon } from './Icons';

interface ErrorBannerProps {
    title: string;
    message: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ title, message }) => {
    return (
        <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start space-x-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            role="alert"
        >
            <ExclamationCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
                <h3 className="font-bold text-red-800">{title}</h3>
                <p className="text-red-700 text-sm">{message}</p>
            </div>
        </motion.div>
    );
};

export default ErrorBanner;