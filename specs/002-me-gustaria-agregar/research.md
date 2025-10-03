# Research: Splash Screen Implementation

**Date**: 2025-10-03  
**Feature**: Full-screen splash screen with logo animation

## Research Questions

### 1. How to implement 2-second minimum + load wait timing?

**Decision**: Use React hooks (useState, useEffect) with two timing mechanisms:
1. `setTimeout` for 2-second minimum delay
2. `onLoad` event or manual ready flag for app load detection
3. Combine both with Promise.all or dual boolean flags

**Rationale**:
- Pure client-side solution, no external libraries needed
- React's useEffect perfect for lifecycle management
- Boolean state flags (`minTimeElapsed`, `appReady`) enable clean conditional logic

**Alternatives Considered**:
- requestAnimationFrame: Overkill for simple timing, adds complexity
- Intersection Observer: Not applicable, wrong use case
- Third-party loading library: Violates constitution (simplicity first)

**Implementation Approach**:
```typescript
const [minTimeElapsed, setMinTimeElapsed] = useState(false);
const [appReady, setAppReady] = useState(false);
const [isVisible, setIsVisible] = useState(true);

useEffect(() => {
  // 2-second minimum timer
  const timer = setTimeout(() => setMinTimeElapsed(true), 2000);
  
  // Assume app is ready after hydration (or use custom ready event)
  setAppReady(true);
  
  return () => clearTimeout(timer);
}, []);

useEffect(() => {
  if (minTimeElapsed && appReady) {
    // Start fade out
    setIsVisible(false);
  }
}, [minTimeElapsed, appReady]);
```

---

### 2. How to implement smooth fade out transition?

**Decision**: CSS opacity transition with Tailwind utility classes + React state to trigger animation

**Rationale**:
- CSS transitions provide hardware-accelerated, 60fps animations
- Tailwind's transition utilities keep styling consistent with existing codebase
- `opacity-0` + `transition-opacity` pattern is idiomatic Tailwind
- No JavaScript animation libraries needed (constitution: simplicity first)

**Alternatives Considered**:
- Framer Motion: Powerful but adds 50KB+ bundle size, overkill for fade
- CSS keyframe animations: More complex than needed for simple opacity change
- React Spring: Another dependency, unnecessary for single property animation

**Implementation Approach**:
```tsx
<div className={`
  fixed inset-0 z-50 bg-[#ff0000]
  transition-opacity duration-500
  ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
`}>
```

**Timing Details**:
- Duration: 500ms (smooth but not sluggish)
- Easing: Default (ease) - sufficient for fade
- pointer-events-none when faded ensures no interaction blocking

---

### 3. How to implement pulsing logo animation?

**Decision**: CSS keyframe animation with `@keyframes` in globals.css + Tailwind `animate-` custom class

**Rationale**:
- CSS keyframes provide smooth, performant animations
- Tailwind 4.x supports custom animations in `@theme` section
- Scale transform (0.95 → 1.0 → 0.95) creates subtle pulse effect
- No JavaScript needed, runs independently

**Alternatives Considered**:
- JavaScript setInterval: Janky, not 60fps, adds complexity
- SVG animations: Only works for SVG, requires logo format change
- GIF/APNG: Not scalable, poor quality, larger file size

**Implementation Approach**:
```css
/* In globals.css */
@theme {
  --animate-pulse-logo: pulse-logo 1.5s ease-in-out infinite;
}

@keyframes pulse-logo {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.95); }
}
```

```tsx
<Image 
  src="/info/tinker_splash.png"
  alt="Tinker Logo"
  className="animate-pulse-logo"
/>
```

**Animation Parameters**:
- Duration: 1.5s (not too fast, not too slow)
- Timing: ease-in-out (smooth acceleration/deceleration)
- Iteration: infinite (loops until fade out)
- Scale range: 0.95-1.0 (subtle, not jarring)

---

### 4. Where to integrate splash screen in Next.js App Router?

**Decision**: Render SplashScreen in root layout (`src/app/layout.tsx`) to ensure it appears on all pages

**Rationale**:
- Root layout wraps all pages in App Router
- Guarantees splash appears before any page content
- Works for initial load AND client-side navigation
- Single integration point, no duplication

**Alternatives Considered**:
- Per-page integration: Tedious, error-prone, violates DRY
- _app.tsx: Doesn't exist in App Router, wrong pattern
- Middleware: Server-side only, won't work with static export

**Implementation Approach**:
```tsx
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
```

---

### 5. How to handle splash screen on every page load/refresh?

**Decision**: Use client component with no localStorage/sessionStorage persistence - natural behavior is to reset on every page load

**Rationale**:
- Client components reset state on page reload by default
- No persistence mechanism = appears every time (meets requirement)
- Simple implementation, no cache management needed
- Works identically for initial visit, refresh, back/forward navigation

**Alternatives Considered**:
- Track "seen" flag in sessionStorage: Opposite of requirement (would suppress splash)
- Service Worker persistence: Overkill, adds complexity
- Cookie-based tracking: Unnecessary, not needed for feature

**Implementation Note**: The splash will naturally appear on every page load because React state resets on mount. No additional logic required.

---

### 6. How to handle missing logo gracefully?

**Decision**: Use Next.js Image component with error boundary, fallback to empty div if load fails

**Rationale**:
- Next.js Image provides onError callback
- Can hide image, keep red background (FR-014)
- Doesn't break app (FR-015)
- Aligns with existing codebase pattern (Header also uses next/image)

**Alternatives Considered**:
- Try/catch with dynamic import: Not applicable for static assets
- Multiple fallback images: Adds complexity without value
- Show error message: Breaks immersive splash experience

**Implementation Approach**:
```tsx
const [logoError, setLogoError] = useState(false);

<div className="relative w-48 h-48">
  {!logoError && (
    <Image
      src="/info/tinker_splash.png"
      alt="Tinker Logo"
      onError={() => setLogoError(true)}
      fill
      className="object-contain animate-pulse-logo"
    />
  )}
</div>
```

---

## Technology Stack Decisions

**Selected Stack**:
- React 19.1.1: Built-in hooks (useState, useEffect) for timing and state management
- TypeScript 5.9.3: Type safety for component props and state
- Tailwind CSS 4.1.14: Utility classes for styling, custom animation in @theme
- Next.js 15.5.4: App Router layout for universal integration, Image component for optimized loading

**No Additional Dependencies**: Feature uses only existing stack, no new packages needed

**Static Export Compatibility**: All implementation is client-side, works perfectly with `output: 'export'` in next.config.js

---

## Performance Considerations

**Bundle Size Impact**: 
- New component: ~2KB gzipped (estimated)
- No new dependencies
- Logo image already exists (no new asset)
- Total impact: Negligible

**Animation Performance**:
- CSS transforms (scale) are GPU-accelerated
- Opacity transitions use compositor thread
- Target: Maintain 60fps throughout animation
- Memory: Single full-screen div, minimal overhead

**Static Export Impact**:
- No build-time changes needed
- Client-side only, fully compatible
- No effect on SSG/ISR logic

---

## Integration Points

**Files to Create**:
1. `src/components/SplashScreen.tsx` - Main component

**Files to Modify**:
1. `src/app/layout.tsx` - Import and render SplashScreen
2. `src/app/globals.css` - Add pulse-logo animation keyframes

**Assets to Verify**:
1. `info/tinker_splash.png` - Confirm exists and accessible from public path

**No Breaking Changes**: Feature is additive only, no modifications to existing component logic

---

## Risk Assessment

**Low Risk**:
- ✅ Uses only existing dependencies
- ✅ No state management complexity
- ✅ Isolated component, no tight coupling
- ✅ Graceful degradation if logo missing

**Medium Risk**:
- ⚠️ Animation performance on low-end devices (mitigated by CSS transforms)
- ⚠️ Z-index stacking conflicts (mitigated by fixed positioning + z-50)

**Mitigation Strategies**:
- Test on multiple devices after implementation
- Use Tailwind's highest z-index class (z-50)
- Add will-change: transform for animation optimization if needed

---

## Summary

All technical unknowns resolved. Implementation path is clear:
1. Create SplashScreen component with dual-timer logic
2. Add CSS animation for pulsing logo
3. Integrate into root layout for universal display
4. Use Tailwind utilities + custom animation
5. Handle errors gracefully with Image onError

**Ready for Phase 1: Design & Contracts**
