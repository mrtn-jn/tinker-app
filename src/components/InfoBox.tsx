import { ReactNode } from 'react';

export interface InfoBoxProps {
  children: ReactNode;
  className?: string;
  bgColor?: string;  // Optional background color class (defaults to bg-brand-red)
}

/**
 * Bordered info box with customizable background color
 * Used for sneaker name and description display
 */
export function InfoBox({ children, className = '', bgColor = 'bg-brand-red' }: InfoBoxProps) {
  return (
    <div 
      className={`${bgColor} ${className}`}
    >
      {children}
    </div>
  );
}
