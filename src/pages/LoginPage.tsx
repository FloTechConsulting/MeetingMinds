import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { SignInPage } from '../components/ui/sign-in';
import { ROUTES, LOADING_MESSAGES, APP_CONFIG } from '../constants';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      
      // Success - navigate to dashboard
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleCreateAccountSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const fullName = formData.get('fullName') as string;
    const firefliesApiKey = formData.get('firefliesApiKey') as string;
    
    // Validate required fields
    if (!email || !password || !firefliesApiKey) {
      setError('Email, password, and Fireflies API key are required');
      setIsLoading(false);
      return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      const { error } = await signUp(email, password, fullName, firefliesApiKey);
      
      if (error) {
        if (error.message.includes('webhook')) {
          setError('Account created but webhook registration failed. Please contact support.');
        } else {
          setError(error.message);
        }
        setIsLoading(false);
        return;
      }
      
      // Success - navigate to dashboard
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      
      // Google auth will redirect automatically
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const email = prompt('Enter your email address:');
    if (!email) return;
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        alert(`Error: ${error.message}`);
        return;
      }
      
      alert('Password reset email sent! Check your inbox.');
    } catch (err) {
      alert('An unexpected error occurred');
    }
  };

  const handleCreateAccount = () => {
    setIsCreateAccount(true);
  };

  const handleBackToSignIn = () => {
    setIsCreateAccount(false);
    setError(null);
  };


  // Show loading screen during login
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-6xl font-light text-gray-900 tracking-tighter">
              {APP_CONFIG.name}
            </h1>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            {APP_CONFIG.description}
          </p>
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 text-sm mt-4">
            {LOADING_MESSAGES.SIGNIN}
          </p>
        </div>
      </div>
    );
  }

  // Show login form
  return (
    <div className="bg-gray-50 text-gray-900">
      <SignInPage
        title={
          <span className="font-light text-gray-900 tracking-tighter">
            {isCreateAccount ? `Join ${APP_CONFIG.name}` : `Welcome to ${APP_CONFIG.name}`}
          </span>
        }
        description={
          isCreateAccount 
            ? "Create your account to start analyzing meetings with AI"
            : "Sign in to access your AI-powered meeting analysis platform"
        }
        heroImageSrc="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        onSignIn={isCreateAccount ? handleCreateAccountSubmit : handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
        isCreateAccount={isCreateAccount}
        onBackToSignIn={handleBackToSignIn}
        error={error}
      />
    </div>
  );
};

export default LoginPage;
