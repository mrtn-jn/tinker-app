# Component Contract: SwipeOverlay

**Type**: React Component Interface  
**Purpose**: Display temporary visual feedback for LIKE/DISLIKE actions

---

## Props Interface

```typescript
interface SwipeOverlayProps {
  type: 'like' | 'dislike' | null;  // null = hidden
  duration?: number;                 // milliseconds, default 500
}
```

---

## Behavioral Contract

### Input Requirements
- `type` MUST be one of: 'like', 'dislike', or null
- `duration` MUST be positive number (if provided)
- Component MUST be rendered at top level (not inside scrollable container)

### Output Guarantees
- Overlay appears immediately when type changes from null to 'like'/'dislike'
- Overlay remains visible for exactly `duration` milliseconds
- Overlay auto-hides after duration (parent does NOT need to manually set type=null)
- Icon centered both horizontally and vertically
- Full-screen coverage (blocks all interactions during display)

### Visual Contract

#### LIKE State (type='like')
- Background: Transparent green (#06D6A0 or similar, 30% opacity)
- Icon: White heart (100-150px, 80% opacity)
- Icon centered in viewport
- z-index: 50 (above all other content)

#### DISLIKE State (type='dislike')
- Background: Transparent red (#EF476F or similar, 30% opacity)
- Icon: White X (100-150px, 80% opacity)
- Icon centered in viewport
- z-index: 50

#### Hidden State (type=null)
- Overlay not rendered (display: none) OR opacity: 0
- No pointer events captured

---

## Animation Contract

### Fade In
- Duration: 150ms (fast entrance)
- Easing: ease-out
- Property: opacity 0 → 1

### Hold
- Duration: `duration - 300ms` (subtract fade in/out time)
- Icon and background fully visible

### Fade Out
- Duration: 150ms (fast exit)
- Easing: ease-in
- Property: opacity 1 → 0

**Total Timeline**: 150ms fade in + (duration - 300ms) hold + 150ms fade out = `duration` total

---

## State Management Contract

### Internal State
```typescript
const [isVisible, setIsVisible] = useState(false);
const [currentType, setCurrentType] = useState<'like' | 'dislike' | null>(null);
```

### Effect Logic
```typescript
useEffect(() => {
  if (type !== null) {
    setIsVisible(true);
    setCurrentType(type);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade out animation to complete before resetting type
      setTimeout(() => setCurrentType(null), 150);
    }, duration);
    
    return () => clearTimeout(timer);
  }
}, [type, duration]);
```

**Contract**: Parent can trigger new overlay before previous completes (will interrupt)

---

## Interaction Contract

### Pointer Events
- Overlay MUST block all clicks/taps while visible
- `pointer-events: none` when hidden
- `pointer-events: all` when visible (prevents interaction bleed-through)

### Keyboard Events
- Overlay does not capture keyboard focus
- Keyboard shortcuts still work (if implemented elsewhere)

---

## Performance Contract

- Component re-render: < 16ms (60fps)
- Memory footprint: < 100KB
- No memory leaks (timers cleaned up on unmount)
- CSS animations preferred over JS (hardware-accelerated)

---

## Accessibility Contract

- Overlay has `role="status"` or `aria-live="polite"`
- Icon has descriptive alt text: "Like" or "Dislike"
- Overlay does not trap focus (disappears automatically)

---

## Integration Points

### Used By
- `page.tsx` (main swipe interface)

### Depends On
- Tailwind classes (for styling)
- Heart/X icons (SVG or icon library)

---

## Testing Contract (Manual Verification)

Per quickstart.md:

1. **LIKE Overlay Test**:
   - [ ] Green background with 30% opacity
   - [ ] White heart icon (100-150px, 80% opacity)
   - [ ] Centered in viewport
   - [ ] Visible for exactly 500ms
   - [ ] Smooth fade in/out

2. **DISLIKE Overlay Test**:
   - [ ] Red background with 30% opacity
   - [ ] White X icon (100-150px, 80% opacity)
   - [ ] Centered in viewport
   - [ ] Visible for exactly 500ms

3. **Rapid Trigger Test**:
   - [ ] Trigger LIKE, immediately trigger DISLIKE
   - [ ] Previous overlay interrupted cleanly
   - [ ] No visual glitches

4. **Interaction Blocking Test**:
   - [ ] While overlay visible, clicks ignored
   - [ ] After overlay hides, clicks work again

---

## Example Implementation Sketch

```typescript
export function SwipeOverlay({ type, duration = 500 }: SwipeOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (type) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [type, duration]);

  if (!type) return null;

  const isLike = type === 'like';
  const bgColor = isLike ? 'bg-green-500/30' : 'bg-red-500/30';
  const Icon = isLike ? HeartIcon : XIcon;

  return (
    <div
      className={`
        fixed inset-0 z-50 
        flex items-center justify-center
        ${bgColor}
        transition-opacity duration-150
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      role="status"
      aria-live="polite"
    >
      <Icon 
        className="w-32 h-32 text-white opacity-80" 
        aria-label={isLike ? 'Like' : 'Dislike'}
      />
    </div>
  );
}
```

---

## Edge Cases Contract

### Case 1: Multiple Rapid Triggers
- **Scenario**: Parent sets type='like', then type='dislike' before first completes
- **Behavior**: First overlay fades out immediately, second starts fresh
- **No Queueing**: Latest wins, previous cancelled

### Case 2: Unmount During Display
- **Scenario**: Component unmounted while overlay visible
- **Behavior**: Timer cleaned up automatically (useEffect cleanup)

### Case 3: Duration=0
- **Scenario**: Parent sets duration={0}
- **Behavior**: Overlay appears and disappears instantly (may not be visible)
- **Recommendation**: Minimum 200ms for visibility

### Case 4: Very Long Duration
- **Scenario**: duration={5000} (5 seconds)
- **Behavior**: Blocks all interactions for 5 seconds
- **Warning**: May frustrate users, use with caution

---

## CSS Requirements

### Required Tailwind Classes
- `fixed inset-0`: Full-screen positioning
- `z-50`: Above other content
- `flex items-center justify-center`: Icon centering
- `transition-opacity duration-150`: Smooth fade
- `bg-green-500/30`, `bg-red-500/30`: Semi-transparent backgrounds
- `text-white opacity-80`: Icon styling

### Custom Colors (if needed)
```js
// tailwind.config.ts
{
  colors: {
    'overlay-green': '#06D6A0',
    'overlay-red': '#EF476F'
  }
}
```

---

## Versioning

- **Version**: 1.0.0
- **Last Updated**: 2025-10-01
- **Breaking Changes**: N/A (initial contract)

---

## Constitutional Compliance

✅ **Simplicity**: Single-purpose overlay, no complex state  
✅ **Component Reusability**: Generic overlay, reusable for other feedback  
✅ **Tailwind CSS**: Utility classes only  
✅ **No Testing**: Manual verification via quickstart  
✅ **Performance**: CSS animations (GPU-accelerated)
