# Data Model: Sneaker Swipe Feature

**Feature**: 001-sneaker-swipe-feature  
**Date**: 2025-10-01  
**Source**: Derived from spec.md requirements and sneakers-data.json structure

## Overview

This feature uses a **static, read-only data model** with no persistence layer. All data is loaded from a JSON file at build time. User interactions (LIKE/DISLIKE) are ephemeral and stored only in component state during the session.

---

## Entities

### 1. Sneaker Profile

**Purpose**: Represents a single sneaker product with marketing information

**Source**: `/public/info/sneakers-data.json`

**TypeScript Interface**:
```typescript
interface SneakerProfile {
  name: string;
  description: string;
  purchase_type: string;
  availability_type: string;
  images: string[];
}
```

**Field Specifications**:

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `name` | string | Yes | Non-empty, max 100 chars | "Nike SB Dunk Low x Yuto Matcha" |
| `description` | string | Yes | Non-empty, max 200 chars | "50% Matcha, 50% nipón." |
| `purchase_type` | string | Yes | Non-empty | "Raffle", "Venta Directa", "A definir" |
| `availability_type` | string | Yes | Non-empty | "Lanzamiento 10/10", "Disponible en Drifters" |
| `images` | string[] | Yes | Min 1 item, valid path | `["/info/sneakers-images/nike-sb-dunk-low-x-yuto-matcha.png"]` |

**Business Rules**:
- All fields are display-only (no editing)
- Images array currently contains 1 image per sneaker (future: support multiple)
- If image fails to load, system shows placeholder (per FR-014)

**Relationships**: None (standalone entity, no foreign keys)

**Lifecycle**: Static - loaded once at build time, no mutations

---

### 2. User Interaction (Session State)

**Purpose**: Tracks user's swipe decisions within a single session

**Source**: Component state (React useState)

**TypeScript Interface**:
```typescript
type SwipeAction = 'LIKE' | 'DISLIKE';

interface UserInteraction {
  sneakerId: number;        // Index in sneakers array
  action: SwipeAction;
  timestamp: number;        // Date.now()
}

interface SessionState {
  currentIndex: number;     // Which sneaker is showing (0-3)
  interactions: UserInteraction[];
  isComplete: boolean;      // True after 4th swipe
}
```

**Field Specifications**:

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `sneakerId` | number | Yes | 0-3 (array index) | References position in sneakers array |
| `action` | 'LIKE' \| 'DISLIKE' | Yes | Enum constraint | Determined by swipe direction or button |
| `timestamp` | number | Yes | Positive integer | For potential analytics (not displayed) |
| `currentIndex` | number | Yes | 0-3 | Increments after each swipe |
| `interactions` | UserInteraction[] | Yes | Length 0-4 | Accumulates during session |
| `isComplete` | boolean | Yes | - | Triggers completion screen |

**Business Rules**:
- Interactions are append-only (no undo)
- Session resets on page refresh (no localStorage per constitution)
- After 4 interactions, `isComplete` becomes true
- No user authentication, so interactions are anonymous

**Relationships**:
- `sneakerId` implicitly references `SneakerProfile` by array index

**Lifecycle**:
1. Initialize with `currentIndex: 0, interactions: [], isComplete: false`
2. User swipes → Add interaction, increment `currentIndex`
3. After 4th swipe → Set `isComplete: true`
4. Page refresh → Reset to initial state

---

## Data Flow

```
Build Time:
  sneakers-data.json → Next.js bundler → Static JS bundle

Runtime (Client):
  1. Page Load → Import sneakers from bundle → Initialize SessionState
  2. Render SneakerCard (sneakers[currentIndex])
  3. User Swipes → Trigger SwipeAction
  4. Update SessionState → Add interaction, increment index
  5. Show Overlay (500ms with action feedback)
  6. Repeat 2-5 until isComplete
  7. Render CompletionScreen with promo code + link
```

**No Backend Communication**: All data flows client-side only

---

## Validation Rules

### Data Integrity (Build Time)
- JSON file must exist at `/public/info/sneakers-data.json`
- Must contain exactly 4 sneaker objects (per FR-010)
- Each sneaker must have all required fields
- Image paths must be relative to `/public`

**Validation Implementation**:
```typescript
// lib/sneakers.ts
export function validateSneakerData(data: unknown): SneakerProfile[] {
  if (!Array.isArray(data) || data.length !== 4) {
    throw new Error('sneakers-data.json must contain exactly 4 sneakers');
  }
  
  data.forEach((sneaker, index) => {
    if (!sneaker.name || !sneaker.description || 
        !sneaker.purchase_type || !sneaker.availability_type ||
        !Array.isArray(sneaker.images) || sneaker.images.length === 0) {
      throw new Error(`Invalid sneaker data at index ${index}`);
    }
  });
  
  return data as SneakerProfile[];
}
```

### Runtime Validation
- Swipe threshold: Must exceed 50% screen width (per clarification)
- Current index: Must be 0-3 (bounds checking)
- Image loading: Handle errors with placeholder

---

## State Management Strategy

**Approach**: Component-local state with custom hooks

**Rationale**:
- No global state needed (single-page flow)
- Aligns with constitutional simplicity principle
- No Redux/Zustand required

**Custom Hooks**:

```typescript
// hooks/useSneakerQueue.ts
function useSneakerQueue(sneakers: SneakerProfile[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  
  const currentSneaker = sneakers[currentIndex];
  const isComplete = currentIndex >= sneakers.length;
  
  const recordSwipe = (action: SwipeAction) => {
    setInteractions(prev => [
      ...prev,
      { sneakerId: currentIndex, action, timestamp: Date.now() }
    ]);
    setCurrentIndex(prev => prev + 1);
  };
  
  return { currentSneaker, isComplete, recordSwipe };
}
```

---

## Performance Considerations

### Build Time
- JSON file (~2KB) bundled into JavaScript
- Total sneaker data footprint: <10KB
- Images referenced via paths (not bundled in JS)

### Runtime
- No API calls (zero network overhead after initial load)
- State updates are O(1) operations
- Re-renders limited to SneakerCard and overlay components

### Memory
- Max 4 sneakers in memory simultaneously
- Interactions array max 4 items (negligible footprint)

---

## Testing Strategy (Manual Verification)

Per constitution, no automated tests. Manual verification checklist:

- [ ] All 4 sneakers load correctly from JSON
- [ ] Each sneaker displays all 5 fields (name, description, purchase_type, availability_type, image)
- [ ] Swipe right records LIKE action
- [ ] Swipe left records DISLIKE action
- [ ] Button taps produce same results as swipes
- [ ] Completion screen appears after 4th swipe
- [ ] Page refresh resets to first sneaker
- [ ] Broken image shows placeholder

---

## Future Extensibility Notes

**If requirements change**, these modifications would be straightforward:

1. **More Sneakers**: Change validation from `length === 4` to `length > 0`
2. **Multiple Images**: Carousel component in SneakerCard using `images[]`
3. **Persistence**: Add localStorage wrapper (requires constitutional amendment)
4. **Analytics**: POST interactions to external service on completion (static endpoint)

**Current Constraints**: Constitution prohibits databases, so persistence would require either:
- localStorage (browser-only, no cross-device)
- External analytics service (e.g., Google Analytics event)
- Static form POST (e.g., Formspree, Netlify Forms)

None are currently in scope.

---

## Summary

| Aspect | Decision |
|--------|----------|
| **Data Source** | Static JSON file (4 sneakers) |
| **Persistence** | None (session state only) |
| **Validation** | Build-time JSON validation |
| **State Management** | React useState + custom hooks |
| **Relationships** | None (flat structure) |
| **Performance** | <10KB data, O(1) operations |

**Alignment with Constitution**: ✅ Static-first, no database, minimal complexity
