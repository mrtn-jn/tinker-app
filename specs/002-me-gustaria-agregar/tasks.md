# Tasks: Splash Screen

**Input**: Design documents from `/specs/002-me-gustaria-agregar/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

## Execution Flow (main)
```
1. Load plan.md from feature directory ✅
   → Tech stack: TypeScript 5.9.3, Next.js 15.5.4, React 19.1.1, Tailwind CSS 4.1.14
   → Structure: Single Next.js app with static export
2. Load optional design documents ✅
   → data-model.md: 4 component state flags (minTimeElapsed, appReady, isVisible, logoError)
   → research.md: React hooks + CSS animations approach
   → quickstart.md: 8 validation scenarios extracted
3. Generate tasks by category ✅
   → Setup: Verify logo asset
   → Core: CSS animations, SplashScreen component, layout integration
   → Validation: Manual testing per quickstart.md
4. Apply task rules ✅
   → CSS and component creation can be parallel [P]
   → Integration depends on both being complete
   → Validation tasks sequential (depend on implementation)
5. Number tasks sequentially (T001, T002...) ✅
6. Generated: 10 tasks total
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- All file paths are absolute from repository root

---

## Phase 3.1: Setup & Verification

### T001: Verify Logo Asset Exists ✅
**File**: `info/tinker_splash.png`

**Objective**: Confirm splash screen logo asset is present and accessible

**Steps**:
1. Check that `info/tinker_splash.png` exists in repository
2. Verify file is a valid PNG image
3. Check image dimensions (should be square or near-square for best centering)
4. Confirm file is accessible from Next.js public path

**Acceptance Criteria**:
- [x] File exists at `info/tinker_splash.png`
- [x] Image opens without errors (66KB PNG)
- [x] File size reasonable (<500KB for web performance)

**Estimated Time**: 2 minutes

---

## Phase 3.2: Core Implementation

### T002 [P]: Add Pulsing Animation to CSS ✅
**File**: `src/app/globals.css`

**Objective**: Create CSS keyframe animation for logo pulsing effect (FR-016, FR-017, FR-018)

**Steps**:
1. Open `src/app/globals.css`
2. Add custom animation definition to `@theme` section:
   ```css
   @theme {
     --animate-pulse-logo: pulse-logo 1.5s ease-in-out infinite;
   }
   ```
3. Add `@keyframes` definition after `@theme` block:
   ```css
   @keyframes pulse-logo {
     0%, 100% { 
       transform: scale(1);
       opacity: 1;
     }
     50% { 
       transform: scale(0.95);
       opacity: 0.9;
     }
   }
   ```

**Acceptance Criteria**:
- [x] Animation defined in Tailwind 4.x compatible format
- [x] Scale range is subtle (0.95-1.0) to avoid jarring effect
- [x] Duration is 1.5s for smooth, gentle pulse
- [x] Animation set to infinite loop
- [x] File compiles without errors

**Estimated Time**: 5 minutes

**Dependencies**: None (can run in parallel with T003)

---

### T003 [P]: Create SplashScreen Component ✅
**File**: `src/components/SplashScreen.tsx`

**Objective**: Build full-screen splash screen component with dual-timer logic and fade transition (FR-001 through FR-018)

**Steps**:
1. Create new file `src/components/SplashScreen.tsx`
2. Import dependencies:
   ```tsx
   'use client';
   import { useState, useEffect } from 'react';
   import Image from 'next/image';
   ```
3. Define component with state:
   ```tsx
   export function SplashScreen() {
     const [minTimeElapsed, setMinTimeElapsed] = useState(false);
     const [appReady, setAppReady] = useState(false);
     const [isVisible, setIsVisible] = useState(true);
     const [logoError, setLogoError] = useState(false);
     
     // Timer logic here
   }
   ```
4. Implement 2-second minimum timer in useEffect:
   ```tsx
   useEffect(() => {
     const timer = setTimeout(() => setMinTimeElapsed(true), 2000);
     return () => clearTimeout(timer);
   }, []);
   ```
5. Set app ready immediately (static export):
   ```tsx
   useEffect(() => {
     setAppReady(true);
   }, []);
   ```
6. Add fade trigger when both conditions met:
   ```tsx
   useEffect(() => {
     if (minTimeElapsed && appReady) {
       setIsVisible(false);
     }
   }, [minTimeElapsed, appReady]);
   ```
7. Render splash screen with:
   - Fixed full-screen positioning (`fixed inset-0`)
   - High z-index (`z-50`) to appear above all content
   - Red background (`bg-[#ff0000]`)
   - Conditional opacity classes based on `isVisible`
   - Transition utilities (`transition-opacity duration-500`)
   - Centered logo with `flex items-center justify-center`
   - Next.js Image with `onError` handler
   - Apply `animate-pulse-logo` class to logo
   - Add `pointer-events-none` when hidden

**Acceptance Criteria**:
- [ ] Component is a client component (`'use client'` directive)
- [ ] Four state flags implemented correctly
- [ ] Dual-timer logic works (2s minimum + app ready)
- [ ] Fade out triggered only when both conditions met
- [ ] Red background covers full screen
- [ ] Logo centered with flexbox
- [ ] Image has error handling (sets logoError on fail)
- [ ] Pulsing animation applied to logo
- [ ] Smooth opacity transition configured
- [ ] pointer-events-none prevents interaction when hidden
- [ ] TypeScript types are correct (no errors)

**Estimated Time**: 20 minutes

**Dependencies**: None (can run in parallel with T002, but animation class won't work until T002 complete)

---

### T004: Integrate SplashScreen into Root Layout ✅
**File**: `src/app/layout.tsx`

**Objective**: Add SplashScreen to root layout to ensure it appears on every page load (FR-006, FR-009)

**Steps**:
1. Open `src/app/layout.tsx`
2. Import SplashScreen component:
   ```tsx
   import { SplashScreen } from '@/components/SplashScreen';
   ```
3. Add SplashScreen as first child in body (before {children}):
   ```tsx
   <body>
     <SplashScreen />
     {children}
   </body>
   ```

**Acceptance Criteria**:
- [ ] Import statement added
- [ ] SplashScreen rendered BEFORE {children}
- [ ] File compiles without errors
- [ ] No TypeScript errors

**Estimated Time**: 3 minutes

**Dependencies**: Requires T003 complete (component must exist)

---

## Phase 3.3: Manual Validation

### T005: Visual Validation - Desktop Initial Load
**Scenario**: Quickstart Scenario 1, 2, 4

**Objective**: Verify splash screen displays correctly on desktop with proper timing and animation

**Steps**:
1. Start dev server: `npm run dev`
2. Open browser in incognito/private mode
3. Navigate to http://localhost:3000
4. Observe splash screen with stopwatch ready
5. Validate against Scenario 1 checklist in quickstart.md:
   - Full-screen red background appears immediately
   - Logo centered and maintains aspect ratio
   - Splash covers entire viewport
   - Display time is at least 2 seconds (time it!)
   - Smooth fade out transition
   - Main app appears after fade
6. Validate against Scenario 2 checklist:
   - Logo pulsing animation visible
   - Animation smooth and continuous
   - Pulse is gentle (not jarring)
   - Animation maintains center position
7. Validate against Scenario 4 checklist:
   - Smooth opacity fade (not instant)
   - Duration feels appropriate (~500ms)
   - No visual glitches
   - Clean handoff to main app

**Acceptance Criteria**:
- [ ] Red background (#ff0000) fills entire screen
- [ ] Logo visible and centered
- [ ] Minimum 2-second display time confirmed with stopwatch
- [ ] Pulsing animation observed and smooth
- [ ] Fade out transition smooth and glitch-free
- [ ] Main app loads after splash completes

**Estimated Time**: 5 minutes

**Dependencies**: Requires T002, T003, T004 complete

---

### T006: Visual Validation - Page Refresh Behavior
**Scenario**: Quickstart Scenario 3

**Objective**: Verify splash appears on every page reload (FR-009)

**Steps**:
1. With dev server running and page loaded
2. Wait for splash to complete and main app to appear
3. Refresh page (Cmd+R or Ctrl+R)
4. Observe splash screen appears again
5. Repeat refresh 2 more times (3 total refreshes)
6. Validate against Scenario 3 checklist:
   - Splash appears on every refresh
   - Full 2-second minimum display each time
   - Animation plays completely each time
   - No flash of main content before splash

**Acceptance Criteria**:
- [ ] Splash appears on 1st refresh
- [ ] Splash appears on 2nd refresh
- [ ] Splash appears on 3rd refresh
- [ ] No session-based suppression detected
- [ ] Consistent behavior across all refreshes

**Estimated Time**: 3 minutes

**Dependencies**: Requires T005 complete

---

### T007: Visual Validation - Responsive Design
**Scenario**: Quickstart Scenario 5

**Objective**: Verify splash adapts to different screen sizes (FR-012, FR-013)

**Steps**:
1. Open page in browser with dev server running
2. Open browser devtools (F12)
3. Toggle device toolbar (responsive mode)
4. Test these viewports:
   - Mobile: iPhone 12 Pro (390x844)
   - Tablet: iPad Air (820x1180)
   - Desktop: 1920x1080
5. For each viewport, validate:
   - Red background fills entire screen
   - Logo remains centered
   - Logo scales appropriately
   - No scrolling required
   - No content overflow

**Acceptance Criteria**:
- [ ] Mobile: Logo centered, no overflow, appropriate size
- [ ] Tablet: Logo centered, no overflow, appropriate size
- [ ] Desktop: Logo centered, no overflow, appropriate size
- [ ] No horizontal/vertical scrollbars on any viewport
- [ ] Splash covers entire viewport on all sizes

**Estimated Time**: 5 minutes

**Dependencies**: Requires T005 complete

---

### T008: Visual Validation - Error Handling
**Scenario**: Quickstart Scenario 6

**Objective**: Verify splash handles missing logo gracefully (FR-014, FR-015)

**Steps**:
1. Stop dev server
2. Temporarily rename `info/tinker_splash.png` to `info/tinker_splash.png.bak`
3. Start dev server: `npm run dev`
4. Open page and observe behavior
5. Validate:
   - Red background still appears
   - No JavaScript errors in console
   - Splash still displays for 2 seconds
   - App still loads after splash
   - User experience not broken
6. Stop dev server
7. Rename logo back to `info/tinker_splash.png`
8. Restart dev server and verify normal operation restored

**Acceptance Criteria**:
- [ ] Red background displays even without logo
- [ ] No console errors related to missing image
- [ ] Splash timing still works (2s minimum)
- [ ] App loads successfully after splash
- [ ] Graceful degradation confirmed

**Estimated Time**: 5 minutes

**Dependencies**: Requires T005 complete

---

### T009: Visual Validation - Z-Index Stacking
**Scenario**: Quickstart Scenario 8

**Objective**: Verify splash appears above all other content (FR-001)

**Steps**:
1. With dev server running, open page
2. During splash screen display, open devtools
3. Inspect Elements tab
4. Verify splash div has:
   - `position: fixed`
   - High z-index (z-50 = 50 in CSS)
   - Positioned above all other elements
5. Verify no other elements visible during splash
6. Verify splash prevents interaction with underlying content

**Acceptance Criteria**:
- [ ] Splash has `position: fixed` and `inset: 0`
- [ ] Z-index is 50 (z-50 class)
- [ ] No other content visible during splash
- [ ] Clicks don't reach underlying content during splash
- [ ] After fade, pointer-events-none prevents interaction with hidden splash

**Estimated Time**: 3 minutes

**Dependencies**: Requires T005 complete

---

### T010: Build & Production Validation
**Scenario**: Build verification

**Objective**: Verify splash works in production static export (FR-001 through FR-018 in production)

**Steps**:
1. Stop dev server
2. Run production build: `npm run build`
3. Verify build succeeds without errors
4. Serve static export locally (use `npx serve out` or similar)
5. Open production build in browser
6. Verify all splash screen functionality:
   - Appears on initial load
   - 2-second minimum timing
   - Pulsing animation smooth
   - Fade out transition works
   - Appears on refresh
   - Responsive on different viewports
7. Check browser console for any production errors
8. Verify splash doesn't block app functionality

**Acceptance Criteria**:
- [ ] `npm run build` succeeds with no errors
- [ ] Static export generated in `/out` directory
- [ ] Splash appears correctly in production build
- [ ] All animations and transitions work
- [ ] No console errors in production
- [ ] Main app functions normally after splash
- [ ] File size impact minimal (check bundle size)

**Estimated Time**: 8 minutes

**Dependencies**: Requires T005, T006, T007, T008, T009 complete

---

## Dependencies Summary

```
T001 (verify asset) → Independent
T002 (CSS animation) → Independent [P]
T003 (component) → Independent [P]
T004 (layout integration) → Requires T003

T005 (desktop validation) → Requires T002, T003, T004
T006 (refresh behavior) → Requires T005
T007 (responsive) → Requires T005
T008 (error handling) → Requires T005
T009 (z-index) → Requires T005
T010 (production build) → Requires T005-T009
```

**Critical Path**: T003 → T004 → T005 → T010

**Parallel Opportunities**:
- T002 and T003 can run simultaneously
- T006, T007, T008, T009 can run after T005 (though sequential testing may be clearer)

---

## Parallel Execution Example

```bash
# Phase 1: Setup
Task: "Verify logo asset exists at info/tinker_splash.png"

# Phase 2: Core Implementation (parallel)
Task: "Add pulsing animation keyframes to src/app/globals.css"
# AND simultaneously
Task: "Create SplashScreen component in src/components/SplashScreen.tsx"

# Phase 3: Integration (after both T002 and T003 complete)
Task: "Import and render SplashScreen in src/app/layout.tsx"

# Phase 4: Validation (sequential for clarity)
Task: "Visual validation - desktop initial load"
Task: "Visual validation - page refresh behavior"
Task: "Visual validation - responsive design"
Task: "Visual validation - error handling"
Task: "Visual validation - z-index stacking"
Task: "Build and production validation"
```

---

## Notes

**No Automated Tests**: Per constitution, this feature uses manual visual validation only. All validation tasks reference quickstart.md scenarios.

**Static Export Compatible**: All implementation is client-side React. Works perfectly with `output: 'export'` in next.config.js.

**No New Dependencies**: Feature uses only existing stack (React 19, Next.js 15, Tailwind 4). Zero bundle size impact from new packages.

**Graceful Degradation**: Logo error handling ensures app never breaks even if asset missing.

**Performance**: CSS animations are GPU-accelerated. Target 60fps for smooth experience.

---

## Validation Checklist
*GATE: Must verify before marking feature complete*

- [x] All functional requirements have validation tasks (FR-001 through FR-018)
- [x] All quickstart scenarios covered (8 scenarios → validation tasks)
- [x] Each task specifies exact file path
- [x] Parallel tasks are truly independent (T002 and T003)
- [x] Dependencies clearly documented
- [x] No automated tests (per constitution compliance)
- [x] Build validation included (T010)
- [x] Production behavior verified (T010)

---

**Total Tasks**: 10  
**Estimated Total Time**: ~60 minutes  
**Parallel Opportunities**: 2 tasks (T002, T003)  
**Critical Path Length**: 5 tasks (T003 → T004 → T005 → ... → T010)
