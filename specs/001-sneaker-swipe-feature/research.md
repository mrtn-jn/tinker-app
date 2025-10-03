# Research: Sneaker Swipe Feature

**Feature**: 001-sneaker-swipe-feature  
**Date**: 2025-10-01  
**Status**: Complete

## Research Areas

### 1. Next.js Static Export Configuration

**Decision**: Use `output: 'export'` in next.config.js with App Router

**Rationale**:
- Next.js 13+ App Router supports full static export
- Generates pure HTML/CSS/JS files deployable anywhere
- No server required (aligns with constitution)
- Image optimization handled via `next/image` with `unoptimized: true` for static export

**Alternatives Considered**:
- Pages Router: Older API, less ergonomic for layouts
- Create React App: Lacks built-in routing and file-based structure
- Vite + React: Requires more configuration for routing

**Implementation Notes**:
```js
// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true  // Required for static export
  }
}
```

---

### 2. Touch/Mouse Swipe Gesture Detection

**Decision**: Custom React hook using PointerEvents API

**Rationale**:
- PointerEvents API unifies mouse and touch interactions
- No external library needed (reduces bundle size)
- Full control over threshold (50% screen width requirement)
- Supports drag animation feedback during swipe

**Alternatives Considered**:
- react-swipeable: Extra dependency (~8KB), less control
- react-spring gestures: Overkill for simple swipe detection
- Touch-only events: Doesn't work for desktop mouse dragging

**Implementation Pattern**:
```typescript
// useSwipe.ts - Simplified pattern
function useSwipe(threshold: number = 0.5) {
  const [startX, setStartX] = useState(0);
  
  const handlePointerDown = (e) => setStartX(e.clientX);
  
  const handlePointerMove = (e) => {
    const delta = e.clientX - startX;
    const percentMoved = Math.abs(delta) / window.innerWidth;
    
    if (percentMoved >= threshold) {
      return delta > 0 ? 'right' : 'left'; // LIKE or DISLIKE
    }
  };
  
  return { handlePointerDown, handlePointerMove };
}
```

---

### 3. Animation & Transition Strategy

**Decision**: CSS transitions + React state for overlay feedback

**Rationale**:
- Tailwind's transition utilities provide 60fps performance
- CSS transforms (translateX) are GPU-accelerated
- React state triggers overlay visibility (500ms duration per spec)
- No animation library needed

**Alternatives Considered**:
- Framer Motion: 50KB+ overhead, constitutional simplicity violation
- React Spring: Complex API for simple fade in/out
- Pure CSS animations: Less control over timing coordination

**Implementation Pattern**:
```tsx
// Overlay component with Tailwind
<div className={`
  fixed inset-0 flex items-center justify-center
  bg-green-500/30 transition-opacity duration-500
  ${showOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'}
`}>
  <HeartIcon className="w-32 h-32 text-white opacity-80" />
</div>
```

---

### 4. Tailwind Custom Color Configuration

**Decision**: Extract logo red color to Tailwind theme

**Rationale**:
- Ensures consistent red across info boxes and overlays
- Single source of truth for brand colors
- Tailwind's color system provides opacity variants
- Can reference as `bg-brand-red`, `text-brand-red`, etc.

**Alternatives Considered**:
- Hardcoded hex values: Inconsistent, harder to maintain
- CSS variables: Works but less integrated with Tailwind utilities

**Implementation**:
```js
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-red': '#E63946', // Extract from logo
        'overlay-green': '#06D6A0',
        'overlay-red': '#EF476F'
      }
    }
  }
}
```

---

### 5. Static Data Loading Pattern

**Decision**: Import JSON directly in component via ES modules

**Rationale**:
- Next.js bundles JSON imports at build time
- Type-safe with TypeScript interfaces
- No runtime fetch needed (faster initial render)
- Aligns with static-first principle

**Alternatives Considered**:
- fetch() at runtime: Unnecessary network request for static data
- getStaticProps: App Router uses different pattern (direct imports)

**Implementation**:
```typescript
// lib/sneakers.ts
import sneakersData from '../../public/info/sneakers-data.json';

export interface Sneaker {
  name: string;
  description: string;
  purchase_type: string;
  availability_type: string;
  images: string[];
}

export function getSneakers(): Sneaker[] {
  return sneakersData as Sneaker[];
}
```

---

### 6. Image Error Handling Strategy

**Decision**: React onError handler with placeholder swap

**Rationale**:
- Native image error event handling (no library)
- Graceful degradation per clarification requirements
- Preserves swipe functionality even with broken images

**Implementation Pattern**:
```tsx
<img 
  src={sneaker.images[0]} 
  alt={sneaker.name}
  onError={(e) => {
    e.currentTarget.src = '/placeholder-sneaker.png';
    e.currentTarget.alt = 'Imagen no disponible';
  }}
/>
```

---

### 7. Responsive Design Approach

**Decision**: Mobile-first Tailwind breakpoints with portrait orientation focus

**Rationale**:
- Tinder-style UI is naturally mobile-first
- Tailwind's sm/md/lg breakpoints cover all devices
- Portrait mode primary (swipe gesture natural on phones)
- Desktop shows centered card with max-width constraint

**Breakpoint Strategy**:
- Base (0-640px): Full-width card, touch-optimized buttons
- sm (640px+): Centered card with max-w-md
- lg (1024px+): Larger card (max-w-lg) with hover states on buttons

---

## Technology Decisions Summary

| Decision Area | Choice | Key Benefit |
|---------------|--------|-------------|
| Framework | Next.js App Router (static export) | Constitutional compliance + routing |
| Styling | Tailwind CSS | Utility-first, no custom CSS files |
| Gestures | Custom PointerEvents hook | Zero dependencies, full control |
| Animations | CSS transitions + React state | GPU-accelerated, simple |
| Data Loading | ES module JSON import | Build-time bundling, type-safe |
| State Management | React useState (component-local) | No external library needed |
| Icons | Inline SVG or Heroicons | Lightweight, customizable |

---

## Risk Assessment

### Low Risk
- ✅ All technologies align with constitution
- ✅ No backend/database complexity
- ✅ Small fixed dataset (4 profiles)
- ✅ Single-page application (no routing complexity)

### Medium Risk
- ⚠️ Custom swipe detection: Needs cross-browser testing (Chrome, Safari, Firefox mobile)
- ⚠️ Animation performance: Must maintain 60fps on mid-range mobile devices

### Mitigation Strategies
- Use passive event listeners for scroll performance
- Throttle/debounce pointer move events if needed
- Test on actual devices (not just browser DevTools)
- Profile with React DevTools Performance tab

---

## Open Questions
None - All clarifications resolved in spec.md Session 2025-10-01
