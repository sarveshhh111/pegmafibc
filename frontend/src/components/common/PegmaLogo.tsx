import React from 'react';

interface PegmaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'white-text';
}

export const PegmaLogo: React.FC<PegmaLogoProps> = ({ 
  className = "", 
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-24'
  };

  const heightClass = sizeMap[size] || 'h-10';

  return (
    <div className={`inline-flex items-center justify-center ${heightClass} ${className}`}>
      <img
        src="/pegma-logo.jpg"
        alt="PEGMA Bulk Packaging Solutions Logo"
        className="h-full w-auto object-contain transition-transform duration-200 hover:scale-105 rounded-xl shadow-xs"
      />
    </div>
  );
};
