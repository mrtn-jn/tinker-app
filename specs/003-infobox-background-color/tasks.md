# Tasks: InfoBox Background Color Customization

**Input**: Design documents from `/specs/003-infobox-background-color/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

## Execution Flow
```
1. Load plan.md from feature directory ✅
   → Tech stack: TypeScript 5.9.3, Next.js 15.5.4, React 19.1.1, Tailwind CSS 4.1.14
   → Structure: Single Next.js project with App Router
2. Load design documents ✅
   → data-model.md: SneakerProfile interface enhancement
   → research.md: 6 technical decisions documented
   → quickstart.md: 11 validation scenarios
3. Generate tasks by category:
   → Core: Type updates, component modifications
   → Validation: Manual visual verification per quickstart.md
4. Apply task rules:
   → T001-T002 marked [P] (different files, no dependencies)
   → T003 sequential (depends on T001-T002)
   → T004-T010 validation tasks (sequential, depend on T003)
5. Validate task completeness:
   → All entities updated? ✅ SneakerProfile interface
   → All components updated? ✅ InfoBox, SneakerCard
   → All scenarios covered? ✅ 11 validation scenarios from quickstart.md
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- Single project structure: `src/` at repository root
- Components: `src/components/`
- Types: `src/types/`
- Data: `public/info/sneakers-data.json` (already has InfoBox-bg values)

---

## Phase 3.3: Core Implementation

### T001 [P] Update TypeScript interface for SneakerProfile ✅
**File**: `src/types/sneaker.ts`
**Status**: COMPLETED

**Task**: Add optional `InfoBox-bg` field to SneakerProfile interface

**Requirements** (from data-model.md):
- Add `'InfoBox-bg'?: string;` to SneakerProfile interface
- Use bracket notation due to hyphen in property name
- Field is optional (?) to allow graceful fallback
- Type is string to hold Tailwind class (e.g., "bg-[#788d42]")

**Implementation**:
```typescript
export interface SneakerProfile {
  name: string;
  description: string;
  purchase_type: string;
  availability_type: string;
  images: string[];
  'InfoBox-bg'?: string;  // NEW: Optional background color class
}
```

**Acceptance Criteria**:
- TypeScript compiles without errors
- Interface allows 'InfoBox-bg' property with string value or undefined
- Bracket notation preserved in interface definition

**Related**: FR-002, FR-006 from spec.md

---

### T002 [P] Add bgColor prop to InfoBox component ✅
**File**: `src/components/InfoBox.tsx`
**Status**: COMPLETED

**Task**: Enhance InfoBox component with optional bgColor prop

**Requirements** (from research.md Question 1):
- Add `bgColor?: string` to InfoBoxProps interface
- Default value: `'bg-brand-red'` (maintains backward compatibility)
- Apply bgColor to container's className
- Preserve existing children and className props

**Implementation**:
```typescript
export interface InfoBoxProps {
  children: ReactNode;
  className?: string;
  bgColor?: string;  // NEW: Optional background color class
}

export function InfoBox({ 
  children, 
  className = '', 
  bgColor = 'bg-brand-red'  // DEFAULT fallback
}: InfoBoxProps) {
  return (
    <div className={`${bgColor} ${className} ...existing classes...`}>
      {children}
    </div>
  );
}
```

**Acceptance Criteria**:
- TypeScript compiles without errors
- InfoBox accepts optional bgColor prop
- Default value 'bg-brand-red' used when bgColor not provided
- Existing usage (CompletionScreen) continues to work without changes
- bgColor applied to container's className string

**Related**: FR-001, FR-003, FR-006 from spec.md

---

### T003 Pass sneaker['InfoBox-bg'] from SneakerCard to InfoBox ✅
**File**: `src/components/SneakerCard.tsx`
**Dependencies**: T001, T002 (requires interface updates)
**Status**: COMPLETED

**Task**: Read InfoBox-bg from sneaker data and pass to InfoBox component

**Requirements** (from research.md Question 5):
- Use bracket notation: `sneaker['InfoBox-bg']` (due to hyphen)
- Pass value to InfoBox bgColor prop
- No transformation needed (pass string directly)
- Value flows from sneakers-data.json → sneaker prop → InfoBox

**Implementation**:
```tsx
// In SneakerCard component where InfoBox is rendered
<InfoBox bgColor={sneaker['InfoBox-bg']}>
  {/* existing InfoBox content */}
</InfoBox>
```

**Acceptance Criteria**:
- TypeScript compiles without errors
- Bracket notation used correctly for property access
- InfoBox receives color value from sneaker data
- Works for all 4 sneakers with different colors
- Falls back to bg-brand-red if sneaker['InfoBox-bg'] is undefined

**Related**: FR-004, FR-005 from spec.md

---

## Phase 3.5: Manual Validation (from quickstart.md)

### T004 Visual validation: All 4 sneakers display custom colors
**Dependencies**: T003 (requires full implementation)

**Task**: Verify each sneaker card shows its unique InfoBox background color

**Steps**:
1. Start dev server: `npm run dev`
2. Navigate to http://localhost:3000
3. View sneaker 1 (Nike SB Dunk Low x Yuto Matcha)
   - Expected: InfoBox background is matcha green (#788d42)
4. Swipe to sneaker 2 (Nike SB Dunk Low Pro Tourmaline)
   - Expected: InfoBox background is teal-green (#60896c)
5. Swipe to sneaker 3 (Nike SB Dunk High & Blazer Antihero)
   - Expected: InfoBox background is gold (#978738)
6. Swipe to sneaker 4 (Nike SB Dunk Low Pro x Riot Skateshop)
   - Expected: InfoBox background is burgundy (#98323c)

**Acceptance Criteria**:
- ✅ Each sneaker displays its unique color from sneakers-data.json
- ✅ Colors are visually distinct from each other
- ✅ Entire InfoBox container has custom color (not just sections)
- ✅ Border remains black, only background changes

**Related**: Quickstart Scenarios 1-4, FR-001, FR-002, FR-004

---

### T005 Visual validation: Text readability on all backgrounds
**Dependencies**: T004

**Task**: Verify text remains readable on all custom InfoBox backgrounds

**Steps**:
1. For each of the 4 sneakers, inspect InfoBox text
2. Check "Tipo de compra" label and value
3. Check "Disponibilidad" label and value
4. Compare against specification (white values, black labels)

**Acceptance Criteria**:
- ✅ Value text is white and readable on all 4 backgrounds
- ✅ Label text is black and readable on all 4 backgrounds
- ✅ Sufficient contrast maintained (no readability issues)
- ✅ No text color changes needed (fixed colors work)

**Related**: Quickstart Scenario 5, FR-007 from spec.md

---

### T006 Visual validation: Background persists during swipe overlays
**Dependencies**: T004

**Task**: Verify custom InfoBox color remains visible during card interactions

**Steps**:
1. Swipe card left (dislike gesture)
   - Observe InfoBox background during animation
2. Swipe card right (like gesture)
   - Observe InfoBox background during animation
3. Click dislike button
   - Observe InfoBox background with red overlay
4. Click like button
   - Observe InfoBox background with green overlay

**Acceptance Criteria**:
- ✅ InfoBox custom color visible during swipe animations
- ✅ InfoBox custom color visible under red overlay (dislike)
- ✅ InfoBox custom color visible under green overlay (like)
- ✅ No flickering or color loss during transitions

**Related**: Quickstart Scenario 6, FR-008 from spec.md

---

### T007 Visual validation: CompletionScreen backward compatibility
**Dependencies**: T004

**Task**: Verify CompletionScreen InfoBox still uses default bg-brand-red

**Steps**:
1. Swipe through all 4 sneakers (or click buttons to complete queue)
2. Reach CompletionScreen
3. Observe InfoBox background color

**Acceptance Criteria**:
- ✅ CompletionScreen InfoBox displays bg-brand-red (default)
- ✅ No errors or console warnings
- ✅ InfoBox styling unchanged from before feature implementation
- ✅ Text remains readable on red background

**Related**: Quickstart Scenario 7, FR-006 from spec.md

---

### T008 Visual validation: Fallback behavior for missing InfoBox-bg
**Dependencies**: T004

**Task**: Test graceful degradation when InfoBox-bg is missing

**Steps**:
1. Temporarily edit `public/info/sneakers-data.json`
2. Remove "InfoBox-bg" field from one sneaker
3. Reload page and navigate to that sneaker
4. Observe InfoBox background color

**Expected Results**:
- InfoBox displays bg-brand-red (fallback color)
- No errors in browser console
- Page continues to function normally

**Acceptance Criteria**:
- ✅ Missing InfoBox-bg triggers fallback to bg-brand-red
- ✅ No TypeScript errors (optional field handled correctly)
- ✅ No runtime errors or crashes
- ✅ Card displays normally with default color

**Cleanup**: Restore original sneakers-data.json after test

**Related**: Quickstart Scenario 8, FR-006 from spec.md

---

### T009 Visual validation: Responsive behavior across viewports
**Dependencies**: T004

**Task**: Verify InfoBox colors work correctly on different screen sizes

**Steps**:
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test mobile viewport (375x667 - iPhone SE)
   - View all 4 sneakers, verify colors
4. Test tablet viewport (768x1024 - iPad)
   - View all 4 sneakers, verify colors
5. Test desktop viewport (1920x1080)
   - View all 4 sneakers, verify colors

**Acceptance Criteria**:
- ✅ InfoBox colors display correctly on mobile (375px width)
- ✅ InfoBox colors display correctly on tablet (768px width)
- ✅ InfoBox colors display correctly on desktop (1920px width)
- ✅ No layout breaking or color rendering issues
- ✅ Text readability maintained across all viewports

**Related**: Quickstart Scenario 10

---

### T010 Build validation: Static export production build
**Dependencies**: T004

**Task**: Verify feature works in production static export build

**Steps**:
1. Run production build: `npm run build`
2. Verify build completes successfully
3. Check `/out` directory generated
4. Serve static files locally:
   ```bash
   npx serve out
   ```
5. Navigate to served URL (typically http://localhost:3000)
6. View all 4 sneakers and verify colors

**Acceptance Criteria**:
- ✅ `npm run build` completes without errors
- ✅ TypeScript compilation successful
- ✅ Tailwind CSS arbitrary values (bg-[#hex]) processed correctly
- ✅ Static HTML/CSS/JS generated in `/out` directory
- ✅ All 4 InfoBox colors display correctly in production build
- ✅ No runtime errors in production environment

**Related**: Quickstart Final Validation, project constitution (static-first)

---

## Dependencies

```
T001 [P] Update SneakerProfile interface
  ↓
T002 [P] Add bgColor prop to InfoBox  → T003 Pass sneaker['InfoBox-bg'] to InfoBox
  ↓
T004 Validate all 4 colors
  ↓
T005 Validate text readability
  ↓
T006 Validate overlay persistence
  ↓
T007 Validate CompletionScreen
  ↓
T008 Validate fallback behavior
  ↓
T009 Validate responsive design
  ↓
T010 Validate production build
```

**Parallel Execution**:
- T001 and T002 can run simultaneously (different files)
- T003-T010 must be sequential (T003 depends on T001+T002, validation tasks depend on T003)

---

## Parallel Example

```bash
# Launch T001 and T002 together (different files, independent):
Task: "Update TypeScript interface in src/types/sneaker.ts - add 'InfoBox-bg'?: string to SneakerProfile"
Task: "Add bgColor prop to InfoBox component in src/components/InfoBox.tsx with default 'bg-brand-red'"

# After T001+T002 complete, execute T003:
Task: "Pass sneaker['InfoBox-bg'] to InfoBox bgColor prop in src/components/SneakerCard.tsx"

# After T003 complete, run validation tasks sequentially:
Task: "Visual validation: Verify all 4 sneakers display custom colors per quickstart Scenarios 1-4"
Task: "Visual validation: Verify text readability on all backgrounds per quickstart Scenario 5"
# ... continue with T006-T010
```

---

## Notes

- **No testing framework**: Per constitution, manual visual validation only (T004-T010)
- **Data already exists**: All 4 sneakers in sneakers-data.json have InfoBox-bg values (no migration needed)
- **Backward compatible**: Optional prop with default ensures CompletionScreen works without changes
- **TypeScript safety**: Bracket notation required for hyphenated property access
- **Tailwind 4.x**: Arbitrary values (bg-[#hex]) work natively, no safelist needed
- **Static-first**: No dynamic color computation, pure CSS classes from data

---

## Validation Checklist

*GATE: Verified before task execution*

- [x] All entities have model tasks → SneakerProfile updated in T001
- [x] All components have modification tasks → InfoBox (T002), SneakerCard (T003)
- [x] Parallel tasks truly independent → T001, T002 modify different files
- [x] Each task specifies exact file path → All tasks include full paths
- [x] No task modifies same file as another [P] task → T001 (sneaker.ts) ≠ T002 (InfoBox.tsx)
- [x] All quickstart scenarios covered → T004-T010 map to Scenarios 1-10 + final validation
- [x] Constitution compliance maintained → Static-only, no testing framework, backward compatible
