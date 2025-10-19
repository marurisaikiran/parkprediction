
import React from 'react';

interface SpinnerProps {
    small?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ small = false }) => {
    const sizeClasses = small ? 'h-5 w-5 border-2' : 'h-12 w-12 border-4';
    const containerClasses = small ? '' : 'flex justify-center items-center p-8';

    if (small) {
        return (
            <div className={`animate-spin rounded-full ${sizeClasses} border-t-transparent border-white`}></div>
        );
    }

    return (
        <div className={containerClasses}>
            <div className={`animate-spin rounded-full ${sizeClasses} border-t-transparent border-brand-blue`}></div>
        </div>
    );
};
