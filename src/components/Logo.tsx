import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <img 
      src="/IMG_20250908_121748_888.webp" 
      alt="QuickBoost Logo" 
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};

export default Logo;