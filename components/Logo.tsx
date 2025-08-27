import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
        d="M50 0L95.5 50L50 100L4.5 50L50 0Z"
        fill="currentColor"
        fillOpacity="0.1"
    />
    <path
        d="M50 12L63 37L50 50L37 37L50 12Z"
        fill="currentColor"
    />
    <path
        d="M50 88L37 63L50 50L63 63L50 88Z"
        fill="currentColor"
        fillOpacity="0.6"
    />
    <path
        d="M12 50L37 63L50 50L37 37L12 50Z"
        fill="currentColor"
        fillOpacity="0.6"
    />
    <path
        d="M88 50L63 37L50 50L63 63L88 50Z"
        fill="currentColor"
    />
  </svg>
);

export default Logo;