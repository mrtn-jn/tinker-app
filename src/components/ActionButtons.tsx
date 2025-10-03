export interface ActionButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  disabled?: boolean;
}

/**
 * Circular action buttons for manual LIKE/DISLIKE
 * Disabled during swipe animation
 */
export function ActionButtons({ onLike, onDislike, disabled = false }: ActionButtonsProps) {
  return (
    <div className="flex justify-center gap-8 py-6">
      <button
        onClick={onDislike}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-overlay-red text-white text-xl font-bold 
                   shadow-lg hover:scale-110 active:scale-95 transition-transform
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   flex items-center justify-center"
        aria-label="Dislike"
      >
        ✕
      </button>
      <button
        onClick={onLike}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-overlay-green text-white text-3xl font-bold 
                   shadow-lg hover:scale-110 active:scale-95 transition-transform
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   flex items-center justify-center"
        aria-label="Like"
      >
        ♥
      </button>
    </div>
  );
}
