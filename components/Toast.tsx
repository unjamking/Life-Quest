import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircleIcon, ExclamationCircleIcon } from './icons';

const Toast: React.FC = () => {
  const { toast } = useAppContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2700); // Slightly less than the context timeout to allow for fade-out
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  const toastStyles = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const Icon = {
    success: <CheckCircleIcon className="w-6 h-6 mr-3"/>,
    error: <ExclamationCircleIcon className="w-6 h-6 mr-3"/>,
    info: <ExclamationCircleIcon className="w-6 h-6 mr-3" />,
  }[toast.type];

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-md z-50 flex items-center transition-all duration-300 ${toastStyles[toast.type]} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
    >
      {Icon}
      <span className="font-medium">{toast.message}</span>
    </div>
  );
};

export default Toast;