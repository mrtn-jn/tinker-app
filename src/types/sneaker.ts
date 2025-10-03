// TypeScript interfaces for Sneaker Heart feature

export interface SneakerProfile {
  name: string;
  description: string;
  purchase_type: string;
  availability_type: string;
  images: string[];
}

export type SwipeAction = 'LIKE' | 'DISLIKE';

export interface UserInteraction {
  sneakerId: number;  // Index in sneakers array (0-3)
  action: SwipeAction;
  timestamp: number;  // Date.now()
}

export interface SessionState {
  currentIndex: number;  // Which sneaker is showing (0-3)
  interactions: UserInteraction[];
  isComplete: boolean;  // True after 4th swipe
}
