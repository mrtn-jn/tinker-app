'use client';

import { useState } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import EmailCollectionScreen from '@/components/EmailCollectionScreen';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [splashComplete, setSplashComplete] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  const handleAnimationComplete = (firstTime: boolean) => {
    setSplashComplete(true);
    setIsFirstTimeUser(firstTime);
  };

  const handleEmailSuccess = () => {
    // User submitted email, mark as no longer first-time
    setIsFirstTimeUser(false);
  };

  return (
    <>
      {!splashComplete && <SplashScreen onAnimationComplete={handleAnimationComplete} />}
      {splashComplete && isFirstTimeUser && <EmailCollectionScreen onSuccess={handleEmailSuccess} />}
      {splashComplete && !isFirstTimeUser && children}
    </>
  );
}
