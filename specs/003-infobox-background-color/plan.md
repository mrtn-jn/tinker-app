
# Implementation Plan: InfoBox Background Color Customization

**Branch**: `003-infobox-background-color` | **Date**: 2025-10-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-infobox-background-color/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Add dynamic background color support to InfoBox component by reading the "InfoBox-bg" field from each sneaker's data in sneakers-data.json. Each sneaker card will display its InfoBox with a unique color (e.g., #788d42 green, #60896c teal, #978738 gold, #98323c burgundy). Falls back to bg-brand-red if InfoBox-bg is missing. Implemented by adding bgColor prop to InfoBox component and passing sneaker.InfoBox-bg from SneakerCard.

## Technical Context
**Language/Version**: TypeScript 5.9.3  
**Primary Dependencies**: Next.js 15.5.4 (App Router, static export), React 19.1.1, Tailwind CSS 4.1.14  
**Storage**: Static JSON file (info/sneakers-data.json)  
**Testing**: None (per constitution - visual verification only)  
**Target Platform**: Web browsers (static HTML/CSS/JS)  
**Project Type**: Web (single Next.js app with static export)  
**Performance Goals**: No performance impact (CSS-only change)  
**Constraints**: Must support Tailwind arbitrary value format (bg-[#hex]), maintain text readability  
**Scale/Scope**: Affects InfoBox component (2 usages: SneakerCard, CompletionScreen), 4 sneakers in data file

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Simplicity First**: Minimal change - adds one optional prop to existing InfoBox component. No new dependencies, pure CSS styling change.

✅ **Static-First Architecture**: Fully compatible with static export. Data comes from static JSON file (info/sneakers-data.json), colors applied via Tailwind classes at render time.

✅ **Component Reusability**: Enhances existing reusable InfoBox component with optional bgColor prop. Uses Tailwind arbitrary values (bg-[#hex]). Maintains backward compatibility (defaults to bg-brand-red).

✅ **No Testing Required**: Per constitution, visual verification in browser is sufficient. No automated tests needed.

✅ **No Excluded Technologies**: Does not require authentication, database, backend APIs, or state management libraries beyond React's props.

**Verdict**: PASS - No constitutional violations. Feature aligns with all principles.

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main sneaker swipe page
│   └── globals.css          # Global styles
├── components/
│   ├── InfoBox.tsx          # MODIFY: Add bgColor prop
│   ├── SneakerCard.tsx      # MODIFY: Pass sneaker['InfoBox-bg']
│   ├── CompletionScreen.tsx # Uses InfoBox (no changes needed)
│   └── [other components]
├── types/
│   └── sneaker.ts           # MODIFY: Add InfoBox-bg to SneakerProfile interface
└── lib/
    └── sneakers.ts          # Loads sneakers-data.json

info/
└── sneakers-data.json       # ALREADY HAS InfoBox-bg field for all 4 sneakers

public/
└── [static assets]
```

**Structure Decision**: Using Option 1 (Single project). InfoBox component will be enhanced with an optional bgColor prop. SneakerCard will read sneaker['InfoBox-bg'] from data and pass it to InfoBox. TypeScript interface SneakerProfile will be updated to include the new field.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   ✅ How to pass custom color to InfoBox? → research.md Question 1
   ✅ How to read InfoBox-bg from JSON? → research.md Question 2
   ✅ Tailwind arbitrary value handling? → research.md Question 3
   ✅ Text readability strategy? → research.md Question 4
   ✅ Where to apply color in SneakerCard? → research.md Question 5
   ✅ CompletionScreen compatibility? → research.md Question 6

2. **Research findings consolidated**:
   - Add optional bgColor prop to InfoBox with 'bg-brand-red' default
   - Update SneakerProfile TypeScript interface with 'InfoBox-bg'?: string
   - Pass sneaker['InfoBox-bg'] from SneakerCard to InfoBox (bracket notation required)
   - Tailwind 4.x supports arbitrary values natively (bg-[#hex])
   - Fixed text colors maintained (white/black as clarified)
   - CompletionScreen backward compatible (no changes needed)

3. **Technology decisions finalized**:
   - No new dependencies
   - Uses existing: React 19 props, TypeScript 5.9, Tailwind 4.1 arbitrary values
   - Pure component prop passing pattern
   - Static data from info/sneakers-data.json (already has all 4 colors)

**Output**: ✅ research.md complete - all technical unknowns resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   ✅ Enhanced SneakerProfile with 'InfoBox-bg'?: string field
   ✅ Updated InfoBoxProps with bgColor?: string prop
   ✅ Documented data flow from JSON → SneakerCard → InfoBox
   ✅ No new entities (enhancement to existing)

2. **Generate API contracts** from functional requirements:
   ❌ N/A - This is a UI-only styling feature with no API endpoints
   ✅ Component interface documented (InfoBoxProps)

3. **Generate contract tests** from contracts:
   ❌ N/A - Per constitution, no testing framework required
   ✅ Visual validation scenarios in quickstart.md instead

4. **Extract test scenarios** from user stories:
   ✅ quickstart.md created with 11 validation scenarios
   ✅ Covers all 4 sneakers with custom colors
   ✅ Tests text readability, overlay persistence, fallback behavior
   ✅ Includes backward compatibility check (CompletionScreen)

5. **Update agent file incrementally** (O(1) operation):
   ⏳ Will execute: `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`

**Output**: ✅ data-model.md, ✅ quickstart.md, ⏳ .github/copilot-instructions.md (next)

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate implementation tasks from Phase 1 design docs
- Simple 3-file modification: types, InfoBox component, SneakerCard
- Order: Types first, then component, then integration

**Expected Task Breakdown** (estimated 6-8 tasks):

1. **Update TypeScript Interface** [P]
   - Modify src/types/sneaker.ts
   - Add 'InfoBox-bg'?: string to SneakerProfile
   - Compile check

2. **Update InfoBox Component** [P]
   - Modify src/components/InfoBox.tsx
   - Add bgColor prop with default 'bg-brand-red'
   - Update className string to use bgColor

3. **Update SneakerCard Integration**
   - Modify src/components/SneakerCard.tsx  
   - Pass sneaker['InfoBox-bg'] to InfoBox bgColor prop
   - Use bracket notation for hyphenated property

4. **Visual Validation - All 4 Colors**
   - Start dev server, view each sneaker
   - Verify matcha green, teal, gold, burgundy
   - Check quickstart Scenarios 1-4

5. **Visual Validation - Text & Overlays**
   - Test text readability on all backgrounds
   - Test swipe overlays (color persistence)
   - Check quickstart Scenarios 5-6

6. **Visual Validation - Backward Compatibility**
   - Test CompletionScreen (default red)
   - Test fallback behavior (manually add sneaker without InfoBox-bg)
   - Check quickstart Scenarios 7-8

7. **Visual Validation - Responsive**
   - Test mobile, tablet, desktop viewports
   - Check quickstart Scenario 10

8. **Build Validation**
   - Run npm run build
   - Serve static export
   - Verify production build works

**Ordering Strategy**:
- Types first (enables TypeScript checking)
- Component updates in parallel [P] (independent files)
- Integration after types/component complete
- Validation tasks sequential (depend on implementation)

**Parallelization**:
- Tasks 1 and 2 marked [P] can run simultaneously (different files)
- Task 3 depends on 1 and 2
- Validation tasks 4-8 sequential after Task 3

**Estimated Output**: 8 numbered tasks in tasks.md with clear acceptance criteria

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
