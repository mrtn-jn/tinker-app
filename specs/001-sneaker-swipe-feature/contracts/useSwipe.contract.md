# Hook Contract: useSwipe

**Type**: Custom React Hook  
**Purpose**: Detect and handle swipe gestures with threshold-based validation

---

## Function Signature

```typescript
interface UseSwipeOptions {
  threshold?: number;        // 0.0-1.0, default 0.5 (50% viewport)
  onSwipeComplete: (direction: 'left' | 'right') => void;
  enabled?: boolean;         // Default true
}

interface UseSwipeReturn {
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
  translateX: number;        // Current drag offset for visual feedback
  isDragging: boolean;
}

function useSwipe(options: UseSwipeOptions): UseSwipeReturn;
```

---

## Behavioral Contract

### Input Requirements
- `threshold` MUST be between 0 and 1 (0% to 100% of viewport width)
- `onSwipeComplete` MUST be a stable function reference (use useCallback in parent)
- `enabled` when false, all handlers become no-ops

### Output Guarantees
- `translateX` updates smoothly during drag (no jank)
- `onSwipeComplete` called exactly once per valid swipe
- Direction determined by final position, not velocity
- `isDragging` true only during active pointer interaction

### Algorithm Contract

```typescript
// Pseudocode
1. handlePointerDown:
   - Record start X position
   - Set isDragging = true
   - Set translateX = 0

2. handlePointerMove:
   - If not dragging OR not enabled: return
   - Calculate deltaX = current.x - start.x
   - Update translateX = deltaX
   - Optional: Cap translateX at ±100% viewport to prevent excessive drag

3. handlePointerUp:
   - Calculate final deltaX
   - Calculate percentMoved = |deltaX| / viewport.width
   - If percentMoved >= threshold:
     - direction = deltaX > 0 ? 'right' : 'left'
     - Call onSwipeComplete(direction)
   - Else:
     - Spring back to center (translateX = 0)
   - Set isDragging = false
```

---

## Performance Contract

- Event handlers MUST be memoized (avoid re-creating on every render)
- PointerMove events throttled to max 60fps (16ms)
- No memory leaks (cleanup pointer capture if used)
- < 1ms execution time per event handler

**Implementation Pattern**:
```typescript
const handlePointerMove = useMemo(() => 
  throttle((e: PointerEvent) => {
    // Update logic
  }, 16), // 60fps
  [deps]
);
```

---

## State Management Contract

### Internal State
```typescript
const [startX, setStartX] = useState(0);
const [translateX, setTranslateX] = useState(0);
const [isDragging, setIsDragging] = useState(false);
```

### External Dependencies
- `window.innerWidth` for threshold calculation
- PointerEvents API (must be available in browser)

---

## Event Handling Contract

### PointerDown
- **When**: User clicks/touches element
- **Action**: Capture start position, enable dragging
- **Side Effects**: setStartX, setIsDragging(true)

### PointerMove
- **When**: User moves pointer while dragging
- **Action**: Update translateX for visual feedback
- **Throttled**: Yes (16ms)
- **Side Effects**: setTranslateX

### PointerUp
- **When**: User releases pointer
- **Action**: Evaluate threshold, trigger callback or reset
- **Side Effects**: setIsDragging(false), call onSwipeComplete, or reset translateX

### PointerCancel (Optional)
- **When**: System cancels interaction (e.g., phone call)
- **Action**: Reset to initial state
- **Side Effects**: setIsDragging(false), setTranslateX(0)

---

## Edge Cases Contract

### Case 1: Disabled Mid-Drag
- **Scenario**: enabled=false while isDragging=true
- **Behavior**: Cancel drag, reset translateX, set isDragging=false

### Case 2: Threshold=0
- **Scenario**: Any movement triggers swipe
- **Behavior**: onSwipeComplete called immediately on pointerUp
- **Warning**: May cause accidental swipes

### Case 3: Threshold=1
- **Scenario**: Must drag full viewport width
- **Behavior**: Difficult to trigger, card may go offscreen
- **Recommendation**: Cap translateX at 100% in pointerMove

### Case 4: Rapid Swipes
- **Scenario**: User swipes before previous animation completes
- **Behavior**: Parent should set enabled=false during animation
- **Hook**: Does not enforce cooldown (parent's responsibility)

### Case 5: Vertical Scroll Conflict
- **Scenario**: User scrolls vertically while card is swipeable
- **Behavior**: Use `touch-action: pan-y` CSS to allow vertical scroll
- **Implementation**: Hook does not prevent default

---

## Browser Compatibility Contract

**Supported**:
- ✅ Chrome/Edge (PointerEvents native)
- ✅ Safari iOS 13+ (PointerEvents polyfilled if needed)
- ✅ Firefox (PointerEvents native)

**Fallback**: If PointerEvents unavailable, use touch/mouse events

---

## Integration Points

### Used By
- `SneakerCard` component (primary consumer)

### Depends On
- React hooks (useState, useMemo, useCallback)
- Browser PointerEvents API
- `window.innerWidth` (for threshold calculation)

---

## Testing Contract (Manual Verification)

Per quickstart.md, verify:

1. **Threshold Test**:
   - [ ] Drag 49% → Card returns to center
   - [ ] Drag 51% → onSwipeComplete called

2. **Direction Test**:
   - [ ] Drag right 60% → direction='right'
   - [ ] Drag left 60% → direction='left'

3. **Visual Feedback Test**:
   - [ ] translateX updates smoothly during drag
   - [ ] No stuttering or jank

4. **Disabled Test**:
   - [ ] enabled=false → Drag has no effect

5. **Cross-Browser Test**:
   - [ ] Works in Chrome, Safari, Firefox

---

## Example Usage

```typescript
function SneakerCard({ sneaker, onLike, onDislike, isInteractive }) {
  const handleSwipeComplete = useCallback((direction: 'left' | 'right') => {
    if (direction === 'right') {
      onLike();
    } else {
      onDislike();
    }
  }, [onLike, onDislike]);

  const { 
    handlePointerDown, 
    handlePointerMove, 
    handlePointerUp, 
    translateX 
  } = useSwipe({
    threshold: 0.5,
    onSwipeComplete: handleSwipeComplete,
    enabled: isInteractive
  });

  return (
    <div
      style={{ transform: `translateX(${translateX}px)`, transition: 'transform 0.3s' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Card content */}
    </div>
  );
}
```

---

## Performance Optimization Notes

1. **Memoization**: All handlers should use useMemo/useCallback
2. **Throttling**: pointerMove throttled to 16ms (60fps)
3. **Passive Listeners**: Use { passive: true } for scroll performance
4. **Transform**: Use CSS transform (GPU-accelerated), not left/right

---

## Versioning

- **Version**: 1.0.0
- **Last Updated**: 2025-10-01
- **Breaking Changes**: N/A (initial contract)

---

## Constitutional Compliance

✅ **Simplicity**: Single-purpose hook, no external dependencies  
✅ **Reusability**: Generic swipe detection, not sneaker-specific  
✅ **No Testing Framework**: Manual verification via quickstart  
✅ **Performance**: 60fps guarantee through throttling
