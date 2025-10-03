# Data Model: InfoBox Background Color Customization

**Date**: 2025-10-03  
**Feature**: Dynamic background colors for InfoBox component

## Overview

This feature enhances the existing **SneakerProfile** entity with a new optional property for custom InfoBox background colors. No new entities or persistent storage - all data comes from the existing static JSON file.

## Enhanced Entity

### SneakerProfile (Updated)

**Purpose**: Represent a sneaker's profile information including visual customization

**Current TypeScript Interface**:
```typescript
export interface SneakerProfile {
  name: string;
  description: string;
  purchase_type: string;
  availability_type: string;
  images: string[];
}
```

**Enhanced Interface**:
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

**New Field Details**:
- **Property Name**: `'InfoBox-bg'` (requires bracket notation due to hyphen)
- **Type**: `string | undefined` (optional field)
- **Format**: Tailwind CSS class string with arbitrary value (e.g., `"bg-[#788d42]"`)
- **Purpose**: Define custom background color for InfoBox component on this sneaker's card
- **Default Behavior**: If missing or undefined, InfoBox uses `bg-brand-red` (existing brand color)

**Validation Rules**:
- Must be a valid Tailwind CSS class string (no runtime validation - TypeScript only)
- Should follow format: `bg-[#RRGGBB]` where RRGGBB is hex color
- Optional field - absence is valid and triggers fallback behavior

**Example Values from Data**:
```json
{
  "name": "Nike SB Dunk Low x Yuto Matcha",
  "InfoBox-bg": "bg-[#788d42]"  // Matcha green
}
```

---

## Component Props Interface

### InfoBoxProps (Updated)

**Purpose**: Define props for InfoBox component

**Current Interface**:
```typescript
export interface InfoBoxProps {
  children: ReactNode;
  className?: string;
}
```

**Enhanced Interface**:
```typescript
export interface InfoBoxProps {
  children: ReactNode;
  className?: string;
  bgColor?: string;  // NEW: Optional background color class
}
```

**New Prop Details**:
- **Prop Name**: `bgColor`
- **Type**: `string | undefined` (optional)
- **Default Value**: `'bg-brand-red'` (defined in component implementation)
- **Purpose**: Override default InfoBox background color
- **Source**: Passed from parent component (SneakerCard) reading from sneaker data

---

## Data Flow

```
sneakers-data.json
  ↓ (loaded by getSneakers())
src/lib/sneakers.ts
  ↓ (returns SneakerProfile[])
src/app/page.tsx (Home component)
  ↓ (passed to useSneakerQueue)
src/hooks/useSneakerQueue.ts
  ↓ (returns currentSneaker)
src/app/page.tsx
  ↓ (passed as prop)
src/components/SneakerCard.tsx
  ↓ (reads sneaker['InfoBox-bg'])
src/components/InfoBox.tsx (bgColor prop)
  ↓ (applied to className)
Rendered <div> with custom background color
```

**Key Decision Points**:
1. **Loading**: Data loaded once at app initialization (no runtime fetching)
2. **Access**: SneakerCard uses bracket notation: `sneaker['InfoBox-bg']`
3. **Passing**: Value passed directly as prop: `<InfoBox bgColor={sneaker['InfoBox-bg']}>`
4. **Rendering**: InfoBox merges bgColor into className string
5. **Fallback**: If undefined, default `'bg-brand-red'` is used

---

## Data Validation

**TypeScript Compile-Time Validation**:
- ✅ Property existence checked by interface
- ✅ Type safety (string | undefined)
- ✅ Bracket notation required for hyphenated property

**Runtime Validation**: 
- ❌ None - trust static JSON data
- Rationale: Static data file controlled by developers, no user input

**Error Handling**:
- Missing property → Uses default `bg-brand-red` (graceful degradation)
- Invalid Tailwind class → Tailwind ignores invalid classes, falls back to default
- No crashes or broken UI in any scenario

---

## Existing Data

**Current State** (info/sneakers-data.json):
All 4 sneakers already have InfoBox-bg field defined:

| Sneaker | InfoBox-bg Value | Color |
|---------|------------------|-------|
| Nike SB Dunk Low x Yuto Matcha | `"bg-[#788d42]"` | Matcha green |
| Nike SB Dunk Low Pro Tourmaline | `"bg-[#60896c]"` | Teal green |
| Nike SB Dunk High & Blazer Antihero | `"bg-[#978738]"` | Gold |
| Nike SB Dunk Low Pro x Riot Skateshop | `"bg-[#98323c]"` | Burgundy |

**Data Migration**: None needed - data is already complete ✅

---

## Component Usage Patterns

### Pattern 1: SneakerCard (with custom color)
```tsx
<InfoBox bgColor={sneaker['InfoBox-bg']}>
  {/* Sneaker info content */}
</InfoBox>
```
**Result**: Uses custom color from data, or falls back to bg-brand-red if undefined

### Pattern 2: CompletionScreen (default color)
```tsx
<InfoBox className="text-center p-3">
  <p>¡Genial!</p>
</InfoBox>
```
**Result**: Uses default bg-brand-red (no changes needed to existing code)

---

## No Persistent State

**State Management**: None required
- Data is static (loaded once from JSON)
- No user modifications
- No localStorage/sessionStorage
- No state changes at runtime

**Rationale**: InfoBox colors are presentation-only and determined entirely by static data. No need for state management complexity.

---

## Type Safety Guarantees

**TypeScript Enforces**:
1. ✅ `SneakerProfile` objects must have correct shape
2. ✅ `InfoBox-bg` property is optional (no errors if missing)
3. ✅ Bracket notation required for access: `sneaker['InfoBox-bg']`
4. ✅ `bgColor` prop is optional in InfoBox component
5. ✅ Compile-time error if trying to access non-existent properties

**Example TypeScript Error Prevention**:
```typescript
// ❌ This would error (dot notation doesn't work with hyphens):
const color = sneaker.InfoBox-bg;  

// ✅ This is correct (bracket notation):
const color = sneaker['InfoBox-bg'];
```

---

## Summary

**Entities Modified**: 1 (SneakerProfile interface)  
**Component Props Modified**: 1 (InfoBoxProps interface)  
**New Fields**: 2 total (`'InfoBox-bg'` in SneakerProfile, `bgColor` in InfoBoxProps)  
**Data Migration**: None (data already exists)  
**State Management**: None (pure props-based)  
**Persistence**: None (static JSON file)  
**Complexity**: Minimal - single optional field with default fallback

This model aligns with constitution's Simplicity First principle - minimal changes to existing types, no complex state management, straightforward prop passing pattern.

**Ready for quickstart.md generation**
