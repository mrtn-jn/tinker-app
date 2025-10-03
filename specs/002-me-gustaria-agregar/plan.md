
# Implementation Plan: Splash Screen

**Branch**: `002-me-gustaria-agregar` | **Date**: 2025-10-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-me-gustaria-agregar/spec.md`

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
Full-screen splash screen component with red (#ff0000) background displaying centered Tinker logo (info/tinker_splash.png) with pulsing animation. Displays for minimum 2 seconds plus load time on every page load, then fades out smoothly to reveal main app. Implemented as a React component with CSS animations, integrated into Next.js App Router layout for universal display across all pages.

## Technical Context
**Language/Version**: TypeScript 5.9.3  
**Primary Dependencies**: Next.js 15.5.4 (App Router, static export), React 19.1.1, Tailwind CSS 4.1.14  
**Storage**: N/A (client-side only, no persistence)  
**Testing**: None (per constitution - visual verification only)  
**Target Platform**: Web browsers (static HTML/CSS/JS)  
**Project Type**: Web (single Next.js app with static export)  
**Performance Goals**: <100ms fade transition, smooth 60fps pulsing animation  
**Constraints**: Must not block app initialization, must gracefully handle missing logo, 2-second minimum display  
**Scale/Scope**: Single component, affects all page loads, minimal bundle size impact

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Simplicity First**: Splash screen is minimal client-side component using standard React hooks (useState, useEffect) with CSS animations. No external dependencies beyond existing stack.

✅ **Static-First Architecture**: Component runs entirely in browser, no server-side logic. Compatible with Next.js static export (output: 'export'). Uses static image asset from /info directory.

✅ **Component Reusability**: SplashScreen is self-contained, reusable component using Tailwind utility classes for styling. Follows established pattern from existing components (Header, SneakerCard).

✅ **No Testing Required**: Per constitution, visual verification in browser is sufficient. No automated tests needed.

✅ **No Excluded Technologies**: Does not require authentication, database, backend APIs, or state management libraries beyond React's built-in hooks.

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
│   ├── layout.tsx           # Will import and render SplashScreen
│   ├── page.tsx             # Main sneaker swipe page
│   └── globals.css          # Global styles + new splash animations
├── components/
│   ├── SplashScreen.tsx     # NEW: Full-screen splash with logo + animation
│   ├── Header.tsx           # Existing header
│   ├── SneakerCard.tsx      # Existing card
│   └── [other components]
└── hooks/
    └── [existing hooks]

info/
└── tinker_splash.png        # Existing logo asset

public/
└── [static assets]
```

**Structure Decision**: Using Option 1 (Single project). Splash screen is a new React component in `/src/components/` that will be rendered from the root layout (`/src/app/layout.tsx`) to ensure it appears before all page content on every navigation/refresh.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - ✅ Timing mechanism (2s + load wait) → research.md Question 1
   - ✅ Fade transition implementation → research.md Question 2
   - ✅ Pulsing animation approach → research.md Question 3
   - ✅ Integration point in Next.js → research.md Question 4
   - ✅ Every page load behavior → research.md Question 5
   - ✅ Error handling strategy → research.md Question 6

2. **Research findings consolidated**:
   - React hooks (useState, useEffect) for dual-timer logic
   - CSS opacity transition with Tailwind utilities
   - CSS keyframes for pulsing animation (scale transform)
   - Root layout integration for universal display
   - No persistence = natural reset behavior
   - Next.js Image onError for graceful degradation

3. **Technology decisions finalized**:
   - No new dependencies needed
   - Uses existing stack: React 19, Tailwind 4, Next.js 15
   - Pure client-side implementation
   - Static export compatible

**Output**: ✅ research.md complete - all technical unknowns resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - ✅ No persistent data entities (ephemeral state only)
   - ✅ Component state documented: 4 boolean flags (minTimeElapsed, appReady, isVisible, logoError)
   - ✅ State transitions mapped
   - ✅ No server-side data (100% client-side)

2. **Generate API contracts** from functional requirements:
   - ❌ N/A - This is a UI-only feature with no API endpoints
   - ❌ No REST/GraphQL contracts needed
   - ✅ Component interface documented (SplashScreenProps = empty)

3. **Generate contract tests** from contracts:
   - ❌ N/A - Per constitution, no testing framework required
   - ✅ Visual validation scenarios in quickstart.md instead

4. **Extract test scenarios** from user stories:
   - ✅ quickstart.md created with 8 validation scenarios
   - ✅ Each scenario maps to functional requirements
   - ✅ Manual validation checklist provided

5. **Update agent file incrementally** (O(1) operation):
   - ⏳ Will execute: `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`

**Output**: ✅ data-model.md, ✅ quickstart.md, ⏳ .github/copilot-instructions.md (next)

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate implementation tasks from Phase 1 design docs
- Order tasks following TDD principles where applicable (though no automated tests per constitution)
- Group related work (CSS animations, component creation, integration)

**Expected Task Breakdown** (estimated 8-10 tasks):

1. **CSS Animation Setup** [P]
   - Add pulse-logo keyframes to globals.css
   - Define animation timing and transform values
   - Test animation in isolation

2. **Create SplashScreen Component** [P]
   - Create src/components/SplashScreen.tsx
   - Define component state (4 boolean flags)
   - Implement dual-timer logic (useState + useEffect)
   - Add fade out trigger when both conditions met

3. **Implement Logo Display**
   - Use Next.js Image component with tinker_splash.png
   - Apply pulsing animation class
   - Add onError handler for missing logo graceful degradation
   - Center logo with Tailwind flex utilities

4. **Implement Red Background**
   - Full-screen fixed positioning (fixed inset-0)
   - Red background color (#ff0000)
   - High z-index (z-50) to appear above all content

5. **Implement Fade Out Transition**
   - Add conditional opacity classes (opacity-100 vs opacity-0)
   - Add Tailwind transition utilities (transition-opacity duration-500)
   - Add pointer-events-none when hidden

6. **Integrate with Root Layout**
   - Modify src/app/layout.tsx to import SplashScreen
   - Render SplashScreen before {children}
   - Ensure 'use client' directive for client component

7. **Visual Validation - Desktop**
   - Open dev server, verify splash appears
   - Check 2-second minimum timing with stopwatch
   - Verify pulsing animation smooth
   - Verify fade out transition smooth
   - Check all Scenario 1, 2, 4, 6 from quickstart.md

8. **Visual Validation - Responsive**
   - Test mobile viewport (390x844)
   - Test tablet viewport (820x1180)
   - Test desktop viewport (1920x1080)
   - Verify logo centering and scaling
   - Check Scenario 5 from quickstart.md

9. **Visual Validation - Edge Cases**
   - Test page refresh (3 times) - Scenario 3
   - Test with slow 3G throttling - Scenario 7
   - Test with missing logo (temporarily rename file) - Scenario 6
   - Verify z-index stacking - Scenario 8

10. **Build Validation**
    - Run `npm run build`
    - Serve static export locally
    - Verify splash works identically in production build
    - Check browser console for errors

**Ordering Strategy**:
- Setup tasks first (CSS animations) - can work in parallel [P]
- Component creation second (depends on CSS being defined)
- Integration third (depends on component being complete)
- Validation last (depends on integration complete)

**Parallelization**:
- Tasks marked [P] are independent and can be worked simultaneously
- CSS and component structure work can happen in parallel
- Validation tasks must be sequential after implementation complete

**Estimated Output**: 10 numbered tasks in tasks.md with clear acceptance criteria

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

**No Violations**: This feature has zero constitutional violations. All complexity tracking fields are N/A.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

**Justification**: Feature uses only existing stack (React, Next.js, Tailwind), no new dependencies, pure client-side logic, compatible with static export, no authentication/database/backend complexity. Follows Simplicity First principle perfectly.


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (N/A - zero violations)

**Artifacts Generated**:
- [x] specs/002-me-gustaria-agregar/plan.md (this file)
- [x] specs/002-me-gustaria-agregar/research.md
- [x] specs/002-me-gustaria-agregar/data-model.md
- [x] specs/002-me-gustaria-agregar/quickstart.md
- [x] .github/copilot-instructions.md (updated with new feature context)
- [x] specs/002-me-gustaria-agregar/tasks.md (10 tasks: 1 setup, 3 implementation, 6 validation)

**Ready for**: Implementation (execute tasks T001-T010)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
