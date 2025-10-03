# Research: InfoBox Background Color Customization

**Date**: 2025-10-03  
**Feature**: Dynamic background colors for InfoBox component from sneakers-data.json

## Research Questions

### 1. How to pass custom background color to InfoBox component?

**Decision**: Add optional `bgColor` prop to InfoBox component with default value

**Rationale**:
- InfoBox is already a reusable component with props (children, className)
- Adding optional prop maintains backward compatibility
- Allows explicit control from parent component (SneakerCard)
- Default value ensures existing usage (CompletionScreen) continues to work

**Alternatives Considered**:
- Context API: Overkill for single prop, adds unnecessary complexity
- CSS custom properties: Requires more setup, less explicit
- Separate component: Violates DRY, creates maintenance burden

**Implementation Approach**:
```typescript
export interface InfoBoxProps {
  children: ReactNode;
  className?: string;
  bgColor?: string; // NEW: Optional background color class
}

export function InfoBox({ 
  children, 
  className = '', 
  bgColor = 'bg-brand-red' // DEFAULT fallback
}: InfoBoxProps) {
  return (
    <div className={`${bgColor} ${className}`}>
      {children}
    </div>
  );
}
```

---

### 2. How to read InfoBox-bg field from sneakers-data.json?

**Decision**: Add `InfoBox-bg` field to TypeScript `SneakerProfile` interface

**Rationale**:
- Data already exists in JSON file for all 4 sneakers
- TypeScript interface ensures type safety
- Optional field (with `?`) allows graceful handling of missing values
- Aligns with existing pattern (name, description, purchase_type, etc.)

**Alternatives Considered**:
- Hardcode color mapping: Not scalable, defeats purpose of data-driven approach
- Dynamic import: Unnecessary complexity for static JSON
- Compute color from sneaker name: Brittle, not explicit

**Implementation Approach**:
```typescript
export interface SneakerProfile {
  name: string;
  description: string;
  purchase_type: string;
  availability_type: string;
  images: string[];
  'InfoBox-bg'?: string; // NEW: Optional background color
}
```

**Note**: Use bracket notation `'InfoBox-bg'` because of hyphen in property name.

---

### 3. How to handle Tailwind arbitrary value format (bg-[#hex])?

**Decision**: Pass the full Tailwind class string directly, no parsing needed

**Rationale**:
- Tailwind 4.x supports arbitrary values natively (bg-[#788d42])
- No transformation required - pass string as-is from JSON to className
- Tailwind's JIT compiler handles hex colors at build time
- Safelist not needed for arbitrary values in Tailwind 4.x

**Alternatives Considered**:
- Parse hex and apply inline style: Loses Tailwind benefits, adds complexity
- Convert to Tailwind theme colors: Limited palette, not flexible
- CSS custom properties: More complex setup, less direct

**Implementation Note**: Tailwind 4.x arbitrary values work out of the box:
```typescript
<div className="bg-[#788d42]"> // Works automatically
```

---

### 4. How to ensure text readability with variable background colors?

**Decision**: Maintain fixed text colors (white for values, black for labels) as clarified

**Rationale**:
- User confirmed to keep current text colors in clarification session
- All provided colors (#788d42, #60896c, #978738, #98323c) are dark/muted
- White text has sufficient contrast against all provided backgrounds
- Consistent with existing design (text-white class already used)

**Alternatives Considered**:
- Auto-adjust text color based on background luminance: Added complexity, not requested
- Always use white with text-shadow: Current approach already works
- Define text colors in JSON: Scope creep, unnecessary

**Implementation Note**: No changes needed to text styling - current approach works.

---

### 5. Where to apply the background color in SneakerCard?

**Decision**: Pass `sneaker['InfoBox-bg']` directly to InfoBox component prop

**Rationale**:
- SneakerCard already receives full sneaker object with all properties
- Direct prop passing is clearest and most maintainable approach
- InfoBox handles default fallback internally
- Single source of truth (sneakers-data.json)

**Alternatives Considered**:
- Apply color via className concatenation in SneakerCard: Less explicit
- Use CSS variables: Overcomplicated for simple prop passing
- Store in component state: Unnecessary, data is already available

**Implementation Approach**:
```tsx
// In SneakerCard.tsx
<InfoBox bgColor={sneaker['InfoBox-bg']}>
  {/* InfoBox content */}
</InfoBox>
```

**Note**: Use bracket notation for property access due to hyphen.

---

### 6. How to handle CompletionScreen InfoBox usage?

**Decision**: No changes needed - InfoBox prop is optional with default value

**Rationale**:
- CompletionScreen uses InfoBox without sneaker-specific data
- Optional bgColor prop defaults to 'bg-brand-red'
- Backward compatibility maintained
- Follows principle of least surprise

**Implementation Note**: Existing code continues to work:
```tsx
// CompletionScreen.tsx - NO CHANGES NEEDED
<InfoBox className="text-center p-3">
  <p>¡Genial!</p>
</InfoBox>
// Will use default bg-brand-red
```

---

## Technology Stack Decisions

**Selected Stack**:
- React 19.1.1: Props system for component communication
- TypeScript 5.9.3: Interface updates for type safety
- Tailwind CSS 4.1.14: Arbitrary value support for dynamic colors (bg-[#hex])
- Next.js 15.5.4: Static data loading from JSON file

**No New Dependencies**: Feature uses only existing stack, no packages needed

**Static Export Compatibility**: Fully compatible - colors resolved at build/render time, no runtime data fetching

---

## Data Structure Analysis

**Current sneakers-data.json structure** (4 sneakers):
```json
[
  {
    "name": "Nike SB Dunk Low x Yuto Matcha",
    "InfoBox-bg": "bg-[#788d42]", // Matcha green ✅ EXISTS
    ...
  },
  {
    "name": "Nike SB Dunk Low Pro Tourmaline",
    "InfoBox-bg": "bg-[#60896c]", // Teal green ✅ EXISTS
    ...
  },
  {
    "name": "Nike SB Dunk High & Blazer Antihero",
    "InfoBox-bg": "bg-[#978738]", // Gold ✅ EXISTS
    ...
  },
  {
    "name": "Nike SB Dunk Low Pro x Riot Skateshop",
    "InfoBox-bg": "bg-[#98323c]", // Burgundy ✅ EXISTS
    ...
  }
]
```

**Finding**: All 4 sneakers already have InfoBox-bg field defined. No data migration needed.

---

## Integration Points

**Files to Modify**:
1. `src/types/sneaker.ts` - Add `'InfoBox-bg'?: string` to SneakerProfile interface
2. `src/components/InfoBox.tsx` - Add optional bgColor prop with default
3. `src/components/SneakerCard.tsx` - Pass `sneaker['InfoBox-bg']` to InfoBox

**Files NOT Modified**:
- `src/components/CompletionScreen.tsx` - Uses default color automatically
- `info/sneakers-data.json` - Data already complete
- `src/app/globals.css` - No CSS changes needed

**No Breaking Changes**: All changes are additive with defaults, maintaining backward compatibility

---

## Risk Assessment

**Low Risk**:
- ✅ Uses existing dependencies
- ✅ Optional prop with default value
- ✅ TypeScript catches property access errors
- ✅ Data already exists in JSON
- ✅ Isolated component change

**Medium Risk**:
- ⚠️ Text readability on some backgrounds (mitigated: user reviewed and approved colors)
- ⚠️ Bracket notation `sneaker['InfoBox-bg']` may be unfamiliar (mitigated: TypeScript enforces it)

**Mitigation Strategies**:
- Visual validation of all 4 sneakers after implementation
- TypeScript optional chaining if needed: `sneaker?.['InfoBox-bg']`
- Fallback to bg-brand-red ensures no broken UI

---

## Summary

All technical unknowns resolved. Implementation path is clear:
1. Update TypeScript interface to include InfoBox-bg field
2. Add optional bgColor prop to InfoBox component with default
3. Pass sneaker['InfoBox-bg'] from SneakerCard to InfoBox
4. Visual verification of all 4 sneakers

**Ready for Phase 1: Design & Contracts**
