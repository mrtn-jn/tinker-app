# Tasks: Sneaker Swipe Matching Interface

**Feature**: 001-sneaker-swipe-feature  
**Input**: Design documents from `C:\Users\marti\hard_code\sneaker-heart\sneaker-heart-simple\specs\001-sneaker-swipe-feature\`  
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

---

## Execution Summary

**Total Tasks**: 38  
**Estimated Time**: 10-15 hours (single developer), 6-8 hours (parallel with 2 developers)  
**Constitution**: No automated tests required (manual verification via quickstart.md)

---

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- All paths relative to repository root
- Per constitution: No automated tests, manual verification only

---

## Phase 3.1: Setup & Configuration

- [ ] **T001** Initialize Next.js 14+ project with TypeScript in repository root
  - Run `npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-git`
  - Verify `package.json`, `tsconfig.json`, and `next.config.js` created

- [ ] **T002** Configure Next.js for static export in `next.config.js`
  - Set `output: 'export'`
  - Set `images: { unoptimized: true }` for static image support
  - Verify configuration matches research.md decisions

- [ ] **T003** Configure Tailwind with custom brand colors in `tailwind.config.ts`
  - Add `brand-red: '#E63946'` to theme.extend.colors
  - Add `overlay-green: '#06D6A0'` to colors
  - Add `overlay-red: '#EF476F'` to colors
  - Verify colors match logo and design reference

- [ ] **T004** Create project directory structure in `src/`
  - Create `src/components/` directory
  - Create `src/hooks/` directory
  - Create `src/types/` directory
  - Create `src/lib/` directory
  - Verify structure matches plan.md

- [ ] **T005** Copy static assets to `public/` directory
  - Copy `info/sneakers-heart-logo.png` to `public/`
  - Copy all sneaker images from `info/sneakers-images/` to `public/info/sneakers-images/`
  - Copy `info/sneakers-data.json` to `public/info/sneakers-data.json`
  - Create placeholder image `public/placeholder-sneaker.png` (simple gray sneaker silhouette)
  - Verify all 4 sneaker images present

---

## Phase 3.2: Types & Data Foundation

- [ ] **T006** [P] Define TypeScript interfaces in `src/types/sneaker.ts`
  - Export `SneakerProfile` interface (name, description, purchase_type, availability_type, images[])
  - Export `SwipeAction` type ('LIKE' | 'DISLIKE')
  - Export `UserInteraction` interface (sneakerId, action, timestamp)
  - Export `SessionState` interface (currentIndex, interactions[], isComplete)
  - Verify types match data-model.md specifications

- [ ] **T007** [P] Implement sneaker data loader in `src/lib/sneakers.ts`
  - Import `sneakers-data.json` via ES module
  - Export `getSneakers()` function returning `SneakerProfile[]`
  - Implement `validateSneakerData()` function per data-model.md
  - Throw error if data doesn't contain exactly 4 sneakers
  - Verify validation catches missing required fields

---

## Phase 3.3: Custom Hooks

- [ ] **T008** [P] Implement useSwipe hook in `src/hooks/useSwipe.ts`
  - Accept `UseSwipeOptions` (threshold, onSwipeComplete, enabled)
  - Return handlers: handlePointerDown, handlePointerMove, handlePointerUp
  - Return state: translateX, isDragging
  - Implement 50% screen width threshold logic per contract
  - Throttle pointerMove to 60fps (16ms intervals)
  - Verify contract specifications from `contracts/useSwipe.contract.md`

- [ ] **T009** [P] Implement useSneakerQueue hook in `src/hooks/useSneakerQueue.ts`
  - Accept `SneakerProfile[]` array as parameter
  - Manage currentIndex state (0-3)
  - Manage interactions array (UserInteraction[])
  - Expose currentSneaker computed value
  - Expose isComplete boolean (true after 4 swipes)
  - Implement recordSwipe(action) function
  - Verify state management per data-model.md

---

## Phase 3.4: Reusable Components

- [ ] **T010** [P] Implement Header component in `src/components/Header.tsx`
  - Accept no props (static component)
  - Render fixed header with `position: fixed, top: 0`
  - Display Sneaker Heart logo from `/sneakers-heart-logo.png`
  - Use Tailwind classes for styling
  - Ensure z-index allows visibility over other content
  - Verify matches quickstart.md checklist

- [ ] **T011** [P] Implement InfoBox component in `src/components/InfoBox.tsx`
  - Accept props: label (string), value (string)
  - Render bordered box with black border (border-black, border-2)
  - Use brand-red background from Tailwind config
  - Display label and value with readable typography
  - Verify styling matches design reference

- [ ] **T012** [P] Implement ActionButtons component in `src/components/ActionButtons.tsx`
  - Accept props: onLike (callback), onDislike (callback), disabled (boolean)
  - Render two circular buttons side by side
  - Left button: X icon, triggers onDislike
  - Right button: Heart icon, triggers onLike
  - Buttons disabled when disabled=true
  - Use Tailwind for circular shape (rounded-full)
  - Min touch target 44px for mobile accessibility
  - Verify button positioning per design reference

- [ ] **T013** [P] Implement SwipeOverlay component in `src/components/SwipeOverlay.tsx`
  - Accept props: type ('like' | 'dislike' | null), duration (default 500ms)
  - Render full-screen overlay with fixed positioning (inset-0, z-50)
  - LIKE: green background (overlay-green/30), white heart icon
  - DISLIKE: red background (overlay-red/30), white X icon
  - Icon size: 100-150px (w-32 h-32), white with 80% opacity
  - Implement fade in/out animation (150ms each)
  - Auto-hide after duration with useEffect cleanup
  - Verify animation timing per contract (500ms total)
  - Block pointer events while visible

- [ ] **T014** [P] Implement CompletionScreen component in `src/components/CompletionScreen.tsx`
  - Accept no props (static content)
  - Display message: "Mientras esperas tu Match aprovecha tu codigo de descuento del 10% en drifters.com.ar. Codigo: SNEAKERS_HEART"
  - Render clickable link/button to "https://drifters.com.ar"
  - Link opens in new tab (target="_blank", rel="noopener noreferrer")
  - Center content vertically and horizontally
  - Use Tailwind for responsive typography
  - Verify exact message per FR-011

---

## Phase 3.5: Main Feature Component

- [ ] **T015** Implement SneakerCard component in `src/components/SneakerCard.tsx`
  - Accept props per contract: sneaker (SneakerProfile), onSwipe (callback), isInteractive (boolean)
  - Integrate useSwipe hook with 50% threshold
  - Render sneaker image with full size, prominent placement
  - Implement image error handling with onError → placeholder fallback
  - Display sneaker name as heading (text-2xl font-bold)
  - Render 3 InfoBox components (purchase_type, availability_type, description)
  - Info section background: brand-red from Tailwind config
  - Apply translateX transform during drag for visual feedback
  - Disable interactions when isInteractive=false
  - Verify component matches `contracts/SneakerCard.contract.md`

- [ ] **T016** Wire up SneakerCard swipe events
  - Connect onSwipe callback to parent state management
  - Trigger direction detection ('left' | 'right')
  - Handle card reset animation when swipe < 50%
  - Verify smooth card-follows-pointer behavior
  - Test on both touch and mouse inputs

---

## Phase 3.6: Main Page Integration

- [ ] **T017** Implement main page in `src/app/page.tsx`
  - Import all components (Header, SneakerCard, ActionButtons, SwipeOverlay, CompletionScreen)
  - Load sneakers via getSneakers() from lib/sneakers.ts
  - Initialize useSneakerQueue hook with loaded sneakers
  - Manage overlay state (type, visibility)
  - Render Header at top (fixed)
  - Conditionally render SneakerCard OR CompletionScreen based on isComplete
  - Render ActionButtons below card
  - Render SwipeOverlay as top layer

- [ ] **T018** Wire up LIKE action flow
  - ActionButtons heart click → trigger recordSwipe('right')
  - SneakerCard swipe right → trigger recordSwipe('right')
  - Show green overlay (500ms) after LIKE action
  - Increment currentIndex after overlay completes
  - Disable interactions during overlay animation (isInteractive=false)
  - Verify FR-007 compliance (overlay specs)

- [ ] **T019** Wire up DISLIKE action flow
  - ActionButtons X click → trigger recordSwipe('left')
  - SneakerCard swipe left → trigger recordSwipe('left')
  - Show red overlay (500ms) after DISLIKE action
  - Increment currentIndex after overlay completes
  - Disable interactions during overlay animation
  - Verify FR-008 compliance (overlay specs)

- [ ] **T020** Implement completion screen transition
  - When isComplete=true, hide SneakerCard and ActionButtons
  - Show CompletionScreen component
  - Verify message displays correctly
  - Test link to drifters.com.ar opens in new tab
  - Verify no way to restart (per clarification)

---

## Phase 3.7: Responsive & Polish

- [ ] **T021** [P] Implement mobile-first responsive design
  - Base styles: Full-width card, portrait orientation
  - sm breakpoint (640px+): Center card with max-w-md
  - lg breakpoint (1024px+): Larger card with max-w-lg
  - Verify touch targets ≥ 44px on mobile
  - Test on actual device or DevTools (iPhone 12, Pixel 5)
  - Verify quickstart.md Scenario 10 passes

- [ ] **T022** [P] Add CSS transitions for smooth animations
  - Card drag: Use CSS transform with transition-transform
  - Overlay fade: transition-opacity duration-150
  - Button hover states (desktop only)
  - Verify 60fps in Chrome DevTools Performance tab
  - Test swipe smoothness per quickstart.md

- [ ] **T023** [P] Implement global styles in `src/app/globals.css`
  - Import Tailwind directives (@tailwind base/components/utilities)
  - Add touch-action: pan-y for vertical scroll compatibility
  - Set body background color (if specified in design)
  - Verify no conflicting styles

- [ ] **T024** [P] Add accessibility attributes
  - Logo image alt text: "Sneaker Heart"
  - Sneaker images alt text: sneaker.name
  - InfoBox semantic HTML (dl/dt/dd or similar)
  - Action buttons aria-labels: "Like sneaker" / "Dislike sneaker"
  - Overlay role="status" aria-live="polite"
  - Test keyboard navigation (Tab, Enter on buttons)

---

## Phase 3.8: Build & Validation

- [ ] **T025** Configure root layout in `src/app/layout.tsx`
  - Set metadata (title: "Sneaker Heart", description)
  - Import globals.css
  - Set lang="es" or "en" based on content language
  - Verify proper HTML structure

- [ ] **T026** Test development build
  - Run `npm run dev`
  - Open http://localhost:3000
  - Verify first sneaker loads
  - Test swipe right gesture
  - Test swipe left gesture
  - Verify overlays appear correctly
  - Check browser console for errors
  - Reference quickstart.md Scenarios 1-6

- [ ] **T027** Build static export
  - Run `npm run build`
  - Verify build succeeds with no errors
  - Check `out/` directory created
  - Verify `out/index.html` exists
  - Verify all images copied to `out/info/`
  - Check bundle size < 5MB total

- [ ] **T028** Test static build locally
  - Install serve: `npm install -g serve`
  - Run `serve out -l 3001`
  - Open http://localhost:3001
  - Repeat all quickstart scenarios on static build
  - Verify no "API not found" errors
  - Verify all assets load correctly

---

## Phase 3.9: Cross-Browser & Edge Cases

- [ ] **T029** [P] Test in Chrome/Edge
  - Run all quickstart.md scenarios
  - Verify swipe gestures work (mouse drag)
  - Check DevTools console for errors
  - Test responsive breakpoints
  - Verify 60fps animations

- [ ] **T030** [P] Test in Safari (iOS)
  - Test on actual iPhone or iOS Simulator
  - Verify touch swipe gestures work
  - Check PointerEvents compatibility
  - Verify overlay animations smooth
  - Test image loading

- [ ] **T031** [P] Test in Firefox
  - Run core swipe scenarios
  - Verify pointer events work
  - Check CSS compatibility
  - Test responsive design

- [ ] **T032** Test edge cases per quickstart.md
  - Scenario 7: Incomplete swipe (< 50%) → card returns to center
  - Scenario 8: Swipe during animation → ignored
  - Scenario 9: Image load failure → placeholder shown
  - Scenario 12: Page refresh → resets to first sneaker
  - Verify all edge cases handle gracefully

---

## Phase 3.10: Performance & Final Validation

- [ ] **T033** Run Lighthouse performance audit
  - Open Chrome DevTools > Lighthouse
  - Run audit on production build
  - Verify First Contentful Paint < 2s
  - Verify Largest Contentful Paint < 2.5s
  - Verify no layout shift (CLS score)
  - Document any warnings

- [ ] **T034** Profile animation performance
  - Open Chrome DevTools > Performance
  - Record while performing 3-4 swipes
  - Check for 60fps throughout (no red bars)
  - Verify no long tasks (> 50ms)
  - Optimize if any jank detected

- [ ] **T035** Manual verification via quickstart.md
  - Complete all 12 scenarios in quickstart.md
  - Check all checkboxes in verification guide
  - Test on mobile device (actual hardware)
  - Test on desktop browser
  - Document any issues found

- [ ] **T036** [P] Code cleanup and optimization
  - Remove console.log statements
  - Remove unused imports
  - Verify TypeScript strict mode passes
  - Run `npm run lint` (if configured)
  - Remove any TODO comments

- [ ] **T037** [P] Update documentation
  - Add README.md with project overview
  - Document setup instructions (npm install, npm run dev)
  - Document build instructions (npm run build)
  - Reference quickstart.md for testing
  - Add deployment notes (Vercel, Netlify, etc.)

- [ ] **T038** Final constitutional compliance check
  - ✅ No authentication/login implemented
  - ✅ No database used
  - ✅ No backend APIs
  - ✅ No testing frameworks installed
  - ✅ Static export successful
  - ✅ Tailwind CSS used for all styling
  - ✅ Component-based architecture
  - Document compliance in README.md

---

## Dependencies

### Setup Phase (Sequential)
- T001 → T002 → T003 → T004 → T005

### Foundation Phase (Parallel after Setup)
- T006, T007 can run in parallel after T004

### Hooks Phase (Parallel after Foundation)
- T008, T009 can run in parallel after T006

### Components Phase (Parallel after Hooks)
- T010, T011, T012, T013, T014 can run in parallel after T006

### Integration Phase (Sequential after Components)
- T015 requires T008, T009, T011
- T016 requires T015
- T017 requires all components (T010-T015)
- T018, T019, T020 sequential after T017

### Polish Phase (Mostly Parallel)
- T021, T022, T023, T024 can run in parallel after T020

### Validation Phase (Sequential)
- T025 → T026 → T027 → T028

### Testing Phase (Parallel)
- T029, T030, T031 can run in parallel after T028
- T032 after T029-T031

### Final Phase (Mixed)
- T033, T034, T035 sequential after T032
- T036, T037 parallel after T035
- T038 after T036, T037

---

## Parallel Execution Examples

### Foundation Setup (After T005)
```bash
# Can run simultaneously:
Task: "Define TypeScript interfaces in src/types/sneaker.ts"
Task: "Implement sneaker data loader in src/lib/sneakers.ts"
```

### Hooks Development (After T007)
```bash
# Can run simultaneously:
Task: "Implement useSwipe hook in src/hooks/useSwipe.ts"
Task: "Implement useSneakerQueue hook in src/hooks/useSneakerQueue.ts"
```

### Component Building (After T009)
```bash
# Can run simultaneously:
Task: "Implement Header component in src/components/Header.tsx"
Task: "Implement InfoBox component in src/components/InfoBox.tsx"
Task: "Implement ActionButtons component in src/components/ActionButtons.tsx"
Task: "Implement SwipeOverlay component in src/components/SwipeOverlay.tsx"
Task: "Implement CompletionScreen component in src/components/CompletionScreen.tsx"
```

### Polish Phase (After T020)
```bash
# Can run simultaneously:
Task: "Implement mobile-first responsive design"
Task: "Add CSS transitions for smooth animations"
Task: "Implement global styles in src/app/globals.css"
Task: "Add accessibility attributes"
```

### Browser Testing (After T028)
```bash
# Can run simultaneously on different machines:
Task: "Test in Chrome/Edge"
Task: "Test in Safari iOS"
Task: "Test in Firefox"
```

---

## Notes

- **Constitutional Compliance**: No automated tests per constitution. All verification manual via quickstart.md
- **[P] Tasks**: Marked tasks can run in parallel (different files, no shared dependencies)
- **Commit Strategy**: Commit after each completed task or logical group
- **Time Estimates**: 
  - Setup (T001-T005): 1 hour
  - Foundation & Hooks (T006-T009): 1 hour
  - Components (T010-T016): 4 hours
  - Integration (T017-T020): 2 hours
  - Polish (T021-T024): 1 hour
  - Validation (T025-T038): 3 hours
- **Parallel Potential**: With 2 developers, can reduce time by ~40%

---

## Validation Checklist

*GATE: Verify before marking phase complete*

- [x] All contracts have corresponding component implementations
- [x] All entities from data-model.md have TypeScript interfaces (T006)
- [x] All components match contract specifications
- [x] Setup tasks create correct project structure
- [x] Each task specifies exact file path
- [x] No [P] tasks modify same files
- [x] All quickstart.md scenarios have corresponding tasks
- [x] Constitutional principles respected (no tests, static-only, Tailwind CSS)

---

## Ready for Execution

All 38 tasks are ready for implementation. Start with **T001** and proceed sequentially through setup, then leverage parallel execution for components and polish phases.

**Next Command**: Begin implementation of T001

**Success Criteria**: All tasks complete + all quickstart.md scenarios pass + production build succeeds
