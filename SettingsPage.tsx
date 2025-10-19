
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BellIcon, ChevronRightIcon, ShieldCheckIcon, UserIcon } from './components/Icons';
import { ToggleSwitch } from './components/ToggleSwitch';
// FIX: Import the shared 'Page' type for consistent navigation handling.
import type { Page } from './types';

interface SettingsPageProps {
  // FIX: Use the shared 'Page' type for the onNavigate prop.
  onNavigate: (page: Page) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const settingsSections = [
    {
      title: 'Account',
      icon: <UserIcon className="w-6 h-6 text-brand-blue" />,
      items: ['Edit Profile', 'Change Password', 'Language'],
    },
    {
      title: 'Security',
      icon: <ShieldCheckIcon className="w-6 h-6 text-green-600" />,
      items: ['Two-Factor Authentication', 'Login History', 'Manage Devices'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-1 text-slate-600 hover:text-brand-blue font-semibold mb-6 transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 transform rotate-180" />
              Back to Profile
            </button>
            <h1 className="text-3xl font-bold text-brand-dark mb-8">Settings</h1>
          </motion.div>
          
          {/* Notifications Section */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-yellow-100 p-2 rounded-full"><BellIcon className="w-6 h-6 text-yellow-600" /></div>
              <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
            </div>
            <ul className="divide-y divide-slate-200">
              <li className="flex justify-between items-center py-4">
                <span className="font-medium text-slate-700">Email Notifications</span>
                <ToggleSwitch isOn={emailNotifications} onToggle={() => setEmailNotifications(!emailNotifications)} />
              </li>
              <li className="flex justify-between items-center py-4">
                <span className="font-medium text-slate-700">Push Notifications</span>
                <ToggleSwitch isOn={pushNotifications} onToggle={() => setPushNotifications(!pushNotifications)} />
              </li>
            </ul>
          </motion.div>

          {/* Other Sections */}
          {settingsSections.map((section, index) => (
            <motion.div
              key={section.title}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-2 rounded-full ${index === 0 ? 'bg-blue-100' : 'bg-green-100'}`}>{section.icon}</div>
                <h2 className="text-xl font-bold text-slate-800">{section.title}</h2>
              </div>
              <ul className="divide-y divide-slate-200">
                {section.items.map(item => (
                  <li key={item}>
                    <button className="w-full flex justify-between items-center py-4 text-left hover:bg-slate-50 transition rounded-lg">
                      <span className="font-medium text-slate-700">{item}</span>
                      <ChevronRightIcon className="w-5 h-5 text-slate-400" />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;