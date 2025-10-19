import React, { useState } from 'react';
import { CarIcon, GoogleIcon, UserCircleIcon, SpinnerIcon } from './Icons';

interface HeaderProps {
    isLoggedIn: boolean;
    onLogin: () => void;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogin, onLogout }) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    
    // Simulate a network request for login
    const handleLoginClick = () => {
        setIsLoggingIn(true);
        setTimeout(() => {
            onLogin();
            setIsLoggingIn(false);
        }, 1000);
    }

  return (
    <header className="bg-brand-dark/80 backdrop-blur-sm shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
            <div className="text-brand-accent w-8 h-8 mr-3">
            <CarIcon />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
            ParkPredict
            </h1>
        </div>
        <div>
            {isLoggedIn ? (
                <div className="flex items-center gap-3">
                    <span className="text-white hidden sm:inline">Welcome!</span>
                    <UserCircleIcon className="w-8 h-8 text-slate-300" />
                    <button onClick={onLogout} className="text-sm text-slate-300 hover:text-white transition">Sign Out</button>
                </div>
            ) : (
                <button 
                    onClick={handleLoginClick}
                    className="flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition duration-200 w-[190px]"
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? (
                        <>
                            <SpinnerIcon />
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <>
                            <GoogleIcon className="w-5 h-5" />
                            Sign in with Google
                        </>
                    )}
                </button>
            )}
        </div>
      </div>
    </header>
  );
};