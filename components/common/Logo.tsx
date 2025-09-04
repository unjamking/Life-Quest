import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 80C20 46.86 46.86 20 80 20"
        stroke="url(#grad1)"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 55L50 77L80 47"
        stroke="url(#grad2)"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="grad1"
          x1="20"
          y1="20"
          x2="80"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
         <linearGradient
          id="grad2"
          x1="28"
          y1="47"
          x2="80"
          y2="77"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8B5CF6" stopOpacity="0.8" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;