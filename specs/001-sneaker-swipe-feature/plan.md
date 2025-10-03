
# Implementation Plan: Sneaker Swipe Matching Interface

**Branch**: `001-sneaker-swipe-feature` | **Date**: 2025-10-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specific## Phase 2: Task Planning Approach ✅ PLANNED

**Execution**: This phase will be executed by the `/tasks` command (NOT during /plan)

**Task Generation Strategy**:

1. **Load Foundation**:
   - Base template from `.specify/templates/tasks-template.md`
   - Contract specifications from `contracts/` directory
   - Data model from `data-model.md`
   - Quickstart scenarios from `quickstart.md`

2. **Task Categories** (per constitutional compliance):

   **Setup Tasks** (T001-T005):
   - Initialize Next.js project with TypeScript
   - Configure Tailwind CSS with custom colors
   - Set up project structure (`src/app`, `src/components`, `src/hooks`, `src/types`, `src/lib`)
   - Configure `next.config.js` for static export
   - Create placeholder assets (placeholder-sneaker.png)

   **Data & Types Tasks** (T006-T010) [P]:
   - Define TypeScript interfaces (SneakerProfile, SessionState, SwipeAction)
   - Implement sneaker data loader (`lib/sneakers.ts`)
   - Create validation function for JSON data
   - Verify all 4 sneakers load correctly

   **Core Component Tasks** (T011-T020) [P]:
   - Implement Header component (logo, fixed positioning)
   - Implement InfoBox component (reusable bordered box)
   - Implement ActionButtons component (circular LIKE/DISLIKE)
   - Implement SwipeOverlay component (with fade in/out animation)
   - Implement CompletionScreen component (promo code + link)

   **Custom Hooks Tasks** (T021-T025) [P]:
   - Implement useSwipe hook (pointer events, threshold detection)
   - Implement useSneakerQueue hook (session state management)
   - Add throttling to pointerMove events (60fps)

   **Main Feature Tasks** (T026-T030):
   - Implement SneakerCard component (integrate useSwipe)
   - Implement main page.tsx (orchestrate all components)
   - Wire up LIKE/DISLIKE actions to overlay + state updates
   - Add image error handling with placeholder fallback
   - Implement completion screen transition

   **Styling & Polish Tasks** (T031-T035):
   - Extract logo red color to Tailwind config
   - Implement responsive breakpoints (mobile-first)
   - Add CSS transitions for card drag effect
   - Verify 60fps animations in Chrome DevTools
   - Test cross-browser compatibility (Chrome, Safari, Firefox)

   **Build & Deployment Tasks** (T036-T040):
   - Verify `npm run build` succeeds
   - Test static export in `out/` directory
   - Deploy to test environment (e.g., Vercel preview)
   - Run all quickstart scenarios manually
   - Document any deployment-specific configuration

3. **Ordering Strategy**:
   - **Sequential**: Setup → Data/Types → Hooks → Components → Integration → Polish → Build
   - **Parallel** ([P]): Independent components can be built simultaneously
   - **Dependencies**: Hooks before components, types before hooks
   - **No TDD**: Per constitution, no test-writing tasks (manual verification only)

4. **Estimated Task Count**: 35-40 tasks total
   - Setup: 5 tasks
   - Data & Types: 5 tasks [P]
   - Components: 10 tasks [P within category]
   - Hooks: 5 tasks [P]
   - Integration: 5 tasks (sequential)
   - Polish: 5 tasks
   - Build & Deploy: 5 tasks

5. **Task Format** (per tasks-template.md):
   ```
   - [ ] T001 [Description with exact file path]
   - [ ] T002 [P] [Description - parallel execution allowed]
   ```

6. **Success Criteria**:
   - All tasks completable without constitutional violations
   - Each task maps to a specific file or configuration change
   - Manual verification scenarios from quickstart.md cover all tasks
   - Final build produces deployable static site

**IMPORTANT**: Execute `/tasks` command to generate the full tasks.md file

---s\marti\hard_code\sneaker-heart\sneaker-heart-simple\specs\001-sneaker-swipe-feature\spec.md`

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
Tinder-style swipeable interface for sneaker discovery. Users swipe through 4 sneaker profiles, expressing preferences (like/dislike) with gesture or button interactions. Visual feedback overlays confirm actions. After reviewing all profiles, users receive a promotional code for Drifters.com.ar. Fully static Next.js application with Tailwind CSS, no backend, database, or authentication required.

## Technical Context
**Language/Version**: TypeScript 5.x (or JavaScript ES2022+)  
**Primary Dependencies**: Next.js 14+ (App Router, static export), Tailwind CSS 3.x, React 18+  
**Storage**: Static JSON file (`/info/sneakers-data.json`) - no database  
**Testing**: N/A per constitution (no testing frameworks)  
**Target Platform**: Web browsers (mobile-first responsive, desktop compatible)  
**Project Type**: Single static web application  
**Performance Goals**: Fast load times (<2s FCP), smooth 60fps animations, static generation  
**Constraints**: Static-only (no SSR/API routes), must work offline after initial load, <5MB total bundle  
**Scale/Scope**: 4 sneaker profiles (fixed dataset), single-page application, no user accounts

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Version**: 1.0.0 (Ratified 2025-10-01)

### Principle I: Simplicity First ✅ PASS
- Feature solves clear user need: sneaker discovery with engagement gamification
- No premature optimization: Fixed 4-profile dataset, minimal state management
- Static generation: All pages pre-rendered at build time
- **Justification**: Single-purpose feature with minimal complexity

### Principle II: Static-First Architecture ✅ PASS
- All content statically generated via Next.js static export
- No server-side rendering required
- No API routes or backend services
- Data sourced from static JSON file
- **Justification**: Perfect alignment - swipe interactions handled client-side only

### Principle III: Component Reusability ✅ PASS
- Tailwind CSS for all styling (utility-first)
- Reusable components: Header, SneakerCard, ActionButtons, Overlay, CompletionScreen
- No inline styles or CSS modules
- **Justification**: Component-based architecture with Tailwind utilities

### Technology Stack Compliance ✅ PASS
- ✅ Next.js App Router with static export
- ✅ Tailwind CSS for styling
- ✅ TypeScript/JavaScript
- ❌ No authentication/login (excluded per constitution)
- ❌ No database (excluded per constitution)
- ❌ No backend APIs (excluded per constitution)
- ❌ No testing frameworks (excluded per constitution)
- ✅ Static JSON data source (optional enhancement, allowed)
- ✅ Client-side interactivity with React hooks (allowed)

### Quality Gates Compliance ✅ PASS
- Code must compile without errors → Standard TypeScript/Next.js build
- Pages must render correctly → Manual visual verification required
- Responsive design required → Tailwind responsive utilities
- No broken links → Static paths only (no dynamic routing)

**Overall Assessment**: ✅ FULL COMPLIANCE - No constitutional violations detected

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
│   ├── layout.tsx           # Root layout with logo header
│   ├── page.tsx             # Main swipe interface page
│   └── globals.css          # Tailwind directives + global styles
├── components/
│   ├── Header.tsx           # Fixed header with Sneaker Heart logo
│   ├── SneakerCard.tsx      # Swipeable sneaker profile card
│   ├── InfoBox.tsx          # Reusable info box (purchase/availability/description)
│   ├── ActionButtons.tsx    # Circular LIKE/DISLIKE buttons
│   ├── SwipeOverlay.tsx     # Feedback overlay (green/red with icon)
│   └── CompletionScreen.tsx # Final promotional screen with code
├── hooks/
│   ├── useSwipe.ts          # Custom hook for swipe gesture detection
│   └── useSneakerQueue.ts   # Hook to manage sneaker queue state
├── types/
│   └── sneaker.ts           # TypeScript interfaces for Sneaker data
└── lib/
    └── sneakers.ts          # Load and parse sneakers-data.json

public/
├── sneakers-heart-logo.png
├── placeholder-sneaker.png  # Fallback for failed image loads
└── info/
    ├── sneakers-data.json
    └── sneakers-images/
        ├── nike-sb-dunk-low-x-yuto-matcha.png
        ├── nike-sb-dunk-low-pro-tourmaline.png
        ├── nike-sb-dunk-hight-blaze-antihero.png
        └── nike-sb-dunk-low-riot-skateshop.png

tailwind.config.ts           # Tailwind configuration (logo red color)
next.config.js               # Next.js config with output: 'export'
tsconfig.json                # TypeScript configuration
package.json                 # Dependencies: next, react, tailwindcss
```

**Structure Decision**: Single static web application using Next.js App Router with `/src` directory structure (as defined in constitution). All components are client-side React components with no server components needed. Static export configured for deployment to any static host.

## Phase 0: Outline & Research ✅ COMPLETE

**Output**: `research.md` - 7 research areas documented with decisions and rationales

**Key Decisions Made**:
1. **Next.js Static Export**: App Router with `output: 'export'` configuration
2. **Swipe Detection**: Custom hook using PointerEvents API (no external library)
3. **Animations**: CSS transitions + React state (60fps target, no animation library)
4. **Tailwind Colors**: Extract logo red to theme configuration
5. **Data Loading**: ES module JSON import (build-time bundling)
6. **Image Errors**: React onError handler with placeholder swap
7. **Responsive**: Mobile-first with Tailwind breakpoints

**All NEEDS CLARIFICATION Resolved**: Yes (via spec.md clarification session)

---

## Phase 1: Design & Contracts ✅ COMPLETE

**Outputs Generated**:
- ✅ `data-model.md` - 2 entities (SneakerProfile, SessionState) fully documented
- ✅ `contracts/SneakerCard.contract.md` - Component interface with props, events, performance
- ✅ `contracts/useSwipe.contract.md` - Custom hook contract with algorithm details
- ✅ `contracts/SwipeOverlay.contract.md` - Overlay component with animation timing
- ✅ `quickstart.md` - 12 verification scenarios, performance checks, deployment simulation
- ✅ `.github/copilot-instructions.md` - Agent context file updated

**Design Summary**:
- 7 React components planned (Header, SneakerCard, InfoBox, ActionButtons, SwipeOverlay, CompletionScreen, page.tsx)
- 2 custom hooks (useSwipe, useSneakerQueue)
- TypeScript interfaces for type safety
- Static JSON data source (no database)
- Client-side state management only (no global store)

**Re-Evaluated Constitution Check**: ✅ PASS - All design decisions align with static-first, simplicity principles

---

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

**No Complexity Violations Detected**: This feature fully aligns with all constitutional principles. No complexity tracking required.

---

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) - 2025-10-01
- [x] Phase 1: Design complete (/plan command) - 2025-10-01
- [x] Phase 2: Task planning complete (/plan command - describe approach only) - 2025-10-01
- [x] Phase 3: Tasks generated (/tasks command) - 2025-10-01
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS (2025-10-01)
- [x] Post-Design Constitution Check: PASS (2025-10-01)
- [x] All NEEDS CLARIFICATION resolved (5 clarifications in spec.md)
- [x] Complexity deviations documented (N/A - no deviations)

**Artifacts Generated**:
- [x] research.md (7 technical decisions documented)
- [x] data-model.md (2 entities: SneakerProfile, SessionState)
- [x] contracts/SneakerCard.contract.md
- [x] contracts/useSwipe.contract.md
- [x] contracts/SwipeOverlay.contract.md
- [x] quickstart.md (12 scenarios, 30min verification time)
- [x] .github/copilot-instructions.md (agent context updated)
- [x] tasks.md (38 implementation tasks generated)

---

**Next Steps**: Begin Phase 4 implementation by executing tasks.md (start with T001)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
