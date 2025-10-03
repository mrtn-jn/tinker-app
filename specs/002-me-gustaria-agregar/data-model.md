# Data Model: Splash Screen

**Date**: 2025-10-03  
**Feature**: Full-screen splash screen with logo animation

## Overview

This feature involves **no persistent data entities**. All state is ephemeral client-side React state that resets on page load (which is the desired behavior - splash appears every time).

## Component State

### SplashScreen Component State

**Purpose**: Manage splash screen visibility and animation timing

```typescript
interface SplashScreenState {
  minTimeElapsed: boolean;  // Has 2-second minimum timer completed?
  appReady: boolean;         // Is main app loaded and ready?
  isVisible: boolean;        // Should splash be visible (controls fade out)?
  logoError: boolean;        // Did logo image fail to load?
}
```

**State Transitions**:
```
Initial State:
  minTimeElapsed = false
  appReady = false
  isVisible = true
  logoError = false

After mount + 2000ms:
  minTimeElapsed = true

After app hydration:
  appReady = true

When (minTimeElapsed AND appReady):
  isVisible = false (triggers fade out)

On logo load error:
  logoError = true (hides image, keeps background)
```

**Validation Rules**:
- `minTimeElapsed` must wait full 2000ms before setting to true
- `appReady` can be set immediately after hydration (Next.js client-side ready)
- `isVisible` can only transition to false, never back to true (one-way animation)
- `logoError` persists for component lifetime if set

**State Lifecycle**:
1. Component mounts → Initialize all states
2. useEffect sets 2-second timer
3. useEffect sets appReady (immediate for static export)
4. When both conditions met → useEffect sets isVisible to false
5. CSS transition animates opacity 100% → 0%
6. Component remains mounted but hidden (pointer-events-none)

**Why No Persistence**: Feature requires splash on every load. Using localStorage/sessionStorage would suppress it on subsequent visits, violating FR-009.

---

## Props & Interfaces

### SplashScreen Component Props

**Type Definition**:
```typescript
interface SplashScreenProps {
  // No props needed - component is self-contained
}
```

**Rationale**: Component manages its own timing and state. No external configuration needed for MVP. Future enhancement could accept props for customization (duration, colors, image), but constitution favors simplicity.

---

## No Server-Side Data

This feature is **100% client-side**:
- ❌ No API calls
- ❌ No database queries
- ❌ No localStorage/sessionStorage (intentionally avoided)
- ❌ No cookies
- ❌ No external data fetching

**Constitution Compliance**: Aligns with Static-First Architecture principle - all logic runs in browser, compatible with static export.

---

## Asset Dependencies

### Logo Image

**Path**: `/info/tinker_splash.png`  
**Access**: Via Next.js Image component  
**Type**: Static asset (PNG)  
**State**: Read-only  
**Error Handling**: If fails to load, `logoError` state set to true, component hides image but keeps background

**No Data Flow**: Logo is a static resource, not data. Next.js Image component handles loading, no state management needed beyond error flag.

---

## Integration with Existing Data

**Existing App State**: Splash screen does NOT interact with:
- Sneaker queue state (useSneakerQueue)
- Swipe history
- Current sneaker index
- Like/dislike counts

**Isolation**: Component is fully isolated, no data dependencies on rest of app. Could be removed without affecting any other feature.

---

## Summary

**Data Entities**: 0 persistent entities  
**Component State**: 4 boolean flags (timing + visibility control)  
**External Data**: 1 static image asset  
**Persistence**: None (by design)  
**Complexity**: Minimal - simplest possible state model

This model aligns with constitution's Simplicity First principle - no databases, no complex state management, just ephemeral React hooks.

**Ready for contracts generation** (though splash screen has no API contracts - it's UI-only)
