export interface SwipeOverlayProps {
  type: 'like' | 'dislike' | null;
  opacity?: number;
}

/**
 * Overlay feedback for swipe actions
 * Shows green checkmark for LIKE, red X for DISLIKE
 * Animates with 500ms duration per specification
 */
export function SwipeOverlay({ type, opacity = 0 }: SwipeOverlayProps) {
  if (!type) return null;

  const isLike = type === 'like';
  const bgColor = isLike ? 'bg-overlay-green' : 'bg-overlay-red';
  const icon = isLike ? '♥' : '✕';
  const iconSize = isLike ? 'text-[10rem]' : 'text-[8rem]'; // Heart bigger, X smaller for visual balance

  return (
    <div 
      className={`absolute inset-0 ${bgColor} flex items-center justify-center z-10 pointer-events-none transition-opacity duration-500`}
      style={{ opacity }}
    >
      <div className={`text-white ${iconSize} font-bold opacity-80`}>
        {icon}
      </div>
    </div>
  );
}
