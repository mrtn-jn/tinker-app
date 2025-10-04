# Tasks: Email Collection Login Screen

**Input**: Design documents from `specs/005-email-collection-login/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

## Execution Flow
```
1. ✅ Loaded plan.md - Tech stack: TypeScript 5.9.3, Next.js 15.5.4, React 19.1.1, Tailwind CSS 4.1.14, Google Sheets API v4
2. ✅ Loaded data-model.md - Entities: EmailEntry, UserSession, SubmissionStatus
3. ✅ Loaded research.md - Decisions: Google Sheets integration, CSS animations, localStorage, email validation
4. ✅ Loaded quickstart.md - 11 manual validation scenarios
5. Generated tasks by category:
   → Setup: Environment variables, Google Sheets setup
   → Types: TypeScript interfaces (EmailEntry, UserSession, SubmissionStatus)
   → Utils: Email validation, error messages
   → API Integration: Google Sheets client, submission hook
   → Components: EmailCollectionScreen UI
   → Integration: SplashScreen modifications, layout conditional rendering
   → Visual Validation: Manual testing per quickstart.md
6. Applied task rules:
   → Different files = marked [P] for parallel
   → Same file = sequential (no [P])
   → No automated tests (per constitution - visual verification only)
7. Tasks numbered T001-T024
8. Validation: All entities have type definitions, all integrations covered, all quickstart scenarios mapped to validation tasks
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Paths are absolute from repository root

---

## Phase 3.1: Setup & Environment

### T001: ✅ Create .env.local with Google Sheets API keys
**File**: `.env.local` (CREATE NEW, root of repository - same level as package.json)
**Description**: Create environment variables file with Google Sheets API credentials
**Content**:
```bash
NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here
```
**Instructions**:
- Create `.env.local` in repository root (git-ignored, already in .gitignore)
- Add two environment variables with NEXT_PUBLIC_ prefix
- These will be embedded at build time for static export (NOT runtime)
- Document setup steps in comments

**IMPORTANT - Static Export Behavior**:
- During `npm run dev`: Next.js reads .env.local automatically
- During `npm run build`: Variables are EMBEDDED into JavaScript (hardcoded in out/ folder)
- The .env.local file is NOT copied to out/ directory
- API keys will be visible in browser JavaScript (acceptable - restrict by domain in Google Cloud Console)

**Security Setup**:
1. Get API key from: https://console.cloud.google.com/apis/credentials
2. In Google Cloud Console:
   - Application restrictions: HTTP referrers (add your domain + localhost:3000)
   - API restrictions: Google Sheets API v4 only
3. Get Sheet ID from: URL of your Google Sheet (between /d/ and /edit)

**Dependencies**: None (first task)

---

### T002: ✅ Create .env.local.example for documentation
**File**: `.env.local.example` (CREATE NEW, root of repository)
**Description**: Create example environment file for team documentation
**Content**:
```bash
# Google Sheets API Configuration
# Get API key from: https://console.cloud.google.com/apis/credentials
# Get Sheet ID from: URL of your Google Sheet
NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here
```
**Instructions**:
- Create `.env.local.example` (will be committed to git)
- Include comments explaining where to get credentials
- This file documents required environment variables for team

**Dependencies**: None (can run in parallel with T001)

---

## Phase 3.2: Type Definitions

### T003 [P]: ✅ Create EmailEntry and UserSession types
**File**: `src/types/email.ts` (CREATE NEW)
**Description**: Define TypeScript interfaces for email data entities
**Content**:
```typescript
// Email submission data (stored in Google Sheets)
export interface EmailEntry {
  email: string;
  timestamp: string; // ISO 8601 format
  userAgent: string;
}

// User session data (stored in localStorage)
export interface UserSession {
  hasSubmittedEmail: boolean;
  submissionTimestamp: string; // ISO 8601 format
}

// Form submission state management
export type SubmissionStatus = 
  | { type: 'idle' }
  | { type: 'validating' }
  | { type: 'submitting' }
  | { type: 'success' }
  | { type: 'error'; message: string };
```
**Instructions**:
- Create new directory `src/types/` if it doesn't exist
- Create `email.ts` with 3 exports: EmailEntry, UserSession, SubmissionStatus
- Use discriminated union for SubmissionStatus (type-safe state management)
- Add JSDoc comments for each interface

**Dependencies**: T001 complete (environment setup)

---

## Phase 3.3: Utilities

### T004 [P]: ✅ Create email validation utility
**File**: `src/utils/emailValidation.ts` (CREATE NEW)
**Description**: Pure function for email format validation with Spanish error messages
**Content**:
```typescript
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export const validateEmail = (email: string): string | null => {
  const trimmed = email.trim();
  
  if (trimmed.length === 0) {
    return 'Por favor, ingresa tu correo electrónico.';
  }
  
  if (trimmed.length > MAX_EMAIL_LENGTH) {
    return 'El correo electrónico es demasiado largo (máximo 254 caracteres).';
  }
  
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Por favor, ingresa un correo electrónico válido.';
  }
  
  return null; // Valid
};
```
**Instructions**:
- Create new directory `src/utils/` if it doesn't exist
- Implement validateEmail function with 3 validation rules: empty, length, format
- Return null for valid emails, error message string for invalid
- Error messages in Spanish per requirements

**Dependencies**: T003 complete (types defined)

---

## Phase 3.4: API Integration

### T005 [P]: ✅ Create Google Sheets API client
**File**: `src/lib/googleSheets.ts` (CREATE NEW)
**Description**: API wrapper for Google Sheets v4 append operation
**Content**:
```typescript
import type { EmailEntry } from '@/types/email';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;

if (!API_KEY || !SHEET_ID) {
  throw new Error('Missing Google Sheets configuration. Check .env.local');
}

export const submitEmailToGoogleSheets = async (email: string): Promise<void> => {
  const entry: EmailEntry = {
    email: email.trim(),
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1:append?valueInputOption=USER_ENTERED&key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        values: [[entry.email, entry.timestamp, entry.userAgent]]
      })
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'Failed to submit email');
  }
};
```
**Instructions**:
- Create new directory `src/lib/` if it doesn't exist
- Import EmailEntry type from src/types/email.ts
- Read environment variables with error handling
- Implement submitEmailToGoogleSheets with fetch API
- Append row with [email, timestamp, userAgent] format
- Throw descriptive error if API call fails

**Dependencies**: T003 complete (EmailEntry type defined)

---

### T006: ✅ Create useEmailSubmission hook
**File**: `src/hooks/useEmailSubmission.ts` (CREATE NEW)
**Description**: Custom React hook for form state and email submission logic
**Content**:
```typescript
'use client';

import { useState } from 'react';
import type { SubmissionStatus, UserSession } from '@/types/email';
import { validateEmail } from '@/utils/emailValidation';
import { submitEmailToGoogleSheets } from '@/lib/googleSheets';

const STORAGE_KEY = 'tinker_email_submitted';

export const useEmailSubmission = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmissionStatus>({ type: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    setStatus({ type: 'validating' });
    const error = validateEmail(email);
    if (error) {
      setStatus({ type: 'error', message: error });
      return;
    }

    // Submit
    setStatus({ type: 'submitting' });
    try {
      await submitEmailToGoogleSheets(email);
      
      // Set localStorage flag
      const session: UserSession = {
        hasSubmittedEmail: true,
        submissionTimestamp: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      
      setStatus({ type: 'success' });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: 'Hubo un problema al enviar tu correo. Por favor, intenta de nuevo.' 
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error on typing
    if (status.type === 'error') {
      setStatus({ type: 'idle' });
    }
  };

  return { email, status, handleSubmit, handleChange };
};

export const checkEmailSubmitted = (): boolean => {
  try {
    const session = localStorage.getItem(STORAGE_KEY);
    if (!session) return false;
    const parsed: UserSession = JSON.parse(session);
    return parsed.hasSubmittedEmail === true;
  } catch {
    return false; // Corrupted data = not submitted
  }
};
```
**Instructions**:
- Create new directory `src/hooks/` if it doesn't exist
- Add 'use client' directive (React 19 client component)
- Import types, validation, and Google Sheets functions
- Implement useEmailSubmission hook with form state management
- Implement checkEmailSubmitted helper for localStorage check
- Handle validation errors, API errors, and success state
- Clear error on user typing (good UX)

**Dependencies**: T004, T005 complete (validation and API client ready)

---

## Phase 3.5: Components

### T007: ✅ Create EmailCollectionScreen component
**File**: `src/components/EmailCollectionScreen.tsx` (CREATE NEW)
**Description**: Email form UI component with validation and submission
**Content Structure**:
```typescript
'use client';

import { useEmailSubmission } from '@/hooks/useEmailSubmission';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EmailCollectionScreen() {
  const { email, status, handleSubmit, handleChange } = useEmailSubmission();
  const router = useRouter();

  // Navigate on success
  useEffect(() => {
    if (status.type === 'success') {
      router.push('/'); // Navigate to main app
    }
  }, [status, router]);

  const isSubmitting = status.type === 'submitting';

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Red background (top 1/3) */}
      <div className="h-1/3 bg-brand-red flex items-center justify-center">
        {/* Logo at 75% size */}
      </div>

      {/* White form area (bottom 2/3) */}
      <div className="h-2/3 bg-white flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Entra al juego
          </h1>

          <input
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="tu@correo.com"
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2"
            autoFocus
          />

          {status.type === 'error' && (
            <p className="text-red-600 text-sm mb-4">{status.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-red text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Enviando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
}
```
**Instructions**:
- Create EmailCollectionScreen component with 'use client' directive
- Use useEmailSubmission hook for form logic
- Layout: Fixed full-screen with top 1/3 red, bottom 2/3 white
- Form: Heading, email input, error message (conditional), submit button
- Button styling: Match CompletionScreen button (check src/components/CompletionScreen.tsx)
- Navigate to main app on success using useRouter
- Disable form during submission

**Dependencies**: T006 complete (useEmailSubmission hook ready)

---

## Phase 3.6: Integration - SplashScreen Modifications

### T008: Add blind-lift animation CSS to globals.css
**File**: `src/app/globals.css` (MODIFY - append to end)
**Description**: Add CSS keyframes for blind-lift and logo-shrink animations
**Content to ADD**:
```css
/* Email Collection: Blind-lift animation */
@keyframes blind-lift {
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
}

@keyframes logo-shrink {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.75);
  }
}

.animate-blind-lift {
  animation: blind-lift 1200ms ease-out forwards;
  transform-origin: bottom;
  will-change: transform;
}

.animate-logo-shrink {
  animation: logo-shrink 1200ms ease-out forwards;
  will-change: transform;
}
```
**Instructions**:
- Open src/app/globals.css
- Scroll to end of file
- Add keyframes and utility classes for animations
- Use transform: scaleY for GPU acceleration
- Duration: 1200ms as specified in requirements
- Easing: ease-out for smooth deceleration

**Dependencies**: None (can run in parallel with component work)

---

### T009: ✅ Modify SplashScreen to detect returning users and trigger animation
**File**: `src/components/SplashScreen.tsx` (MODIFY)
**Description**: Add localStorage check and animation state management
**Modifications**:
1. Import `checkEmailSubmitted` from useEmailSubmission hook
2. Add state for animation phase: 'splash' | 'animating' | 'complete'
3. Check localStorage on mount to determine if user is returning
4. If first-time user: After 2s splash, transition to 'animating' phase
5. If returning user: After 2s splash, transition directly to 'complete'
6. Pass animation state to parent via callback prop

**Instructions**:
- Import checkEmailSubmitted from '@/hooks/useEmailSubmission'
- Add useState for animationPhase
- Add useEffect to check localStorage on mount
- Update splash timer logic to handle animation phase
- Add prop: onAnimationComplete callback
- Call callback with isFirstTimeUser boolean

**Dependencies**: T006 complete (checkEmailSubmitted function available)

---

### T010: ✅ Modify layout.tsx for conditional rendering
**File**: `src/app/layout.tsx` (MODIFY)
**Description**: Conditionally render EmailCollectionScreen based on splash animation state
**Modifications**:
1. Import EmailCollectionScreen component
2. Add state to track splash completion and first-time user status
3. Render order:
   - Always show SplashScreen first
   - If first-time user: Show EmailCollectionScreen after animation
   - If returning user: Show children (main app) directly
4. Pass callback to SplashScreen to handle animation completion

**Instructions**:
- Import EmailCollectionScreen from '@/components/EmailCollectionScreen'
- Add useState: [splashComplete, setSplashComplete]
- Add useState: [isFirstTimeUser, setIsFirstTimeUser]
- Update SplashScreen with onAnimationComplete prop
- Conditional rendering logic:
  ```
  {!splashComplete && <SplashScreen onAnimationComplete={...} />}
  {splashComplete && isFirstTimeUser && <EmailCollectionScreen />}
  {splashComplete && !isFirstTimeUser && children}
  ```

**Dependencies**: T007, T009 complete (EmailCollectionScreen and SplashScreen modifications ready)

---

## Phase 3.7: Visual Validation (Manual Testing per quickstart.md)

**Note**: Per constitution, no automated testing framework. All validation is manual using quickstart.md scenarios.

### T011: Validate Scenario 1 - First-Time User Flow (Happy Path)
**Reference**: `specs/005-email-collection-login/quickstart.md` lines 11-46
**Steps**:
1. Clear localStorage
2. Navigate to http://localhost:3000
3. Verify splash screen (2s, logo visible)
4. Verify blind-lift animation (red rises to 1/3, logo shrinks to 75%, 1.2s, smooth 60 FPS)
5. Verify email form (white 2/3, heading, input, button)
6. Submit valid email: test@example.com
7. Verify submission (loading state, no error, navigate to main app)
8. Verify storage (Google Sheets row added, localStorage flag set)

**Expected**: ✅ All checks pass, email submitted, navigates to main app

**Dependencies**: T010 complete (all implementation done)

---

### T012 [P]: Validate Scenario 2 - Returning User Flow
**Reference**: `specs/005-email-collection-login/quickstart.md` lines 48-65
**Steps**:
1. Ensure localStorage has `tinker_email_submitted` flag
2. Navigate to http://localhost:3000
3. Verify splash screen (2s, normal splash, NO blind-lift)
4. Verify navigation: Skips email screen, goes DIRECTLY to main app
5. Verify localStorage flag unchanged

**Expected**: ✅ Email screen skipped entirely

**Dependencies**: T011 complete (first-time flow validated)

---

### T013 [P]: Validate Scenario 3 - Email Validation (Empty Field)
**Reference**: `specs/005-email-collection-login/quickstart.md` lines 67-81
**Steps**:
1. Clear localStorage
2. Navigate, wait for animation
3. Click submit WITHOUT typing email
4. Verify error: "Por favor, ingresa tu correo electrónico." (red text)
5. Verify button remains enabled
6. Verify no API call made (check Network tab)

**Expected**: ✅ Validation error shown, no API call

**Dependencies**: T011 complete

---

### T014 [P]: Validate Scenario 4 - Email Validation (Invalid Format)
**Reference**: `specs/005-email-collection-login/quickstart.md` lines 83-103
**Steps**:
1. Clear localStorage
2. Navigate, wait for animation
3. Type invalid emails: `notanemail`, `test@`, `@example.com`, `test @example.com`
4. Verify error: "Por favor, ingresa un correo electrónico válido."
5. Verify all invalid formats rejected

**Expected**: ✅ Invalid emails rejected with Spanish error message

**Dependencies**: T011 complete

---

### T015 [P]: Validate Scenario 5 - Clear Error on Typing
**Reference**: `specs/005-email-collection-login/quickstart.md` lines 105-117
**Steps**:
1. Clear localStorage
2. Trigger validation error (submit empty)
3. Start typing in email field
4. Verify error disappears on first keystroke

**Expected**: ✅ Error clears immediately, good UX

**Dependencies**: T011 complete

---

### T016 [P]: Validate Scenario 6 - Duplicate Email Submission
**Reference**: `specs/005-email-collection-login/quickstart.md` lines 119-135
**Steps**:
1. Clear localStorage
2. Submit email: duplicate@example.com
3. Clear localStorage AGAIN (simulate different device)
4. Submit SAME email: duplicate@example.com
5. Verify Google Sheets has TWO rows with same email (different timestamps)

**Expected**: ✅ Duplicates allowed per requirements

**Dependencies**: T011 complete

---

### T017 [P]: Validate Scenario 7 - Button Styling Consistency
**Reference**: `specs/005-email-collection-login/quickstart.md` lines 137-153
**Steps**:
1. Compare EmailCollectionScreen submit button with CompletionScreen button
2. Verify: background color, text color, font size, padding, border radius, hover effects match

**Expected**: ✅ Buttons visually consistent

**Dependencies**: T011 complete

---

### T018 [P]: Validate Scenario 8 - Animation Performance (60 FPS)
**Reference**: `specs/005-email-collection-login/quickstart.md` lines 155-171
**Steps**:
1. Open DevTools > Performance tab
2. Start recording
3. Navigate to app, wait for blind-lift animation
4. Stop recording
5. Analyze: FPS graph shows consistent 60 FPS, animation duration ~1200ms, no dropped frames

**Expected**: ✅ Smooth 60 FPS, no jank

**Dependencies**: T011 complete

---

### T019: Validate Scenario 9 - Google Sheets API Error Handling
**Reference**: `specs/005-email-collection-login/quickstart.md` lines 173-198
**Steps**:
1. Temporarily break API: Change NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY to INVALID_KEY in .env.local
2. Restart dev server
3. Clear localStorage, navigate, submit valid email
4. Verify error: "Hubo un problema al enviar tu correo. Por favor, intenta de nuevo."
5. Verify button re-enabled (user can retry)
6. Fix .env.local, restart, retry submission
7. Verify retry succeeds

**Expected**: ✅ API errors handled gracefully, retry works

**Dependencies**: T011 complete

---

### T020 [P]: Validate Scenario 10 - Responsive Design (Mobile)
**Reference**: `specs/005-email-collection-login/quickstart.md` lines 200-223
**Steps**:
1. Open DevTools > Device Toolbar
2. Select iPhone 12 Pro or similar
3. Clear localStorage, navigate
4. Verify layout: Red 1/3, white 2/3, logo not cut off, input full width, button full width
5. Verify touch target size ≥44x44px
6. Test interaction: Tap input, type, submit

**Expected**: ✅ Fully functional on mobile

**Dependencies**: T011 complete

---

### T021: Validate Scenario 11 - Production Build
**Reference**: `specs/005-email-collection-login/quickstart.md` lines 225-243
**Steps**:
1. Run: `npm run build`
2. Verify: Build succeeds, no TypeScript errors, no warnings
3. Start: `npm start` (or static file server if using static export)
4. Clear localStorage
5. Navigate to production URL
6. Repeat Scenario 1 (first-time user flow)
7. Verify: Works identically in production

**Expected**: ✅ Production build works, identical behavior

**Dependencies**: T011-T020 complete (all dev testing passed)

---

### T022 [P]: Validate Edge Cases
**Reference**: `specs/005-email-collection-login/quickstart.md` lines 245-267
**Edge Cases**:
1. **localStorage disabled** (private browsing): Email screen appears every time (acceptable)
2. **Very long email** (>254 chars): Validation error before API call
3. **Network offline**: Error message appears
4. **Page refresh during submission**: Email screen reappears (localStorage not set yet)

**Expected**: ✅ All edge cases handled gracefully

**Dependencies**: T011 complete

---

### T023: Final validation checklist
**Reference**: `specs/005-email-collection-login/quickstart.md` lines 269-291
**Functional Requirements**:
- [ ] FR-001: Blind-lift animation after splash (1200ms)
- [ ] FR-002: Red background to 1/3 viewport
- [ ] FR-003: Logo shrinks to 75%
- [ ] FR-004: Email form in bottom 2/3 white area
- [ ] FR-005: Email validation (empty, invalid)
- [ ] FR-006: Spanish error messages
- [ ] FR-007: Google Sheets stores email + timestamp + user agent
- [ ] FR-008: localStorage flag after success
- [ ] FR-009: Returning users skip email screen
- [ ] FR-010: Button matches CompletionScreen style
- [ ] FR-011: Duplicate emails allowed

**Performance Requirements**:
- [ ] 60 FPS animations (no dropped frames)
- [ ] Email validation <100ms
- [ ] Google Sheets API <3s (typical)

**Accessibility Requirements**:
- [ ] Input has proper label/aria-label
- [ ] Error messages announced to screen readers
- [ ] Keyboard navigation (Tab, Enter)
- [ ] Touch targets ≥44x44px on mobile

**Browser Compatibility**:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (desktop + mobile)

**Expected**: ✅ All checklist items pass

**Dependencies**: T011-T022 complete (all scenarios validated)

---

### T024: ✅ Update copilot-instructions.md with implementation notes
**File**: `.github/copilot-instructions.md` (MODIFY)
**Description**: Document implemented feature for future reference
**Modifications**:
- Recent Changes section: Add "005-email-collection-login: Implemented email collection with blind-lift animation, Google Sheets integration, localStorage persistence"
- Active Technologies section already updated during /plan phase
- No other changes needed

**Instructions**:
- Open .github/copilot-instructions.md
- Find Recent Changes section
- Update 005-email-collection-login entry from "Added" to "Implemented"

**Dependencies**: T023 complete (all validation passed)

---

## Dependencies Graph

```
Setup Layer (T001-T002):
  T001 .env.local
  T002 .env.local.example [P with T001]
  ↓
Types Layer (T003):
  T003 email.ts types [depends on T001]
  ↓
Utils & API Layer (T004-T005):
  T004 emailValidation.ts [P, depends on T003]
  T005 googleSheets.ts [P, depends on T003]
  ↓
Hook Layer (T006):
  T006 useEmailSubmission.ts [depends on T004, T005]
  ↓
Component Layer (T007-T008):
  T007 EmailCollectionScreen.tsx [depends on T006]
  T008 globals.css animations [P with T007, no dependencies]
  ↓
Integration Layer (T009-T010):
  T009 SplashScreen.tsx modifications [depends on T006]
  T010 layout.tsx modifications [depends on T007, T009]
  ↓
Validation Layer (T011-T023):
  T011 First-time user flow [depends on T010 - ALL implementation done]
  T012-T022 Other scenarios [P, depends on T011]
  T023 Final checklist [depends on T011-T022]
  ↓
Documentation (T024):
  T024 copilot-instructions.md [depends on T023]
```

## Parallel Execution Examples

**Phase 1 - Setup (parallel)**:
```bash
# T001 and T002 can run together (different files)
Task: "Create .env.local with Google Sheets API keys"
Task: "Create .env.local.example for documentation"
```

**Phase 2 - Utils & API (parallel)**:
```bash
# T004 and T005 can run together (different files, both depend on T003)
Task: "Create email validation utility in src/utils/emailValidation.ts"
Task: "Create Google Sheets API client in src/lib/googleSheets.ts"
```

**Phase 3 - Component & CSS (parallel)**:
```bash
# T007 and T008 can run together (different files, independent)
Task: "Create EmailCollectionScreen component in src/components/EmailCollectionScreen.tsx"
Task: "Add blind-lift animation CSS to src/app/globals.css"
```

**Phase 4 - Validation (parallel after T011)**:
```bash
# T012-T022 can run in parallel after T011 validates base implementation
Task: "Validate Scenario 2 - Returning User Flow"
Task: "Validate Scenario 3 - Email Validation (Empty Field)"
Task: "Validate Scenario 4 - Email Validation (Invalid Format)"
# ... etc
```

## Notes
- **No automated tests**: Per constitution, visual verification only via quickstart.md
- **[P] tasks**: Can run simultaneously (different files, no dependencies)
- **Sequential tasks**: Must complete in order (T006 needs T004+T005, T010 needs T007+T009)
- **Validation tasks**: All validation (T011-T023) requires complete implementation (T001-T010)
- **Commit strategy**: Commit after each phase (setup, types, utils, components, integration)
- **Manual testing**: Budget 2-3 hours for thorough validation (11 scenarios + edge cases)

## Task Generation Rules Applied

1. **From data-model.md**:
   - EmailEntry, UserSession, SubmissionStatus → T003 (type definitions)
   
2. **From research.md**:
   - Google Sheets API integration → T005 (API client)
   - CSS animations (blind-lift, logo-shrink) → T008 (globals.css)
   - localStorage best practices → T006 (useEmailSubmission hook)
   - Email validation patterns → T004 (emailValidation.ts)
   
3. **From quickstart.md**:
   - 11 scenarios → T011-T021 (manual validation tasks)
   - Edge cases → T022
   - Final checklist → T023

4. **From plan.md Project Structure**:
   - CREATE NEW files: T003, T004, T005, T006, T007 (5 new files)
   - MODIFY files: T008, T009, T010 (3 modifications)
   - Environment: T001, T002 (setup)
   - Documentation: T024 (post-implementation)

## Validation Checklist
*Checked before tasks.md creation*

- [x] All entities have type definition tasks (EmailEntry, UserSession, SubmissionStatus → T003)
- [x] All new files have creation tasks (T003-T007: 5 new files)
- [x] All file modifications have tasks (T008-T010: 3 modifications)
- [x] All quickstart scenarios mapped to validation tasks (11 scenarios → T011-T021)
- [x] Environment setup complete (T001-T002: .env.local)
- [x] Dependencies correctly ordered (setup → types → utils → components → integration → validation)
- [x] Parallel tasks marked with [P] (different files, no dependencies)
- [x] Sequential tasks have clear dependencies (T006 needs T004+T005)
- [x] No automated test tasks (per constitution - visual validation only)
- [x] All tasks specify exact file paths
- [x] All tasks have clear descriptions and instructions

---

## Ready for Execution

✅ All 24 tasks generated and validated  
✅ Dependencies mapped correctly  
✅ Parallel execution opportunities identified  
✅ Manual validation mapped to quickstart.md  
✅ Constitutional compliance maintained (no testing framework)  

**Next Step**: Begin execution with T001 (create .env.local)
