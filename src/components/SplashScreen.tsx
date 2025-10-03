'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function SplashScreen() {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [logoError, setLogoError] = useState(false);

  // 2-second minimum timer
  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Set app ready immediately (static export, no additional load needed)
  useEffect(() => {
    setAppReady(true);
  }, []);

  // Trigger fade out when both conditions are met
  useEffect(() => {
    if (minTimeElapsed && appReady) {
      setIsVisible(false);
    }
  }, [minTimeElapsed, appReady]);

  return (
    <div
      className={`
        fixed inset-0 z-70 
        bg-[#ff0000]
        flex items-center justify-center
        transition-opacity duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      {!logoError && (
        <Image
          src="/info/tinker_splash.png"
          alt="Tinker Logo"
          width={192}
          height={192}
          className="animate-pulse-logo"
          onError={() => setLogoError(true)}
          priority
        />
      )}
    </div>
  );
}
