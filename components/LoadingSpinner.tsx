
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0544E3] rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
