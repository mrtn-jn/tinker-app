'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { checkEmailSubmitted } from '@/hooks/useEmailSubmission';

type AnimationPhase = 'splash' | 'animating' | 'complete';

interface SplashScreenProps {
  onAnimationComplete?: (isFirstTimeUser: boolean) => void;
}

export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('splash');
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Check if user has submitted email before
  useEffect(() => {
    const hasSubmitted = checkEmailSubmitted();
    setIsFirstTimeUser(!hasSubmitted);
  }, []);

  // Handle splash → animation → complete flow
  useEffect(() => {
    // 2-second splash timer
    const splashTimer = setTimeout(() => {
      if (isFirstTimeUser) {
        // First-time user: trigger blind-lift animation
        setAnimationPhase('animating');
        
        // After 1200ms animation, mark as complete
        const animationTimer = setTimeout(() => {
          setAnimationPhase('complete');
          onAnimationComplete?.(true);
        }, 1200);
        
        return () => clearTimeout(animationTimer);
      } else {
        // Returning user: skip animation, go directly to complete
        setAnimationPhase('complete');
        onAnimationComplete?.(false);
      }
    }, 2000);

    return () => clearTimeout(splashTimer);
  }, [isFirstTimeUser, onAnimationComplete]);

  // Don't render once complete
  if (animationPhase === 'complete') {
    return null;
  }

  return (
    <>
      {/* Main splash screen (fades out during animation phase for first-time users) */}
      <div
        className={`
          fixed inset-0 z-70 
          bg-brand-red
          flex items-center justify-center
          transition-opacity duration-500
          ${animationPhase === 'splash' ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        {!logoError && (
          <Image
            src="/info/tinker_splash.png"
            alt="Tinker Logo"
            width={160}
            height={160}
            className="animate-pulse-logo"
            onError={() => setLogoError(true)}
            priority
          />
        )}
      </div>

      {/* Blind-lift: Red background that slides up to reveal white below (only for first-time users) */}
      {isFirstTimeUser && animationPhase === 'animating' && (
        <div className="fixed inset-0 z-60 pointer-events-none overflow-hidden">
          {/* White background (revealed as red moves up) */}
          <div className="absolute inset-0 bg-white" />
          
          {/* Red "blind" that slides up */}
          <div className="absolute inset-0 bg-brand-red animate-blind-lift" />
          
          {/* Logo stays in center, then gets "dragged" by the blind */}
          {!logoError && (
            <div className="absolute left-1/2 top-1/2">
              <img
                src="/info/tinker_splash.png"
                alt="Tinker Logo"
                width={160}
                height={160}
                className="animate-logo-drag-shrink"
                onError={() => setLogoError(true)}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
