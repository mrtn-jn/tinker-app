'use client';

import { useRef } from 'react';
import { Header } from '@/components/Header';
import { SneakerCard, SneakerCardRef } from '@/components/SneakerCard';
import { ActionButtons } from '@/components/ActionButtons';
import { CompletionScreen } from '@/components/CompletionScreen';
import { useSneakerQueue } from '@/hooks/useSneakerQueue';
import { useAggressiveImagePreloader } from '@/hooks/useAggressiveImagePreloader';
import { getSneakers } from '@/lib/sneakers';
import { SwipeAction } from '@/types/sneaker';

export default function Home() {
  const sneakers = getSneakers();
  const { currentSneaker, isComplete, recordSwipe, currentIndex } = useSneakerQueue(sneakers);
  const cardRef = useRef<SneakerCardRef>(null);

  // Aggressively preload ALL images at app start
  const { isImageLoaded, allImagesLoaded } = useAggressiveImagePreloader({ sneakers });

  const handleSwipe = (direction: 'left' | 'right') => {
    const action: SwipeAction = direction === 'right' ? 'LIKE' : 'DISLIKE';
    recordSwipe(action);
  };

  const handleLikeClick = () => {
    cardRef.current?.triggerOverlay('right');
  };

  const handleDislikeClick = () => {
    cardRef.current?.triggerOverlay('left');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* <Header /> */}

      <main className="container mx-auto pb-8 md:pt-4">
        {isComplete ? (
          <CompletionScreen />
        ) : currentSneaker ? (
          <div className="space-y-6">
            <SneakerCard
              ref={cardRef}
              sneaker={currentSneaker}
              onSwipeComplete={handleSwipe}
              enabled={!isComplete}
            />
            <ActionButtons
              onLike={handleLikeClick}
              onDislike={handleDislikeClick}
              disabled={isComplete}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}
