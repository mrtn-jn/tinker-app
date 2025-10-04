
# Implementation Plan: Email Collection Login Screen

**Branch**: `005-email-collection-login` | **Date**: 2025-10-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-email-collection-login/spec.md`

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
Email collection screen that appears after splash animation for first-time users. Red background animates upward like a window blind (1.2s) to reveal email form in bottom 2/3 of screen. Email addresses stored in Google Sheets API. Returning users skip email screen entirely and see normal splash → main app flow. Implements localStorage persistence for session state.

## Technical Context
**Language/Version**: TypeScript 5.9.3  
**Primary Dependencies**: Next.js 15.5.4 (App Router, static export), React 19.1.1, Tailwind CSS 4.1.14, Google Sheets API v4  
**Storage**: Google Sheets (email collection), localStorage (session persistence)  
**Testing**: None (per constitution - visual verification only)  
**Target Platform**: Web browsers (Chrome, Safari, Firefox, Edge)  
**Project Type**: Web (single Next.js app with static export)  
**Performance Goals**: Smooth animations (60 FPS), <100ms form validation, <3s Google Sheets API response  
**Constraints**: Static-first (no backend), no authentication system, Google Sheets API quota limits (100 requests/100s per user)  
**Scale/Scope**: Affects splash flow, adds 1 new screen (EmailCollectionScreen), modifies SplashScreen component behavior, localStorage management

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Simplicity First**: Feature adds email collection with minimal implementation. Uses existing SplashScreen component logic, adds one new EmailCollectionScreen component. Animation is CSS-based (no complex libraries). Google Sheets API provides storage without backend infrastructure.

⚠️ **Static-First Architecture**: PARTIAL COMPLIANCE - Google Sheets API calls are client-side at runtime (not static). However, this is justified because:
- No backend server required (maintains static export)
- Email collection inherently requires runtime interaction
- Alternative (mailto links, form services) would be less user-friendly
- Does not violate core principle: app remains static HTML/CSS/JS

✅ **Component Reusability**: Reuses existing SplashScreen, Image, and styling patterns. New EmailCollectionScreen follows same component structure as CompletionScreen. Button styled to match existing CompletionScreen link (consistency).

❌ **No Authentication/Backend**: PASS - Not implementing auth, just email collection

❌ **No Database**: PASS - Using Google Sheets API (external service), not a traditional database

✅ **No Testing Framework**: PASS - Visual verification only per constitution

⚠️ **Complexity Justification Required**: Google Sheets API integration

**Justification for Google Sheets API**:
1. **Why static approach insufficient**: Email collection requires persistent storage accessible to owner. Static JSON files can't be updated from client browser.
2. **Alternatives considered**:
   - localStorage only: Data trapped in user's browser, not accessible to owner
   - mailto links: Poor UX, requires email client, no automatic collection
   - Form services (Formspree): Additional third-party dependency, less control
3. **Migration plan**: Google Sheets provides simple export (CSV/Excel), easy migration to database if needed later
4. **Complexity assessment**: LOW - Single API call on submit, well-documented Google API, no authentication (public sheet with write access)

**Verdict**: APPROVED with justification. Google Sheets API is the minimal viable solution that maintains static-first principles while enabling email collection.

## Project Structure

### Documentation (this feature)
```
specs/005-email-collection-login/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command) - TO BE GENERATED
├── data-model.md        # Phase 1 output (/plan command) - TO BE GENERATED
├── quickstart.md        # Phase 1 output (/plan command) - TO BE GENERATED
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── app/
│   ├── page.tsx                    # Main page - NO CHANGES (already has routing logic)
│   ├── layout.tsx                  # Root layout with SplashScreen - MODIFY (conditional rendering)
│   └── globals.css                 # Global styles - POTENTIAL ADD (animation keyframes)
├── components/
│   ├── SplashScreen.tsx            # MODIFY (add animation states, check localStorage)
│   ├── EmailCollectionScreen.tsx   # CREATE NEW (form, validation, Google Sheets integration)
│   ├── CompletionScreen.tsx        # READ ONLY (reference for button styling)
│   ├── Header.tsx                  # NO CHANGES
│   ├── SneakerCard.tsx             # NO CHANGES
│   ├── ActionButtons.tsx           # NO CHANGES
│   └── SwipeOverlay.tsx            # NO CHANGES
├── hooks/
│   ├── useSneakerQueue.ts          # NO CHANGES
│   ├── useSwipe.ts                 # NO CHANGES
│   └── useEmailSubmission.ts       # CREATE NEW (Google Sheets API logic, localStorage management)
├── lib/
│   ├── sneakers.ts                 # NO CHANGES
│   └── googleSheets.ts             # CREATE NEW (API wrapper, environment config)
├── types/
│   ├── sneaker.ts                  # NO CHANGES
│   └── email.ts                    # CREATE NEW (EmailEntry, SubmissionStatus types)
└── utils/
    └── emailValidation.ts          # CREATE NEW (email format validation, whitespace trimming)

public/
└── info/
    └── [existing assets]           # NO CHANGES

.env.local (CREATE NEW - not committed)
└── NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY
└── NEXT_PUBLIC_GOOGLE_SHEET_ID
```

**Structure Decision**: Single Next.js project with App Router. Using client-side components for email collection screen with Google Sheets API integration. localStorage used for session persistence. No backend or API routes needed (maintaining static export compatibility).

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   ✅ No NEEDS CLARIFICATION markers - all clarifications resolved in spec
   
2. **Generate research for key technical decisions**:
   - Task: "Research Google Sheets API v4 integration for client-side Next.js apps"
   - Task: "Research localStorage best practices for session persistence"
   - Task: "Research CSS animations for blind-lift effect (transform, keyframes)"
   - Task: "Research email validation patterns (RFC 5321 compliant)"
   - Task: "Research environment variable management for API keys in Next.js static export"

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all technical decisions documented

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   ✅ EmailEntry: email (string), timestamp (ISO 8601), submissionCount (number)
   ✅ UserSession: hasSubmittedEmail (boolean), submissionTimestamp (ISO string)
   ✅ SubmissionStatus: loading, success, error states

2. **Generate API contracts** from functional requirements:
   ❌ N/A - No backend API endpoints (using Google Sheets API directly from client)
   ✅ Document Google Sheets API schema (columns: Email, Timestamp, User Agent)

3. **Generate contract tests** from contracts:
   ❌ N/A - Per constitution, no testing framework required
   ✅ Visual validation scenarios in quickstart.md instead

4. **Extract test scenarios** from user stories:
   ✅ quickstart.md with manual validation steps:
     - First-time user flow (animation + form + submit)
     - Returning user flow (skip email screen)
     - Email validation (empty, invalid format, valid)
     - Google Sheets integration (verify data appears)
     - localStorage persistence (check flag after submit)
     - Button styling consistency (match CompletionScreen)

5. **Update agent file incrementally** (O(1) operation):
   ✅ Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`
   - Add: Google Sheets API v4, email validation, localStorage patterns
   - Update: Feature 005 email collection
   - Preserve: Manual additions between markers

**Output**: data-model.md, quickstart.md, .github/copilot-instructions.md

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. **From data-model.md**: Extract entities → type definition tasks
   - Create EmailEntry interface (email, timestamp)
   - Create SubmissionStatus type union
   - Create validation function signatures

2. **From feature spec requirements**: FR-001 to FR-026 → implementation tasks
   - Animation tasks: Blind-lift CSS keyframes, logo scaling, red background rise to 1/3
   - Form tasks: EmailCollectionScreen layout, input field, submit button
   - Validation tasks: Email format checking, error display, Spanish error messages
   - API tasks: Google Sheets client setup, submission hook, error handling
   - Integration tasks: SplashScreen modifications, layout conditional rendering
   - localStorage tasks: Session flag management ("tinker_email_submitted"), returning user detection

3. **From quickstart.md scenarios**: Each manual test scenario → validation task
   - Manual test: First-time user flow (splash → animation → form → submit)
   - Manual test: Returning user flow (splash → skip everything → main app)
   - Manual test: Email validation edge cases (empty, invalid, valid)
   - Manual test: Google Sheets data verification (check spreadsheet)
   - Manual test: Button styling consistency (match CompletionScreen)

**Ordering Strategy**:
1. **Setup first**: Environment variables (.env.local), Google Sheets API key config
2. **Types/models**: email.ts, validation types (no dependencies)
3. **Utilities**: emailValidation.ts (depends on types)
4. **External integrations**: googleSheets.ts (depends on types)
5. **Hooks**: useEmailSubmission.ts (depends on utils + API)
6. **Components**: EmailCollectionScreen.tsx (depends on hooks)
7. **Integration**: Modify SplashScreen.tsx (animation + localStorage), layout.tsx (conditional)
8. **Visual validation**: Run quickstart scenarios (manual testing)

**Parallelization Opportunities**:
- [P] Type definitions: email.ts can be created while setting up .env.local
- [P] Animation CSS: Can develop blind-lift keyframes while building form layout
- [P] Documentation: Can write error message strings while implementing validation logic

**Estimated task count**: 20-25 tasks total
- Setup: 2 tasks (environment variables, Google Sheets setup)
- Types/Utils: 4 tasks (types, validation, error messages)
- API Integration: 3 tasks (googleSheets.ts, hook, error handling)
- Components: 6 tasks (EmailCollectionScreen UI, styling, accessibility)
- Animation: 3 tasks (blind-lift keyframes, logo scaling, state transitions)
- Integration: 2 tasks (SplashScreen modifications, layout conditional)
- Visual Testing: 5-10 tasks (one per quickstart scenario)

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
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command) ✅ 24 tasks created
- [x] Phase 4: Implementation complete ✅ T001-T010 implemented, T024 documentation updated
- [ ] Phase 5: Validation passed (T011-T023 manual testing required)

**Gate Status**:
- [x] Initial Constitution Check: PASS (Google Sheets API justified)
- [x] Post-Design Constitution Check: PASS (no new violations)

**Post-Design Constitutional Review**:
After completing Phase 0 (research) and Phase 1 (design), re-evaluating against constitution:

1. **Simplicity First** ✅
   - Design maintains simplicity: 3 entities, 2 storage systems, 1 API call
   - No additional dependencies beyond Google Sheets API
   - CSS-based animations (no animation libraries)
   - Single form with basic validation (no complex form libraries)

2. **Static-First Architecture** ✅
   - Google Sheets API remains client-side (confirmed in research.md)
   - No backend server introduced
   - localStorage is browser-native (no additional runtime)
   - Environment variables embedded at build time (static export compatible)

3. **Component Reusability** ✅
   - EmailCollectionScreen follows existing component patterns
   - useEmailSubmission hook is reusable (could support newsletter forms later)
   - emailValidation.ts is pure function (reusable anywhere)
   - No component-specific styling (Tailwind utilities only)

4. **No Additional Violations**:
   - ❌ No authentication introduced
   - ❌ No database introduced (Google Sheets is external service, not a database)
   - ❌ No testing framework added (quickstart.md provides manual validation)
   - ❌ No state management library (React useState only)

**Verdict**: ✅ PASS - Design adheres to all constitutional principles

**Artifacts Created**:
- [x] research.md (6 technical decisions documented)
- [x] data-model.md (3 entities: EmailEntry, UserSession, SubmissionStatus)
- [x] quickstart.md (11 manual validation scenarios + edge cases)
- [x] .github/copilot-instructions.md (updated with Feature 005 context)
- [x] tasks.md (24 tasks: 2 setup, 1 types, 1 utils, 2 API, 1 component, 3 integration, 13 validation, 1 docs)

**Next Step**: Begin execution with T001 (create .env.local with Google Sheets API keys)
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
