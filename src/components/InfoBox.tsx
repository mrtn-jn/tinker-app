import { ReactNode } from 'react';

export interface InfoBoxProps {
  children: ReactNode;
  className?: string;
}

/**
 * Bordered info box with brand-red background
 * Used for sneaker name and description display
 */
export function InfoBox({ children, className = '' }: InfoBoxProps) {
  return (
    <div 
      className={`bg-brand-red ${className}`}
    >
      {children}
    </div>
  );
}
