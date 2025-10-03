# Quickstart: Splash Screen Validation

**Date**: 2025-10-03  
**Feature**: Full-screen splash screen with logo animation  
**Purpose**: Manual validation steps to verify splash screen meets all functional requirements

---

## Prerequisites

**Environment**:
- Node.js installed
- Repository cloned and on branch `002-me-gustaria-agregar`
- Dependencies installed: `npm install`

**Build**:
```bash
npm run build
```
Expected: Build succeeds, generates `/out` directory

**Start Dev Server**:
```bash
npm run dev
```
Expected: Server starts on http://localhost:3000

---

## Validation Scenarios

### ✅ Scenario 1: Initial Page Load (FR-001, FR-002, FR-003, FR-004, FR-007)

**Test**: Open webapp for first time

**Steps**:
1. Open browser (use incognito/private mode to ensure clean state)
2. Navigate to http://localhost:3000
3. Observe page load sequence

**Expected Results**:
- ✓ Full-screen red background (#ff0000) appears IMMEDIATELY
- ✓ No other content visible (splash appears before main app)
- ✓ Tinker logo visible in center of screen
- ✓ Logo maintains aspect ratio (not stretched/squished)
- ✓ Splash covers entire viewport (100vw x 100vh)
- ✓ Splash displays for at least 2 seconds (use stopwatch or browser devtools Performance)
- ✓ After 2+ seconds, splash smoothly fades out
- ✓ Main app (sneaker swipe interface) becomes visible after fade

**Validation**:
- [ ] Red background fills entire screen
- [ ] Logo centered horizontally and vertically
- [ ] Minimum 2-second display time met
- [ ] Smooth fade out transition observed

---

### ✅ Scenario 2: Logo Pulsing Animation (FR-016, FR-017, FR-018)

**Test**: Observe logo animation during splash display

**Steps**:
1. Refresh page (Cmd+R / Ctrl+R)
2. Focus on the logo during the 2-second splash display
3. Observe animation behavior

**Expected Results**:
- ✓ Logo smoothly scales between 95% and 100% size
- ✓ Animation is continuous (loops) until fade out begins
- ✓ Pulse is gentle and smooth (not jarring)
- ✓ Animation runs at ~60fps (no stuttering)
- ✓ Animation maintains logo center position (doesn't shift)

**Validation**:
- [ ] Pulsing animation visible and smooth
- [ ] Animation not too fast or slow (~1.5s cycle)
- [ ] No motion sickness effect (gentle pulse)
- [ ] Animation stops when fade out begins

---

### ✅ Scenario 3: Page Refresh Behavior (FR-009)

**Test**: Verify splash appears on every page reload

**Steps**:
1. Wait for splash to complete and main app to appear
2. Refresh page (Cmd+R / Ctrl+R)
3. Repeat 3 times

**Expected Results**:
- ✓ Splash appears on EVERY refresh (not suppressed)
- ✓ Full 2-second minimum display each time
- ✓ Animation plays completely each time
- ✓ No "flash" of main content before splash

**Validation**:
- [ ] Splash appears on 1st refresh
- [ ] Splash appears on 2nd refresh
- [ ] Splash appears on 3rd refresh
- [ ] No session-based suppression detected

---

### ✅ Scenario 4: Fade Out Transition (FR-010, FR-011)

**Test**: Verify smooth opacity transition

**Steps**:
1. Refresh page and watch splash exit animation closely
2. Open browser devtools → Elements → inspect splash div during fade
3. Observe opacity value change

**Expected Results**:
- ✓ Opacity transitions from 100% to 0% smoothly
- ✓ Transition takes ~500ms (smooth but not sluggish)
- ✓ No jarring visual artifacts (flicker, jump, flash)
- ✓ Main app becomes progressively visible during fade
- ✓ After fade completes, splash is not interactable (pointer-events: none)

**Validation**:
- [ ] Smooth fade observed (not instant cut)
- [ ] Duration feels appropriate (~0.5s)
- [ ] No visual glitches during transition
- [ ] Clean handoff to main app

---

### ✅ Scenario 5: Responsive Design (FR-012, FR-013)

**Test**: Verify splash adapts to different screen sizes

**Steps**:
1. Open page in desktop browser (1920x1080)
2. Open devtools → Toggle device toolbar
3. Test these viewports:
   - Mobile: iPhone 12 Pro (390x844)
   - Tablet: iPad Air (820x1180)
   - Desktop: 1920x1080

**Expected Results (all viewports)**:
- ✓ Red background fills entire screen
- ✓ Logo remains centered
- ✓ Logo scales appropriately (not too small or too large)
- ✓ No horizontal/vertical scrolling
- ✓ No content overflow

**Validation**:
- [ ] Mobile: Logo visible and centered, no overflow
- [ ] Tablet: Logo visible and centered, no overflow
- [ ] Desktop: Logo visible and centered, no overflow
- [ ] Resize works (drag window smaller/larger)

---

### ✅ Scenario 6: Missing Logo Error Handling (FR-014, FR-015)

**Test**: Verify graceful degradation when logo fails

**Steps**:
1. Stop dev server
2. Rename/move `info/tinker_splash.png` to simulate missing file
3. Restart dev server
4. Refresh page

**Expected Results**:
- ✓ Red background still displays
- ✓ Splash screen timing still works (2-second minimum)
- ✓ Fade out transition still works
- ✓ Main app becomes accessible after splash
- ✓ NO error messages or crash
- ✓ App functionality not blocked

**Validation**:
- [ ] Red splash appears even without logo
- [ ] Timing and transitions still work
- [ ] App loads normally after splash
- [ ] No console errors that block app

**Cleanup**: Restore `tinker_splash.png` after test

---

### ✅ Scenario 7: Timing Edge Cases

**Test**: Fast/slow network simulation

**Steps**:
1. Open devtools → Network tab → Throttling
2. Test with "Slow 3G" throttling
3. Test with "No throttling" (instant load)

**Expected Results (both cases)**:
- ✓ Splash ALWAYS displays for minimum 2 seconds
- ✓ Fast load: Splash waits full 2s even if assets load instantly
- ✓ Slow load: Splash continues pulsing until load complete (may exceed 2s)
- ✓ Fade only starts when BOTH conditions met (2s + load complete)

**Validation**:
- [ ] Slow 3G: Splash visible during loading (pulsing continues)
- [ ] No throttling: Splash still shows minimum 2 seconds
- [ ] Timing logic works correctly in both cases

---

### ✅ Scenario 8: Z-Index & Stacking

**Test**: Verify splash appears above all content

**Steps**:
1. Refresh page
2. Inspect splash div in devtools → check z-index
3. Observe if any content "leaks through" during splash

**Expected Results**:
- ✓ Splash has high z-index (z-50 = 50)
- ✓ No header, buttons, or content visible during splash
- ✓ Splash completely obscures all other content
- ✓ After fade, content becomes fully visible (not partially obscured)

**Validation**:
- [ ] No content visible during splash display
- [ ] Clean stacking order (splash always on top)
- [ ] No z-index conflicts with header or other components

---

## Build & Export Validation

### Static Export Compatibility

**Test**: Verify feature works with static export

**Steps**:
```bash
npm run build
cd out
npx http-server -p 8080
```

**Navigate to**: http://localhost:8080

**Expected Results**:
- ✓ Splash appears on initial load of static build
- ✓ All timing and animations work identically to dev mode
- ✓ Refresh behavior works (splash appears every time)
- ✓ Logo loads correctly from static assets

**Validation**:
- [ ] Static export build succeeds
- [ ] Splash works in production build
- [ ] No errors in browser console
- [ ] Feature identical to dev mode

---

## Performance Validation

### Animation Performance

**Test**: Check animation frame rate

**Steps**:
1. Open devtools → Performance tab
2. Start recording
3. Refresh page (trigger splash)
4. Stop recording after splash completes
5. Analyze frame rate during pulsing animation

**Expected Results**:
- ✓ Frame rate stays at ~60fps during pulse animation
- ✓ No dropped frames or janky animation
- ✓ Fade out transition smooth (no frame drops)
- ✓ Main thread not blocked by splash logic

**Validation**:
- [ ] FPS remains high (>55fps) during animation
- [ ] No long tasks or blocking scripts
- [ ] Animation performance acceptable

---

## Summary Checklist

**Before merging to main, ensure ALL scenarios pass:**

**Display & Layout**:
- [ ] Full-screen red background (#ff0000)
- [ ] Logo centered horizontally and vertically
- [ ] Logo maintains aspect ratio
- [ ] Responsive on mobile, tablet, desktop

**Timing & Behavior**:
- [ ] Minimum 2-second display time
- [ ] Waits for app to load before fading
- [ ] Appears on every page load/refresh
- [ ] No session-based suppression

**Animation**:
- [ ] Pulsing logo animation smooth and continuous
- [ ] Fade out transition smooth (~500ms)
- [ ] No visual artifacts or glitches
- [ ] 60fps performance maintained

**Error Handling**:
- [ ] Graceful degradation if logo missing
- [ ] App not blocked by splash errors
- [ ] No console errors that break functionality

**Integration**:
- [ ] Works with static export (npm run build)
- [ ] No conflicts with existing components
- [ ] High z-index keeps splash above all content

**Constitution Compliance**:
- [ ] No new dependencies added
- [ ] Static-first architecture maintained
- [ ] Component reusability demonstrated

---

**If all checks pass**: Feature is ready for merge to main branch ✅
