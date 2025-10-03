# Quickstart: Sneaker Swipe Feature

**Feature**: 001-sneaker-swipe-feature  
**Date**: 2025-10-01  
**Purpose**: End-to-end manual verification guide for Sneaker Heart swipe interface

---

## Prerequisites

1. ✅ Node.js 18+ installed
2. ✅ Repository cloned
3. ✅ On feature branch `001-sneaker-swipe-feature`
4. ✅ Dependencies installed (`npm install`)

---

## Setup (First Time)

```bash
# Clone and navigate
cd sneaker-heart-simple

# Install dependencies
npm install

# Verify Next.js and Tailwind installed
npm list next react tailwindcss
```

Expected output:
```
├── next@14.x.x
├── react@18.x.x
└── tailwindcss@3.x.x
```

---

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

Expected output:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in Xms
```

### 2. Open Application

Navigate to `http://localhost:3000` in your browser

**First Load Checklist**:
- [ ] Page loads within 2 seconds
- [ ] Sneaker Heart logo visible in fixed header
- [ ] First sneaker card displayed (Nike SB Dunk Low x Yuto Matcha)
- [ ] Two circular buttons visible below card (X left, heart right)
- [ ] No console errors

---

## Feature Verification Scenarios

### Scenario 1: Desktop Mouse Swipe (Right - LIKE)

**Steps**:
1. Click and hold on the sneaker card image
2. Drag right at least 50% of screen width
3. Release mouse

**Expected Behavior**:
- [ ] Card follows cursor during drag
- [ ] Green transparent overlay appears with white heart icon (100-150px, 80% opacity)
- [ ] Overlay displays for 500ms
- [ ] Next sneaker appears (Nike SB Dunk Low Pro Tourmaline)
- [ ] Smooth transition between cards

---

### Scenario 2: Mobile Touch Swipe (Left - DISLIKE)

**Steps**:
1. Touch and hold the sneaker card
2. Swipe left at least 50% of screen width
3. Release

**Expected Behavior**:
- [ ] Card follows touch during swipe
- [ ] Red transparent overlay appears with white X icon (100-150px, 80% opacity)
- [ ] Overlay displays for 500ms
- [ ] Next sneaker appears
- [ ] Animation remains smooth (60fps)

---

### Scenario 3: Button Tap (LIKE)

**Steps**:
1. Click/tap the heart button (right circular button)

**Expected Behavior**:
- [ ] Green overlay appears immediately (no drag animation)
- [ ] Heart icon centered and visible
- [ ] 500ms delay
- [ ] Next sneaker loads
- [ ] No visual glitches

---

### Scenario 4: Button Tap (DISLIKE)

**Steps**:
1. Click/tap the X button (left circular button)

**Expected Behavior**:
- [ ] Red overlay appears immediately
- [ ] X icon centered and visible
- [ ] 500ms delay
- [ ] Next sneaker loads

---

### Scenario 5: Card Content Verification

**For each of the 4 sneakers, verify**:

**Sneaker 1: Nike SB Dunk Low x Yuto Matcha**
- [ ] Image loads correctly
- [ ] Name displayed: "Nike SB Dunk Low x Yuto Matcha"
- [ ] Description: "50% Matcha, 50% nipón."
- [ ] Purchase type box: "Raffle" (black border)
- [ ] Availability type box: "Lanzamiento 10/10" (black border)
- [ ] Info boxes on red background (matching logo color)

**Sneaker 2: Nike SB Dunk Low Pro Tourmaline**
- [ ] All fields render correctly
- [ ] Description: "Un homenaje al rodeo..."
- [ ] Purchase type: "A definir"
- [ ] Availability: "Lanzamiento 24/10"

**Sneaker 3: Nike SB Dunk High & Blazer Antihero**
- [ ] Description includes "😈" emoji
- [ ] Purchase type: "Venta Directa"
- [ ] Availability: "Disponible en Drifters"

**Sneaker 4: Nike SB Dunk Low Pro x Riot Skateshop**
- [ ] Description includes "🍷" emoji
- [ ] Purchase type: "Venta Directa"
- [ ] Availability: "Disponible en Drifters"

---

### Scenario 6: Completion Screen

**Steps**:
1. Swipe/tap through all 4 sneakers (any combination of LIKE/DISLIKE)

**Expected Behavior**:
- [ ] After 4th swipe, completion screen appears
- [ ] Message displayed exactly: "Mientras esperas tu Match aprovecha tu codigo de descuento del 10% en drifters.com.ar. Codigo: SNEAKERS_HEART"
- [ ] Clickable link/button to drifters.com.ar visible
- [ ] Clicking link opens drifters.com.ar in new tab
- [ ] No way to go back (no "restart" button per clarifications)

---

### Scenario 7: Incomplete Swipe (Cancel)

**Steps**:
1. Start swiping a card
2. Drag less than 50% of screen width
3. Release

**Expected Behavior**:
- [ ] Card returns to center position
- [ ] No overlay appears
- [ ] Same sneaker remains visible
- [ ] Smooth spring-back animation

---

### Scenario 8: Swipe During Animation

**Steps**:
1. Swipe right on a card
2. While overlay is still visible (within 500ms), try to swipe again

**Expected Behavior**:
- [ ] Second swipe is ignored
- [ ] Current overlay completes its 500ms duration
- [ ] Next card appears only after overlay finishes
- [ ] No "double swipe" bug

---

### Scenario 9: Image Load Failure

**Steps**:
1. Temporarily rename one image file in `/public/info/sneakers-images/`
2. Reload the page
3. Navigate to the sneaker with broken image

**Expected Behavior**:
- [ ] Placeholder image appears
- [ ] Alt text shows "Imagen no disponible"
- [ ] Swipe functionality still works
- [ ] Other sneakers unaffected

**Cleanup**: Rename image file back to original

---

### Scenario 10: Responsive Design (Mobile)

**Test on actual device or DevTools (iPhone 12 Pro, Pixel 5)**:

**Portrait Mode (375px width)**:
- [ ] Card fills most of screen width
- [ ] Info boxes stack vertically if needed
- [ ] Buttons are thumb-friendly (min 44px touch target)
- [ ] No horizontal scrolling
- [ ] Logo header remains fixed at top

**Landscape Mode (NOT primary use case)**:
- [ ] Card remains centered
- [ ] No critical content cut off
- [ ] Usable but not optimized (acceptable per requirements)

---

### Scenario 11: Responsive Design (Desktop)

**Test at 1920x1080**:
- [ ] Card has max-width constraint (doesn't fill full screen)
- [ ] Centered horizontally
- [ ] Info boxes readable (not too stretched)
- [ ] Mouse swipe works smoothly
- [ ] Buttons show hover states

---

### Scenario 12: Page Refresh Mid-Session

**Steps**:
1. Swipe through 2 sneakers
2. Press F5 or Cmd+R to refresh
3. Wait for page reload

**Expected Behavior**:
- [ ] Page resets to first sneaker
- [ ] No error messages
- [ ] Previous interactions forgotten (no localStorage)
- [ ] Can swipe through all 4 again

---

## Performance Verification

### Load Time
```bash
# Build production version
npm run build

# Serve production build
npm run start
```

**Metrics to check (Chrome DevTools > Lighthouse)**:
- [ ] First Contentful Paint < 2 seconds
- [ ] Largest Contentful Paint < 2.5 seconds
- [ ] Total bundle size < 5MB
- [ ] No layout shift during initial load

### Animation Performance

**Chrome DevTools > Performance tab**:
1. Start recording
2. Perform 3-4 swipes
3. Stop recording

**Check**:
- [ ] Swipe animations maintain 60fps (no red bars in flame chart)
- [ ] Overlay fade runs smoothly
- [ ] No jank during transitions

---

## Browser Compatibility

**Test in**:
- [ ] Chrome (latest)
- [ ] Safari (iOS)
- [ ] Firefox (latest)
- [ ] Chrome (Android)

**Critical checks per browser**:
- Touch events work
- PointerEvents API supported
- CSS transitions smooth
- Images load correctly

---

## Static Build Verification

```bash
# Generate static export
npm run build

# Check output directory
ls -la out/

# Expected files:
# - index.html (main page)
# - _next/ (JS/CSS bundles)
# - info/ (sneaker data and images)
```

**Verify**:
- [ ] `out/index.html` exists
- [ ] No server-side code in output
- [ ] All images copied to `out/` directory
- [ ] Can serve from any static host (test with `npx serve out`)

---

## Deployment Simulation

```bash
# Install serve (if not already)
npm install -g serve

# Serve static build
serve out -l 3001

# Open http://localhost:3001
```

**Test all scenarios again on static build**:
- [ ] Swipe gestures work
- [ ] Overlays appear
- [ ] Completion screen shows
- [ ] Link to drifters.com.ar works
- [ ] No "API not found" errors

---

## Accessibility Checks (Bonus)

**Keyboard Navigation**:
- [ ] Tab key moves between action buttons
- [ ] Enter key triggers button actions
- [ ] ESC key does nothing (acceptable)

**Screen Reader** (optional):
- [ ] Logo has alt text
- [ ] Sneaker images have descriptive alt text
- [ ] Buttons have aria-labels

---

## Edge Case Testing

### Empty State (Manual Test)
1. Temporarily edit `sneakers-data.json` to empty array `[]`
2. Rebuild and serve
3. Verify error handling (should not crash)
4. Restore original data

### Invalid Data (Manual Test)
1. Edit JSON to remove a required field
2. Rebuild
3. Verify build-time validation catches error
4. Restore original data

---

## Success Criteria (From Spec)

All acceptance scenarios from spec.md must pass:

- [x] Scenario 1: Header + first sneaker on load
- [x] Scenario 2: Swipe right shows green overlay, next sneaker
- [x] Scenario 3: Swipe left shows red overlay, next sneaker
- [x] Scenario 4: Completion screen after 4 swipes with promo code + link
- [x] Scenario 5: Card displays all 5 data fields correctly

**All edge cases verified**:
- [x] Swipe during animation blocked
- [x] Incomplete swipe cancels (returns to center)
- [x] Image failure shows placeholder
- [x] Page refresh resets session
- [x] Responsive on mobile and desktop

---

## Troubleshooting

### Issue: Swipe not triggering
- Check browser console for PointerEvents errors
- Verify `useSwipe` hook is attached to card element
- Test threshold: Try dragging > 50% screen width

### Issue: Overlay not showing
- Check z-index conflicts in DevTools
- Verify overlay state updates in React DevTools
- Confirm 500ms timeout not interrupted

### Issue: Images not loading
- Verify paths start with `/info/sneakers-images/`
- Check file names match exactly (case-sensitive)
- Open Network tab to see 404s

### Issue: Build fails
- Run `npm run build` and check error message
- Verify all dependencies installed
- Check TypeScript errors if using TS

---

## Cleanup

```bash
# Stop dev server
Ctrl+C

# Remove node_modules if needed
rm -rf node_modules

# Fresh install
npm install
```

---

## Summary

**Total Time to Verify**: ~30 minutes

**Critical Path**:
1. Start dev server (1 min)
2. Test all 4 swipe scenarios (5 min)
3. Verify completion screen (2 min)
4. Test responsive mobile (5 min)
5. Build and test static export (10 min)

**Pass Criteria**: All checkboxes ticked, no console errors, 60fps animations

**Constitutional Alignment**: ✅ Manual testing only (no automated tests), visual verification in browser
