'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseSwipeOptions {
  threshold?: number;  // 0.0-1.0, default 0.5 (50% viewport)
  onSwipeComplete: (direction: 'left' | 'right') => void;
  enabled?: boolean;  // Default true
}

export interface UseSwipeReturn {
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  translateX: number;
  isDragging: boolean;
}

/**
 * Custom hook for swipe gesture detection with threshold validation
 * Implements 50% screen width threshold per specification
 */
export function useSwipe({
  threshold = 0.5,
  onSwipeComplete,
  enabled = true,
}: UseSwipeOptions): UseSwipeReturn {
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef<Element | null>(null);

  // Reset when disabled
  useEffect(() => {
    if (!enabled && isDragging) {
      setIsDragging(false);
      setTranslateX(0);
    }
  }, [enabled, isDragging]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!enabled) return;
    
    const target = e.currentTarget as Element;
    elementRef.current = target;
    
    // Capture pointer for smooth tracking
    target.setPointerCapture(e.pointerId);
    
    setStartX(e.clientX);
    setIsDragging(true);
    setTranslateX(0);
  }, [enabled]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !enabled) return;
    
    // Prevent default to avoid scrolling while swiping
    e.preventDefault();
    
    const deltaX = e.clientX - startX;
    // Cap at ±100% viewport to prevent excessive drag
    const maxTranslate = window.innerWidth;
    const cappedDelta = Math.max(-maxTranslate, Math.min(maxTranslate, deltaX));
    
    setTranslateX(cappedDelta);
  }, [isDragging, startX, enabled]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !enabled) return;
    
    // Release pointer capture
    if (elementRef.current) {
      elementRef.current.releasePointerCapture(e.pointerId);
    }
    
    const viewportWidth = window.innerWidth;
    const percentMoved = Math.abs(translateX) / viewportWidth;
    
    if (percentMoved >= threshold) {
      // Valid swipe - trigger callback
      const direction = translateX > 0 ? 'right' : 'left';
      onSwipeComplete(direction);
    }
    
    // Reset state (parent will handle next card or spring back)
    setIsDragging(false);
    setTranslateX(0);
  }, [isDragging, translateX, threshold, onSwipeComplete, enabled]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    translateX,
    isDragging,
  };
}
