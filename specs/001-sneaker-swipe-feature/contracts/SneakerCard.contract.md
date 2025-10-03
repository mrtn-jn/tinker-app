# Component Contract: SneakerCard

**Type**: React Component Interface  
**Purpose**: Display a single sneaker profile with swipe interaction support

---

## Props Interface

```typescript
interface SneakerCardProps {
  sneaker: SneakerProfile;
  onSwipe: (direction: 'left' | 'right') => void;
  isInteractive: boolean;  // Disable during animation
}

interface SneakerProfile {
  name: string;
  description: string;
  purchase_type: string;
  availability_type: string;
  images: string[];
}
```

---

## Behavioral Contract

### Input Requirements
- `sneaker` MUST have all 5 fields populated (non-empty strings)
- `sneaker.images` MUST contain at least 1 valid image path
- `onSwipe` MUST be a function (called when swipe threshold met)
- `isInteractive` MUST be boolean (controls pointer event handlers)

### Output Guarantees
- Component renders within 16ms (60fps)
- Swipe callback triggered when drag exceeds 50% viewport width
- Image fallback to placeholder on load error
- Card returns to center if swipe < 50% threshold

### Visual Requirements
- Card displays sneaker image (prominent, top section)
- Name displayed as heading (readable font size)
- Three info boxes (purchase_type, availability_type, description)
- Info boxes have black border, red background (#E63946 or theme color)
- Card is draggable via touch or mouse
- Visual feedback during drag (card follows pointer)

### Accessibility
- Sneaker image has descriptive alt text (sneaker.name)
- Info boxes use semantic HTML (<dl>, <dt>, <dd> or similar)
- Touch targets ≥ 44px (mobile)

---

## Event Contract

### onSwipe Callback

**Signature**: `(direction: 'left' | 'right') => void`

**When Triggered**:
- User drags card ≥ 50% viewport width and releases
- Direction determined by final drag position relative to start

**Guarantees**:
- Called exactly once per valid swipe gesture
- NOT called if drag < 50% threshold
- NOT called if `isInteractive` is false
- Called synchronously at pointer release

**Example Usage**:
```typescript
<SneakerCard
  sneaker={currentSneaker}
  onSwipe={(dir) => {
    if (dir === 'right') recordLike();
    else recordDislike();
    showOverlay(dir);
    moveToNextSneaker();
  }}
  isInteractive={!isAnimating}
/>
```

---

## State Management Contract

### Internal State
- Current drag position (translateX)
- Image load status (loading | loaded | error)

### Parent-Controlled State
- Which sneaker to display (via `sneaker` prop)
- Whether interactions are enabled (via `isInteractive`)

**Contract**: Component is controlled by parent, no internal navigation logic

---

## Performance Contract

- Initial render: < 50ms
- Re-render on prop change: < 16ms (60fps)
- Drag event handling: Throttled to 60fps max
- Image size: Recommend < 500KB per image
- Total component memory: < 5MB

---

## Error Handling Contract

### Image Load Failure
```typescript
// Contract: MUST NOT crash component
<img
  src={sneaker.images[0]}
  alt={sneaker.name}
  onError={(e) => {
    e.currentTarget.src = '/placeholder-sneaker.png';
    // Parent NOT notified (graceful degradation)
  }}
/>
```

### Invalid Props
- Missing required fields → TypeScript compile error (runtime: render fallback)
- Empty images array → Show placeholder immediately
- null/undefined sneaker → Do not render (parent should check)

---

## Integration Points

### Depends On
- `SneakerProfile` type (from `src/types/sneaker.ts`)
- `useSwipe` hook (for gesture detection)
- Tailwind classes (for styling)
- Placeholder image (`/public/placeholder-sneaker.png`)

### Used By
- `page.tsx` (main swipe interface)
- `useSneakerQueue` hook (supplies sneaker data)

---

## Testing Contract (Manual Verification)

Verification checklist per quickstart.md:

1. **Render Test**:
   - [ ] All 5 sneaker fields visible
   - [ ] Image loads or shows placeholder
   - [ ] Info boxes have correct styling

2. **Swipe Right Test**:
   - [ ] Card follows drag gesture
   - [ ] onSwipe('right') called when drag > 50%
   - [ ] Card resets if drag < 50%

3. **Swipe Left Test**:
   - [ ] onSwipe('left') called correctly
   - [ ] Direction detection accurate

4. **Disabled State Test**:
   - [ ] When isInteractive=false, dragging has no effect
   - [ ] onSwipe NOT called

5. **Error State Test**:
   - [ ] Broken image path shows placeholder
   - [ ] Component doesn't crash

---

## Example Implementation Sketch

```typescript
export function SneakerCard({ sneaker, onSwipe, isInteractive }: SneakerCardProps) {
  const { handlePointerDown, handlePointerMove, handlePointerUp, translateX } = 
    useSwipe({ 
      threshold: 0.5, 
      onSwipeComplete: onSwipe,
      enabled: isInteractive 
    });

  return (
    <div
      className="relative w-full max-w-md rounded-lg shadow-2xl overflow-hidden"
      style={{ transform: `translateX(${translateX}px)` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Image Section */}
      <img
        src={sneaker.images[0]}
        alt={sneaker.name}
        className="w-full h-96 object-cover"
        onError={(e) => {
          e.currentTarget.src = '/placeholder-sneaker.png';
        }}
      />

      {/* Info Section */}
      <div className="p-6 bg-brand-red">
        <h2 className="text-2xl font-bold text-white mb-4">{sneaker.name}</h2>
        
        <div className="space-y-3">
          <InfoBox label="Purchase Type" value={sneaker.purchase_type} />
          <InfoBox label="Availability" value={sneaker.availability_type} />
          <InfoBox label="Description" value={sneaker.description} />
        </div>
      </div>
    </div>
  );
}
```

---

## Versioning

- **Version**: 1.0.0
- **Last Updated**: 2025-10-01
- **Breaking Changes**: N/A (initial contract)

---

## Constitutional Compliance

✅ **Static-First**: No API calls, all data from props  
✅ **Component Reusability**: Props-based, reusable  
✅ **Tailwind CSS**: Utility classes for styling  
✅ **No Testing Framework**: Manual verification only
