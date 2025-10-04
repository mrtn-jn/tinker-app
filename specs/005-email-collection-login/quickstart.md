# Quickstart: Email Collection Login Screen - Manual Validation

## Prerequisites
- [ ] Feature implemented on branch `005-email-collection-login`
- [ ] Google Sheets API key configured in `.env.local`
- [ ] Spreadsheet ID configured in `.env.local`
- [ ] Development server running: `npm run dev`
- [ ] Browser DevTools open (Console + Application tabs)

---

## Scenario 1: First-Time User Flow (Happy Path)

**Test**: Complete first-time user experience with valid email

**Steps**:
1. Clear localStorage: DevTools > Application > localStorage > Clear All
2. Navigate to `http://localhost:3000`
3. **Observe splash screen**:
   - [ ] TinkerHatters logo visible (centered, full size)
   - [ ] Splash displays for ~2 seconds
4. **Observe blind-lift animation**:
   - [ ] Red background rises from bottom to 1/3 of screen (~33vh)
   - [ ] Animation duration: ~1.2 seconds (use DevTools Performance panel)
   - [ ] Logo shrinks to 75% size simultaneously
   - [ ] Animation is smooth (60 FPS, no jank)
5. **Observe email form**:
   - [ ] White background occupies bottom 2/3 of screen
   - [ ] Heading visible: "Entra al juego" or similar
   - [ ] Email input field visible (empty, focused)
   - [ ] Submit button visible (styled like CompletionScreen button)
6. Type valid email: `test@example.com`
7. Click submit button
8. **Observe submission**:
   - [ ] Button shows loading state (disabled, spinner or text change)
   - [ ] No error message displayed
   - [ ] After ~1-2 seconds, navigates to main app (sneaker swipe screen)
9. **Verify storage**:
   - [ ] Open Google Sheets spreadsheet
   - [ ] New row added: `test@example.com | <timestamp> | <user agent>`
   - [ ] DevTools > Application > localStorage
   - [ ] Key: `tinker_email_submitted` with value: `{"hasSubmittedEmail":true,"submissionTimestamp":"..."}`

**Expected Result**: ✅ Email submitted, localStorage flag set, navigated to main app

---

## Scenario 2: Returning User Flow (Skip Email Screen)

**Test**: User who already submitted email skips email collection screen

**Prerequisites**:
- [ ] localStorage has `tinker_email_submitted` flag from Scenario 1

**Steps**:
1. Navigate to `http://localhost:3000` (or refresh page)
2. **Observe splash screen**:
   - [ ] TinkerHatters logo visible
   - [ ] Splash displays for ~2 seconds (normal splash, NO blind-lift animation)
3. **Observe navigation**:
   - [ ] After splash, navigates DIRECTLY to main app (sneaker swipe screen)
   - [ ] Email collection screen NEVER appears
4. **Verify localStorage**:
   - [ ] DevTools > Application > localStorage
   - [ ] Key: `tinker_email_submitted` still present (unchanged)

**Expected Result**: ✅ Email screen skipped, directly to main app

---

## Scenario 3: Email Validation - Empty Field

**Test**: Validation error when submitting empty email

**Steps**:
1. Clear localStorage: DevTools > Application > localStorage > Clear All
2. Navigate to `http://localhost:3000`
3. Wait for splash + animation to complete
4. **Do NOT type anything** in email field
5. Click submit button
6. **Observe validation error**:
   - [ ] Error message displayed below input field: "Por favor, ingresa tu correo electrónico."
   - [ ] Error text is red (Tailwind `text-red-600` or similar)
   - [ ] Submit button remains enabled
   - [ ] No API call made (check DevTools > Network tab)

**Expected Result**: ✅ Validation error shown, no API call

---

## Scenario 4: Email Validation - Invalid Format

**Test**: Validation error when submitting invalid email format

**Steps**:
1. Clear localStorage (if needed)
2. Navigate to `http://localhost:3000`
3. Wait for splash + animation
4. Type invalid email: `notanemail` (no @ symbol)
5. Click submit button
6. **Observe validation error**:
   - [ ] Error message: "Por favor, ingresa un correo electrónico válido."
   - [ ] Error text is red
   - [ ] Submit button remains enabled
7. **Test other invalid formats**:
   - `test@` (no domain)
   - `@example.com` (no local part)
   - `test @example.com` (space before @)
   - [ ] All show same error message

**Expected Result**: ✅ Invalid emails rejected with Spanish error message

---

## Scenario 5: Email Validation - Clear Error on Typing

**Test**: Error message clears when user starts typing

**Steps**:
1. Clear localStorage
2. Navigate to `http://localhost:3000`
3. Wait for splash + animation
4. Click submit button (empty field) → Error appears
5. **Start typing** in email field
6. **Observe behavior**:
   - [ ] Error message disappears immediately (on first keystroke)
   - [ ] Input field is now normal state (no red border)

**Expected Result**: ✅ Error clears on typing, good UX

---

## Scenario 6: Duplicate Email Submission (Allowed)

**Test**: Same email can be submitted multiple times from different devices/sessions

**Steps**:
1. Clear localStorage: DevTools > Application > localStorage > Clear All
2. Navigate to `http://localhost:3000`
3. Wait for splash + animation
4. Submit email: `duplicate@example.com`
5. Wait for success, navigate to main app
6. **Clear localStorage again** (simulate different device)
7. Navigate to `http://localhost:3000`
8. Wait for splash + animation (email screen appears again)
9. Submit **same email**: `duplicate@example.com`
10. **Verify Google Sheets**:
    - [ ] TWO rows with `duplicate@example.com` (different timestamps)

**Expected Result**: ✅ Duplicate emails allowed, both stored in Google Sheets

---

## Scenario 7: Button Styling Consistency

**Test**: Submit button matches CompletionScreen button style

**Steps**:
1. Clear localStorage
2. Navigate to `http://localhost:3000`
3. Wait for splash + animation → Email screen appears
4. **Note submit button style** (background color, padding, font, hover state)
5. Submit valid email, navigate to main app
6. Swipe sneaker to either side until CompletionScreen appears
7. **Compare button styles**:
   - [ ] Background colors match (likely brand red)
   - [ ] Text colors match (likely white)
   - [ ] Font sizes match
   - [ ] Padding/spacing matches
   - [ ] Border radius matches
   - [ ] Hover effects match

**Expected Result**: ✅ Buttons are visually consistent

---

## Scenario 8: Animation Performance (60 FPS)

**Test**: Blind-lift animation runs smoothly at 60 FPS

**Steps**:
1. Clear localStorage
2. Open DevTools > Performance tab
3. Click "Record" button
4. Navigate to `http://localhost:3000`
5. Wait for splash + blind-lift animation to complete
6. Stop recording
7. **Analyze performance**:
   - [ ] FPS graph shows consistent 60 FPS during animation (green line)
   - [ ] No red bars (dropped frames)
   - [ ] Animation duration: ~1200ms (match with timeline)
   - [ ] Main thread activity: Mostly idle (animation uses GPU compositor)

**Expected Result**: ✅ Smooth 60 FPS animation, no jank

---

## Scenario 9: Google Sheets API Error Handling

**Test**: Graceful error handling when API fails

**Prerequisites**:
- [ ] Temporarily break API by using invalid API key in `.env.local`

**Steps**:
1. Edit `.env.local`: Change `NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY` to `INVALID_KEY`
2. Restart dev server: `npm run dev`
3. Clear localStorage
4. Navigate to `http://localhost:3000`
5. Wait for splash + animation
6. Submit valid email: `test@example.com`
7. **Observe error handling**:
   - [ ] Button shows loading state briefly
   - [ ] Error message appears: "Hubo un problema al enviar tu correo. Por favor, intenta de nuevo."
   - [ ] Submit button re-enabled (user can retry)
   - [ ] DevTools > Console shows API error (401 Unauthorized or similar)
8. Fix `.env.local`: Restore correct API key
9. Restart dev server
10. Click submit again (same page, don't refresh)
11. **Observe retry**:
    - [ ] Submission succeeds this time
    - [ ] Navigates to main app

**Expected Result**: ✅ API errors handled gracefully, retry works

---

## Scenario 10: Responsive Design (Mobile)

**Test**: Email screen works on mobile viewport

**Steps**:
1. Open DevTools > Device Toolbar (Ctrl+Shift+M)
2. Select "iPhone 12 Pro" or similar mobile device
3. Clear localStorage
4. Navigate to `http://localhost:3000`
5. Wait for splash + animation
6. **Observe layout**:
   - [ ] Red background is 1/3 of mobile viewport height
   - [ ] Logo scales correctly (not cut off)
   - [ ] Email form fits in bottom 2/3 of screen
   - [ ] Heading text readable (not too small)
   - [ ] Input field full width (with appropriate padding)
   - [ ] Submit button full width (with appropriate padding)
   - [ ] Touch target size: ≥44x44px (Apple guideline)
7. **Test interaction**:
   - [ ] Tap email input → keyboard appears, input focused
   - [ ] Type email on mobile keyboard
   - [ ] Tap submit button → works as expected

**Expected Result**: ✅ Fully functional on mobile devices

---

## Scenario 11: Production Build

**Test**: Feature works in production build

**Steps**:
1. Build production bundle: `npm run build`
2. **Observe build output**:
   - [ ] Build succeeds with no errors
   - [ ] No TypeScript errors
   - [ ] Environment variables embedded: Look for warnings about `NEXT_PUBLIC_` vars
3. Start production server: `npm start` (or use static file server if using static export)
4. Clear localStorage
5. Navigate to production URL
6. **Repeat Scenario 1** (first-time user flow)
7. **Verify**:
   - [ ] Splash + animation work
   - [ ] Email submission works
   - [ ] Google Sheets receives data
   - [ ] localStorage flag set correctly

**Expected Result**: ✅ Works identically in production

---

## Edge Case Testing

### Test: localStorage Disabled (Private Browsing)
**Steps**:
1. Open browser in private/incognito mode
2. Navigate to app
3. Submit email
4. **Observe**: Email screen appears on every page load (acceptable behavior)

### Test: Very Long Email (>254 characters)
**Steps**:
1. Type email with 255 characters: `a123...@example.com`
2. Click submit
3. **Observe**: Validation error appears before API call

### Test: Network Offline
**Steps**:
1. Open DevTools > Network tab
2. Set throttling to "Offline"
3. Try to submit email
4. **Observe**: Error message appears (network request failed)

### Test: Page Refresh During Submission
**Steps**:
1. Submit email
2. Immediately refresh page (before API response)
3. **Observe**: Email screen appears again (localStorage not set yet), user can resubmit

---

## Validation Checklist

### Functional Requirements
- [ ] FR-001: Blind-lift animation triggers after splash (1200ms)
- [ ] FR-002: Red background rises to 1/3 of viewport
- [ ] FR-003: Logo shrinks to 75% simultaneously
- [ ] FR-004: Email form displays in bottom 2/3 white area
- [ ] FR-005: Email validation (empty, invalid format)
- [ ] FR-006: Spanish error messages displayed
- [ ] FR-007: Google Sheets API stores email + timestamp + user agent
- [ ] FR-008: localStorage flag set after successful submission
- [ ] FR-009: Returning users skip email screen entirely
- [ ] FR-010: Submit button matches CompletionScreen style
- [ ] FR-011: Duplicate emails allowed

### Performance Requirements
- [ ] Animation runs at 60 FPS (no dropped frames)
- [ ] Email validation completes in <100ms
- [ ] Google Sheets API responds in <3 seconds (typical)

### Accessibility Requirements
- [ ] Email input has proper label/aria-label
- [ ] Error messages announced to screen readers
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Touch targets ≥44x44px on mobile

### Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (desktop + mobile)

---

## Rollback Plan

If critical issues found:
1. Revert to main branch: `git checkout main`
2. Issues to watch:
   - Google Sheets API quota exceeded (100 req/100s)
   - localStorage corruption breaking app
   - Animation causing performance issues on low-end devices

---

## Success Criteria

✅ All 11 scenarios pass  
✅ All edge cases handled gracefully  
✅ No TypeScript errors  
✅ No console errors (except expected API errors in Scenario 9)  
✅ Production build works identically to dev  
✅ Feature ready for merge to main branch
