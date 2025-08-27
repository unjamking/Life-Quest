import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { EyeIcon, EyeOffIcon } from '../components/icons';

const LoginScreen: React.FC = () => {
  const { login, signUp } = useAppContext();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      if (username.trim() && password.trim()) {
        login(username.trim(), password.trim());
      }
    } else {
      if (username.trim() && email.trim() && password.trim()) {
        signUp(username.trim(), email.trim(), password.trim());
      }
    }
  };
  
  const toggleMode = () => {
      setIsLoginMode(!isLoginMode);
      setUsername('');
      setEmail('');
      setPassword('');
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#f7f8fa] p-4">
      <div className="text-center mb-10">
        <Logo className="h-20 w-20 mx-auto text-[#0544E3]" />
        <h2 className="text-lg font-poppins font-semibold text-gray-500 tracking-wider mt-4">
          LifeQuest
        </h2>
        <h1 className="text-3xl font-poppins font-bold text-[#0544E3] mt-1">
          {isLoginMode ? 'Welcome Back!' : 'Join the Quest!'}
        </h1>
        <p className="text-gray-600 mt-2 px-4">
          {isLoginMode ? 'Sign in to continue your adventure.' : 'Create an account to start your journey.'}
        </p>
      </div>

      <div key={isLoginMode ? 'login' : 'signup'} className="w-full max-w-xs animate-screen-fade-in">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2 font-poppins">
              {isLoginMode ? 'Username or Email' : 'Username'}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
              className="shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-[#1a1a1a] bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#0544E3] placeholder:text-gray-500"
              required
            />
          </div>

          {!isLoginMode && (
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2 font-poppins">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className="shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-[#1a1a1a] bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#0544E3] placeholder:text-gray-500"
                required
              />
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="password"className="block text-gray-700 text-sm font-medium mb-2 font-poppins">
              Password
            </label>
            <div className="relative">
              <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="shadow-sm appearance-none border rounded-lg w-full py-2.5 px-3 text-[#1a1a1a] bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#0544E3] placeholder:text-gray-500"
                  required
              />
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                  {showPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            fullWidth
            disabled={!username.trim() || !password.trim() || (!isLoginMode && !email.trim())}
          >
            {isLoginMode ? 'Log In' : 'Create Account'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <button onClick={toggleMode} className="text-sm text-gray-600 hover:text-[#0544E3]">
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <span className="font-bold text-[#0544E3]">
              {isLoginMode ? "Sign Up" : "Log In"}
            </span>
          </button>
        </div>
      </div>
      
      <p className="absolute bottom-4 text-center text-gray-500 text-xs">
        &copy;2024 LifeQuest. All rights reserved.
      </p>
    </div>
  );
};

export default LoginScreen;