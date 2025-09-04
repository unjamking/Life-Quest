import React from 'react';
import { User as UserIcon } from 'lucide-react';

interface AvatarProps {
  src: string | undefined | null;
  alt: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, className }) => {
  if (src) {
    return <img src={src} alt={alt} className={className} />;
  }

  // For the placeholder, remove object-cover if it exists, as it doesn't apply to divs and icons.
  const divClassName = className?.replace('object-cover', '');

  return (
    <div className={`${divClassName} bg-light-1 dark:bg-dark-3 flex items-center justify-center text-dark-3 dark:text-light-3 overflow-hidden`}>
      <UserIcon className="w-3/4 h-3/4" />
    </div>
  );
};

export default Avatar;
