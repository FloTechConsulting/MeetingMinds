import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, User, Bell, Shield, Eye, EyeOff } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SettingsPage: React.FC = () => {
  const { user, getFirefliesApiKey } = useAuth();
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [settings, setSettings] = useState({
    email: 'user@example.com',
    apiKey: '',
    notifications: true,
    autoAnalyze: false
  });

  // Set user email when user is available
  React.useEffect(() => {
    if (user?.email) {
      setSettings(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user?.email]);

  // Load API key separately with proper error handling
  React.useEffect(() => {
    const loadApiKey = async () => {
      if (!user?.uid) return;
      
      try {
        setApiKeyLoading(true);
        const apiKey = await getFirefliesApiKey();
        if (apiKey) {
          setSettings(prev => ({
            ...prev,
            apiKey: apiKey
          }));
        }
      } catch (error) {
        // Silently handle error - don't block navigation
        console.log('Could not load API key:', error);
      } finally {
        setApiKeyLoading(false);
      }
    };

    loadApiKey();
  }, [user?.uid, getFirefliesApiKey]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setSaveSuccess(false);
    
    try {
      // Update Fireflies API key in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        firefliesApiKey: settings.apiKey,
        email: settings.email,
        updatedAt: new Date()
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-medium text-gray-800 mb-2">Settings</h2>
            <p className="text-gray-600">Manage your account and preferences</p>
          </motion.div>

          <div className="space-y-6">
            {/* Account Section */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-900">Account</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed here. Use Firebase Authentication to update.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* API Configuration */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Key className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-900">API Configuration</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fireflies API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKeyLoading ? 'Loading...' : settings.apiKey}
                      onChange={(e) => handleSettingChange('apiKey', e.target.value)}
                      disabled={apiKeyLoading}
                      placeholder="Enter your Fireflies API key"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      disabled={apiKeyLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Get your API key from <a href="https://fireflies.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Fireflies.ai</a>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-900">Preferences</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive updates about analysis results</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Auto-analyze New Meetings</h3>
                    <p className="text-sm text-gray-600">Automatically run analysis on new meetings</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoAnalyze}
                      onChange={(e) => handleSettingChange('autoAnalyze', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Security */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-900">Security</h2>
              </div>

              <div className="space-y-4">
                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="font-semibold text-gray-900">Change Password</div>
                  <div className="text-sm text-gray-600">Update your account password</div>
                </button>

                <button className="w-full text-left px-4 py-3 border border-red-200 rounded-xl hover:bg-red-50 transition-colors text-red-700">
                  <div className="font-semibold">Delete Account</div>
                  <div className="text-sm text-red-600">Permanently delete your account and data</div>
                </button>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <button 
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <span>✓ Saved!</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;