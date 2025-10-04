'use client';

import { useEffect, useRef, useState } from 'react';
import { SneakerProfile } from '@/types/sneaker';

export interface UseAggressiveImagePreloaderOptions {
  sneakers: SneakerProfile[];
}

/**
 * Hook to aggressively preload ALL sneaker images at app start
 * This eliminates delays by ensuring all images are cached before use
 */
export function useAggressiveImagePreloader({ sneakers }: UseAggressiveImagePreloaderOptions) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const preloadedRefs = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const imagesToPreload = sneakers
      .map(sneaker => sneaker.images[0])
      .filter(img => img && !img.includes('placeholder'));

    if (imagesToPreload.length === 0) {
      setAllImagesLoaded(true);
      return;
    }

    let loadedCount = 0;
    const newLoadedImages = new Set<string>();

    // Preload all images
    imagesToPreload.forEach((imageSrc, index) => {
      const img = new Image();
      
      img.onload = () => {
        loadedCount++;
        newLoadedImages.add(imageSrc);
        setLoadedImages(new Set(newLoadedImages));
        
        if (loadedCount === imagesToPreload.length) {
          setAllImagesLoaded(true);
        }
      };

      img.onerror = () => {
        console.warn(`Failed to preload image: ${imageSrc}`);
        loadedCount++;
        
        if (loadedCount === imagesToPreload.length) {
          setAllImagesLoaded(true);
        }
      };

      // Set high priority for preloading
      img.loading = 'eager';
      img.src = imageSrc;
      preloadedRefs.current[index] = img;
    });

    // Cleanup function
    return () => {
      preloadedRefs.current.forEach(img => {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      });
      preloadedRefs.current = [];
    };
  }, [sneakers]);

  return {
    isImageLoaded: (imageSrc: string) => loadedImages.has(imageSrc),
    allImagesLoaded,
    loadedImagesCount: loadedImages.size,
    totalImages: sneakers.length,
  };
}