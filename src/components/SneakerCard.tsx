'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import { SneakerProfile } from '@/types/sneaker';
import { useSwipe } from '@/hooks/useSwipe';
import { InfoBox } from './InfoBox';
import { SwipeOverlay } from './SwipeOverlay';

export interface SneakerCardProps {
  sneaker: SneakerProfile;
  onSwipeComplete: (direction: 'left' | 'right') => void;
  enabled?: boolean;
}

export interface SneakerCardRef {
  triggerOverlay: (direction: 'left' | 'right') => void;
}

/**
 * Main sneaker card component with swipe gesture support
 * Displays sneaker image, name, description, and swipe overlay feedback
 */
export const SneakerCard = forwardRef<SneakerCardRef, SneakerCardProps>(
  ({ sneaker, onSwipeComplete, enabled = true }, ref) => {
  const [overlayType, setOverlayType] = useState<'like' | 'dislike' | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Expose triggerOverlay method to parent
  useImperativeHandle(ref, () => ({
    triggerOverlay: (direction: 'left' | 'right') => {
      if (isAnimating) return;
      
      setIsAnimating(true);
      setOverlayType(direction === 'right' ? 'like' : 'dislike');
      setOverlayOpacity(1);

      // Wait 500ms for overlay animation then complete
      setTimeout(() => {
        onSwipeComplete(direction);
        setOverlayOpacity(0);
        setOverlayType(null);
        setIsAnimating(false);
      }, 500);
    },
  }));

  const { handlePointerDown, handlePointerMove, handlePointerUp, translateX, isDragging } = useSwipe({
    threshold: 0.3, // Reduced from 0.5 for easier swiping
    onSwipeComplete: (direction) => {
      // Trigger overlay animation
      setIsAnimating(true);
      setOverlayType(direction === 'right' ? 'like' : 'dislike');
      setOverlayOpacity(1);

      // Complete swipe after overlay animation
      setTimeout(() => {
        onSwipeComplete(direction);
        setOverlayOpacity(0);
        setOverlayType(null);
        setIsAnimating(false);
      }, 500);
    },
    enabled: enabled && !isAnimating,
  });

  // Calculate overlay opacity based on drag distance
  useEffect(() => {
    if (isDragging && !isAnimating) {
      const viewportWidth = window.innerWidth;
      const dragPercent = Math.abs(translateX) / viewportWidth;
      const opacity = Math.min(dragPercent * 2, 0.6); // Max 60% opacity during drag

      if (translateX > 0) {
        setOverlayType('like');
      } else if (translateX < 0) {
        setOverlayType('dislike');
      }
      setOverlayOpacity(opacity);
    } else if (!isAnimating) {
      setOverlayOpacity(0);
      setOverlayType(null);
    }
  }, [translateX, isDragging, isAnimating]);

  // Reset image error when sneaker changes
  useEffect(() => {
    setImageError(false);
  }, [sneaker]);

  const primaryImage = sneaker.images[0] || '/placeholder-sneaker.svg';
  const rotation = translateX / 20; // Subtle rotation effect

  return (
    <div className="relative w-full md:max-w-md md:mx-auto">
      <div
        className="relative bg-white rounded-none md:rounded-2xl shadow-2xl overflow-hidden select-none touch-none"
        style={{
          transform: `translate3d(${translateX}px, 0, 0) rotate(${rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          cursor: enabled && !isAnimating ? (isDragging ? 'grabbing' : 'grab') : 'default',
          willChange: isDragging ? 'transform' : 'auto',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          WebkitTransform: `translate3d(${translateX}px, 0, 0) rotate(${rotation}deg)`,
          WebkitFontSmoothing: 'antialiased',
          transformStyle: 'preserve-3d',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Swipe Overlay */}
        <SwipeOverlay type={overlayType} opacity={overlayOpacity} />

        {/* Sneaker Image */}
        <div className="relative w-full aspect-[3/2] bg-gray-100" style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        }}>
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/placeholder-sneaker.svg"
                alt="Imagen no disponible"
                fill
                className="object-contain p-8"
                draggable={false}
              />
            </div>
          ) : (
            <Image
              src={primaryImage}
              alt={sneaker.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              onLoad={() => {
                // Simple onLoad callback without complex state management
              }}
              sizes="(max-width: 768px) 100vw, 448px"
              priority
              draggable={false}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            />
          )}
        </div>

        {/* Sneaker Info */}
        <div className="relative">
          
          <InfoBox bgColor={sneaker['InfoBox-bg']}>
            {/* Title */}
            <div className="px-4">
              <div className="py-3">
                <p className='text-center font-bold text-base text-shadow-black' >Nike SB</p>
                <p className='text-center font-extrabold text-2xl uppercase text-black'>
                  {sneaker.name}
                </p>
              </div>
            </div>

            <div className="px-4 pb-8 space-y-4 uppercase">
              <div className='border border-black'>
                <div className='p-2'>
                  <p className='font-semibold normal-case text-xs'>Tipo de compra</p>
                  <p className="text-lg font-bold text-white mt-1">{sneaker.purchase_type}</p>
                </div>
                <div className='border-t border-black p-2'>
                  <p className='font-semibold normal-case text-xs'>Disponibilidad</p>
                  <p className="text-lg font-bold text-white mt-1">{sneaker.availability_type}</p>
                </div>
                <div className='border-t border-black p-2'>
                  <p className='font-semibold normal-case text-xs'>Sobre mi</p>
                  <p className="text-lg font-bold text-white mt-1">{sneaker.description}</p>
                </div>
              </div>
            </div>
          </InfoBox>
        </div>
      </div>
    </div>
  );
});
