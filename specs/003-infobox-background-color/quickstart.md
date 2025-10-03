# Quickstart: InfoBox Background Color Validation

**Date**: 2025-10-03  
**Feature**: Dynamic InfoBox background colors from sneakers-data.json  
**Purpose**: Manual validation steps to verify InfoBox displays correct custom colors for each sneaker

---

## Prerequisites

**Environment**:
- Node.js installed
- Repository cloned and on branch `003-infobox-background-color`
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

### ✅ Scenario 1: Nike SB Dunk Low x Yuto Matcha (FR-001, FR-002, FR-004)

**Test**: View first sneaker card with matcha green InfoBox

**Steps**:
1. Open browser and navigate to http://localhost:3000
2. Observe the InfoBox section on the first sneaker card
3. Compare background color to specification

**Expected Results**:
- ✓ InfoBox background is matcha green (#788d42)
- ✓ "Tipo de compra" section has green background
- ✓ "Disponibilidad" section has green background
- ✓ Border remains black
- ✓ Text remains readable (white for values, black for labels)
- ✓ Color matches data: `"bg-[#788d42]"`

**Validation**:
- [ ] Background color is correct matcha green
- [ ] Entire InfoBox container has the custom color
- [ ] Text is readable against green background
- [ ] No visual artifacts or rendering issues

---

### ✅ Scenario 2: Nike SB Dunk Low Pro Tourmaline (FR-001, FR-002, FR-004)

**Test**: Swipe to second sneaker with teal-green InfoBox

**Steps**:
1. From first card, swipe left or click dislike button
2. Observe the InfoBox on the second sneaker card
3. Compare background color to specification

**Expected Results**:
- ✓ InfoBox background is teal-green (#60896c)
- ✓ Different color from first card
- ✓ Entire container has custom color
- ✓ Text remains readable
- ✓ Color matches data: `"bg-[#60896c]"`

**Validation**:
- [ ] Background color is correct teal-green
- [ ] Color is visually distinct from matcha green
- [ ] Text readability maintained
- [ ] Consistent styling across both sections

---

### ✅ Scenario 3: Nike SB Dunk High & Blazer Antihero (FR-001, FR-002, FR-004)

**Test**: Swipe to third sneaker with gold InfoBox

**Steps**:
1. Swipe left or click dislike from second card
2. Observe the InfoBox on the third sneaker card
3. Compare background color to specification

**Expected Results**:
- ✓ InfoBox background is gold (#978738)
- ✓ Different color from previous cards
- ✓ Entire container has custom color
- ✓ Text remains readable
- ✓ Color matches data: `"bg-[#978738]"`

**Validation**:
- [ ] Background color is correct gold
- [ ] Color is visually distinct from green/teal
- [ ] Text readability maintained
- [ ] No color bleeding or overflow

---

### ✅ Scenario 4: Nike SB Dunk Low Pro x Riot Skateshop (FR-001, FR-002, FR-004)

**Test**: Swipe to fourth sneaker with burgundy InfoBox

**Steps**:
1. Swipe left or click dislike from third card
2. Observe the InfoBox on the fourth sneaker card
3. Compare background color to specification

**Expected Results**:
- ✓ InfoBox background is burgundy (#98323c)
- ✓ Different color from all previous cards
- ✓ Entire container has custom color
- ✓ Text remains readable
- ✓ Color matches data: `"bg-[#98323c]"`

**Validation**:
- [ ] Background color is correct burgundy
- [ ] Color is visually distinct from all others
- [ ] Text readability maintained
- [ ] Consistent behavior across all cards

---

### ✅ Scenario 5: Text Readability (FR-007)

**Test**: Verify text remains readable on all background colors

**Steps**:
1. View all 4 sneaker cards (swipe through or refresh and re-swipe)
2. For each card, read the InfoBox text:
   - Label text (e.g., "Tipo de compra")
   - Value text (e.g., "Raffle", "Venta Directa")
3. Assess readability on each background color

**Expected Results**:
- ✓ White text values visible on green background
- ✓ White text values visible on teal background
- ✓ White text values visible on gold background
- ✓ White text values visible on burgundy background
- ✓ Black label text remains readable on all backgrounds
- ✓ No changes to text colors (fixed as per clarification)

**Validation**:
- [ ] Text readable on matcha green (#788d42)
- [ ] Text readable on teal-green (#60896c)
- [ ] Text readable on gold (#978738)
- [ ] Text readable on burgundy (#98323c)
- [ ] No auto-adjustment of text color (stays fixed)

---

### ✅ Scenario 6: Swipe Overlay Persistence (FR-008)

**Test**: Verify background color remains visible during swipe animations

**Steps**:
1. Start swiping a card slowly to the left (don't release)
2. Observe InfoBox background color as green overlay appears
3. Release swipe or cancel
4. Repeat with slow swipe to the right (red overlay)

**Expected Results**:
- ✓ Custom InfoBox background color visible under green overlay
- ✓ Custom InfoBox background color visible under red overlay
- ✓ Color doesn't disappear or get replaced during swipe
- ✓ Smooth visual transition (no flickering)

**Validation**:
- [ ] InfoBox color visible during left swipe (dislike)
- [ ] InfoBox color visible during right swipe (like)
- [ ] Color persists throughout entire animation
- [ ] No visual glitches or color flashing

---

### ✅ Scenario 7: Completion Screen Default Color (Backward Compatibility)

**Test**: Verify CompletionScreen InfoBox uses default bg-brand-red

**Steps**:
1. Swipe through all 4 sneakers (like or dislike each)
2. Reach the completion screen "¡Genial! Terminaste de ver todas las zapatillas."
3. Observe the InfoBox background color

**Expected Results**:
- ✓ InfoBox background is brand red (default color)
- ✓ NOT one of the custom colors (green/teal/gold/burgundy)
- ✓ Proves backward compatibility (no bgColor prop passed)
- ✓ CompletionScreen code unchanged

**Validation**:
- [ ] Completion screen shows default red background
- [ ] Color is consistent with original design
- [ ] No breaking changes to existing components

---

### ✅ Scenario 8: Missing InfoBox-bg Fallback (FR-006)

**Test**: Verify fallback behavior if InfoBox-bg is missing

**Note**: This test requires temporarily modifying data or adding a 5th sneaker without InfoBox-bg

**Steps (Manual Test)**:
1. Stop dev server
2. Open `info/sneakers-data.json`
3. Add a test sneaker WITHOUT InfoBox-bg field:
   ```json
   {
     "name": "Test Sneaker",
     "description": "No color defined",
     "purchase_type": "Test",
     "availability_type": "Test",
     "images": ["/info/sneakers-images/nike-sb-dunk-low-x-yuto-matcha.png"]
   }
   ```
4. Save file and restart dev server
5. Swipe to the test sneaker
6. Observe InfoBox background color
7. Remove test sneaker and restart

**Expected Results**:
- ✓ InfoBox background is bg-brand-red (default fallback)
- ✓ No JavaScript errors in console
- ✓ Card renders normally
- ✓ Proves graceful degradation

**Validation**:
- [ ] Default red background applied
- [ ] No console errors
- [ ] Fallback behavior works correctly
- [ ] UI doesn't break

---

### ✅ Scenario 9: TypeScript Type Safety

**Test**: Verify TypeScript compilation catches errors

**Steps**:
1. Open `src/components/SneakerCard.tsx`
2. Try to access property with dot notation: `sneaker.InfoBox-bg`
3. Observe TypeScript error
4. Correct to bracket notation: `sneaker['InfoBox-bg']`
5. Verify error disappears

**Expected Results**:
- ✓ Dot notation causes TypeScript error
- ✓ Bracket notation compiles successfully
- ✓ Type safety enforced at compile time
- ✓ Prevents runtime bugs

**Validation**:
- [ ] TypeScript catches incorrect property access
- [ ] Bracket notation required and enforced
- [ ] Code compiles without errors with correct syntax

---

### ✅ Scenario 10: Responsive Behavior

**Test**: Verify colors work on different screen sizes

**Steps**:
1. Open browser DevTools (F12)
2. Toggle device toolbar (responsive mode)
3. Test these viewports:
   - Mobile: iPhone 12 Pro (390x844)
   - Tablet: iPad Air (820x1180)
   - Desktop: 1920x1080
4. For each viewport, swipe through all 4 cards
5. Verify InfoBox colors display correctly

**Expected Results**:
- ✓ All custom colors visible on mobile
- ✓ All custom colors visible on tablet
- ✓ All custom colors visible on desktop
- ✓ No color rendering issues at any size
- ✓ Text remains readable at all sizes

**Validation**:
- [ ] Mobile: All 4 custom colors correct
- [ ] Tablet: All 4 custom colors correct
- [ ] Desktop: All 4 custom colors correct
- [ ] Responsive behavior consistent

---

## Production Build Validation

### Final Validation: Static Export Build

**Test**: Verify feature works in production static export

**Steps**:
1. Stop dev server
2. Run `npm run build`
3. Verify build succeeds
4. Serve static export: `npx serve out` (or similar)
5. Open production URL
6. Repeat Scenarios 1-4 (verify all 4 custom colors)
7. Check browser console for errors

**Expected Results**:
- ✓ Build completes successfully
- ✓ All 4 InfoBox colors work in production
- ✓ No console errors
- ✓ Static export fully functional
- ✓ Colors applied at render time (no runtime fetching)

**Validation**:
- [ ] Build succeeds
- [ ] Production colors match dev colors
- [ ] No runtime errors
- [ ] Static export works correctly

---

## Summary Checklist

**Core Functionality** (Must Pass):
- [ ] Scenario 1: Matcha green InfoBox (#788d42)
- [ ] Scenario 2: Teal-green InfoBox (#60896c)
- [ ] Scenario 3: Gold InfoBox (#978738)
- [ ] Scenario 4: Burgundy InfoBox (#98323c)
- [ ] Scenario 5: Text readable on all backgrounds
- [ ] Scenario 6: Colors persist during swipe overlays

**Backward Compatibility** (Must Pass):
- [ ] Scenario 7: CompletionScreen uses default red
- [ ] Scenario 8: Missing InfoBox-bg falls back to red

**Quality & Type Safety** (Should Pass):
- [ ] Scenario 9: TypeScript enforces bracket notation
- [ ] Scenario 10: Responsive across all viewports

**Production Readiness** (Must Pass):
- [ ] Final Validation: Static export build works

**Total Scenarios**: 11  
**Estimated Validation Time**: ~25 minutes  
**Critical Scenarios**: 1-8 (must all pass before merge)

---

## Troubleshooting

**Issue**: InfoBox color doesn't change
- Check: TypeScript compilation succeeded
- Check: Bracket notation used: `sneaker['InfoBox-bg']`
- Check: Prop passed to InfoBox: `bgColor={...}`

**Issue**: Text not readable
- Expected: Per clarification, text colors are fixed
- Action: Visually verify contrast is acceptable
- If problem: Report back to user for color adjustment

**Issue**: Build fails
- Check: TypeScript errors resolved
- Check: All imports correct
- Check: Tailwind arbitrary values formatted correctly

---

**Validation By**: [Name]  
**Date**: [Date]  
**Result**: [PASS / FAIL / PENDING]
