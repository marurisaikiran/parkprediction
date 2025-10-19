
import React from 'react';
import { motion } from 'framer-motion';
import { LogoIcon, UserIcon, GoogleIcon, SpinnerIcon } from './Icons';
// FIX: Import the shared 'Page' type to ensure type consistency with the parent component.
import type { Page } from '../types';

interface HeaderProps {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export const Header: React.FC<HeaderProps> = ({ isAuthenticated, isAuthLoading, onSignIn, onSignOut, onNavigate, currentPage }) => {
  return (
    <header className="bg-brand-dark/80 backdrop-blur-sm shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
            aria-label="Go to homepage"
          >
            <LogoIcon className="w-8 h-8 text-brand-accent" />
            <span className="text-xl font-bold tracking-tight">ParkPredict</span>
          </button>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                 <motion.button
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center gap-2 text-white p-2 rounded-full transition-colors ${currentPage === 'profile' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View profile"
                >
                  <UserIcon className="w-6 h-6" />
                  <span className="hidden sm:inline font-medium">Welcome!</span>
                </motion.button>
                <button
                  onClick={onSignOut}
                  className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <motion.button
                onClick={onSignIn}
                disabled={isAuthLoading}
                className="bg-white text-brand-dark font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isAuthLoading ? (
                    <>
                        <SpinnerIcon />
                        <span>Signing in...</span>
                    </>
                ) : (
                    <>
                        <GoogleIcon className="w-5 h-5" />
                        <span>Sign in with Google</span>
                    </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
