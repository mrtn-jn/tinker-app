'use client';

import { useEffect, useRef } from 'react';
import { SneakerProfile } from '@/types/sneaker';

export interface UseImagePreloaderOptions {
  sneakers: SneakerProfile[];
  currentIndex: number;
  preloadCount?: number; // How many images ahead to preload (default: 2)
}

/**
 * Hook to preload upcoming sneaker images to reduce delay on slow servers
 */
export function useImagePreloader({ 
  sneakers, 
  currentIndex, 
  preloadCount = 2 
}: UseImagePreloaderOptions) {
  const preloadedImages = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Calculate which images to preload
    const imagesToPreload: string[] = [];
    
    for (let i = 1; i <= preloadCount; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < sneakers.length) {
        const nextSneaker = sneakers[nextIndex];
        const primaryImage = nextSneaker.images[0];
        if (primaryImage && !preloadedImages.current.has(primaryImage)) {
          imagesToPreload.push(primaryImage);
        }
      }
    }

    // Preload images
    imagesToPreload.forEach(imageSrc => {
      if (imageSrc && !imageSrc.startsWith('/placeholder')) {
        const img = new Image();
        img.onload = () => {
          preloadedImages.current.add(imageSrc);
        };
        img.onerror = () => {
          console.warn(`Failed to preload image: ${imageSrc}`);
        };
        img.src = imageSrc;
      }
    });
  }, [sneakers, currentIndex, preloadCount]);

  return {
    isPreloaded: (imageSrc: string) => preloadedImages.current.has(imageSrc),
  };
}