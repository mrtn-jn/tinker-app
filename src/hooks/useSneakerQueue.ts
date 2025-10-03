'use client';

import { useState, useCallback } from 'react';
import { SneakerProfile, UserInteraction, SwipeAction } from '@/types/sneaker';

export interface UseSneakerQueueReturn {
  currentSneaker: SneakerProfile | null;
  currentIndex: number;
  isComplete: boolean;
  interactions: UserInteraction[];
  recordSwipe: (action: SwipeAction) => void;
}

/**
 * Custom hook to manage sneaker queue state and user interactions
 * Tracks current position, interaction history, and completion status
 */
export function useSneakerQueue(sneakers: SneakerProfile[]): UseSneakerQueueReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);

  const currentSneaker = currentIndex < sneakers.length ? sneakers[currentIndex] : null;
  const isComplete = currentIndex >= sneakers.length;

  const recordSwipe = useCallback((action: SwipeAction) => {
    if (isComplete) return; // No more sneakers

    // Record the interaction
    const interaction: UserInteraction = {
      sneakerId: currentIndex,
      action,
      timestamp: Date.now(),
    };

    setInteractions(prev => [...prev, interaction]);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, isComplete]);

  return {
    currentSneaker,
    currentIndex,
    isComplete,
    interactions,
    recordSwipe,
  };
}
