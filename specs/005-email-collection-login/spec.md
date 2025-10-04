# Feature Specification: Email Collection Login Screen

**Feature Branch**: `005-email-collection-login`  
**Created**: 2025-10-03  
**Status**: Draft  
**Input**: User description: "login. Quiero hacer que se solicite el mail al ingresar. No sera un sistema de login completo, solo voy a acumular los mails para recopilar esa informacion de los usuarios. En la pantalla de splash screen luego de pasado el tiempo de la animacion, en vez de ir a la pantalla principal lo que deberia suceder es que el fondo rojo se levante como una persiana con una animacion y ahora pasara a ocupar 1/3 de la pantalla y el resto de la pantalla es blanco. Mientras se levanta como persiana el logo debera achicarse un 25%. En la parte blanca debera haber un texto que diga ingresa tu mail, debajo un input para que escriban el mai y debajo el boton que dija Ingresar. Una vez que ingresen el mail deberia almacenarse en alguna lado, se te ocurre algo que no sea una base de datos normal? Y ahi si poder acceder a la pantalla principal de la webapp."

## Execution Flow (main)
```
1. Parse user description from Input ✅
   → Feature: Email collection screen after splash animation
2. Extract key concepts from description ✅
   → Actors: New users accessing the app
   → Actions: Enter email, submit, proceed to main app
   → Data: Email addresses for collection
   → Constraints: No full authentication system, no traditional database
3. For each unclear aspect:
   → [NEEDS CLARIFICATION] marked for ambiguous requirements
4. Fill User Scenarios & Testing section ✅
   → Primary flow: Splash → Email screen → Main app
5. Generate Functional Requirements ✅
   → Animation behavior, email validation, storage, navigation
6. Identify Key Entities ✅
   → Email entry (timestamp, email address)
7. Run Review Checklist
   → Ambiguities marked with [NEEDS CLARIFICATION]
8. Return: SUCCESS (spec ready for clarification phase)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
**As a** first-time visitor to the Tinker sneaker app  
**I want to** provide my email address before accessing the main experience  
**So that** the app owner can collect contact information for future communications

### User Journey

**First-Time Users:**
1. User opens the app and sees the splash screen with red background and logo
2. After splash animation completes (2 seconds), red background "lifts up" like a window blind/curtain:
   - Animation duration: 1200ms (1.2 seconds)
   - Red area shrinks to occupy top 1/3 of screen
   - Logo scales down by 25% during the lift animation
   - Bottom 2/3 of screen reveals white background
3. White section displays:
   - Heading text: "Ingresa tu mail"
   - Email input field
   - "Ingresar" button (styled like CompletionScreen link)
4. User types their email address into the input field
5. User clicks "Ingresar" button
6. System validates email format (contains @ and domain)
7. Email is stored in Google Sheets with timestamp
8. localStorage flag set: "tinker_email_submitted" = true
9. User is redirected to the main sneaker swipe interface

**Returning Users** (who already submitted email):
1. User opens the app and sees normal splash screen (2 seconds)
2. NO blind-lift animation
3. NO email form
4. Directly redirected to main sneaker swipe interface after splash

### Acceptance Scenarios

**Scenario 1: Successful email submission (Happy Path)**
- **Given** the splash animation has completed and user has NOT previously submitted email
- **When** the user enters a valid email (e.g., "user@example.com") and clicks "Ingresar"
- **Then** the email is stored in Google Sheets with timestamp
- **And** localStorage flag "tinker_email_submitted" is set to true
- **And** the user is redirected to the main sneaker card interface
- **And** the email screen does not appear again (permanent, even after browser close)

**Scenario 2: Invalid email format**
- **Given** the user is on the email collection screen
- **When** the user enters an invalid email (e.g., "notanemail") and clicks "Ingresar"
- **Then** error message "Ingresa un email válido" is displayed
- **And** the user remains on the email screen
- **And** the input field retains the invalid value for correction

**Scenario 3: Empty email submission**
- **Given** the user is on the email collection screen
- **When** the user clicks "Ingresar" without entering any text
- **Then** error message "Por favor ingresa tu email" is displayed
- **And** the user remains on the email screen

**Scenario 4: Returning user (already submitted email)**
- **Given** localStorage contains "tinker_email_submitted" = true (from previous visit)
- **When** the user reopens the app
- **Then** normal splash screen is displayed for 2 seconds
- **And** NO blind-lift animation occurs
- **And** NO email collection form is shown
- **And** the user goes directly to the main sneaker swipe interface after splash

**Scenario 5: Animation behavior (first-time users only)**
- **Given** the splash animation has just completed (after 2 seconds) and user has NOT submitted email
- **When** the transition to email screen begins
- **Then** the red background area animates upward like a lifting blind/curtain over 1200ms
- **And** the red area settles at the top 1/3 of the viewport
- **And** the logo scales down to 75% of its splash screen size during the animation
- **And** the white email form area is revealed in the bottom 2/3
- **And** the animation feels smooth and natural

### Edge Cases

**Navigation & State**
- **Page refresh during entry**: Partially entered email is preserved (input value persists)
- **Browser close before submit**: Email NOT stored, user sees email form again on next visit
- **Duplicate email submissions**: ALLOWED - same email can be submitted multiple times (stored as separate entries in Google Sheets)

**Input Validation**
- **Maximum email length**: 254 characters (standard RFC 5321 limit)
- **Special characters**: Allowed per email spec (dots, hyphens, underscores, etc.)
- **Whitespace handling**: Automatically trimmed before validation

**Storage & Privacy**
- **Retention period**: Indefinite (stored in Google Sheets, managed manually by owner)
- **Deletion requests**: Not implemented (owner must manually delete from Google Sheets)
- **Storage failure**: Display error message "Hubo un error. Intenta nuevamente" and allow user to retry

**Responsive Behavior**
- **1/3 red, 2/3 white split**: Applies to viewport height on both mobile and desktop
- **Logo scaling**: Maintains aspect ratio during 25% size reduction
- **Form layout**: Vertically centered in white area with responsive padding

## Requirements *(mandatory)*

### Functional Requirements

**Animation & Visual Behavior**
- **FR-001**: System MUST display splash screen animation for 2 seconds before transitioning to email collection screen (first-time users only)
- **FR-002**: After splash animation, system MUST animate the red background upward like a lifting window blind/curtain over 1200ms (1.2 seconds)
- **FR-003**: Red background area MUST settle at the top 1/3 of the viewport after animation
- **FR-004**: Logo MUST scale down to 75% of its original splash size (25% reduction) during the blind-lift animation
- **FR-005**: Logo MUST remain centered horizontally within the red area during and after animation
- **FR-006**: White background area MUST occupy the bottom 2/3 of the viewport and display the email form

**Email Form Content & Layout**
- **FR-007**: Email form MUST display heading text "Ingresa tu mail" at the top of the white area
- **FR-008**: System MUST provide a text input field for email entry below the heading
- **FR-009**: System MUST display a button labeled "Ingresar" below the email input field
- **FR-010**: Form elements MUST be centered horizontally within the white area
- **FR-010b**: "Ingresar" button MUST match the visual style (color, typography, spacing) of the link in CompletionScreen

**Email Validation & Submission**
- **FR-011**: System MUST validate that the email field is not empty before submission
- **FR-012**: System MUST validate email format (contains @ symbol and domain using basic regex pattern)
- **FR-013**: System MUST display error message "Por favor ingresa tu email" when field is empty
- **FR-013b**: System MUST display error message "Ingresa un email válido" when email format is invalid
- **FR-013c**: System MUST display error message "Hubo un error. Intenta nuevamente" when storage fails
- **FR-014**: System MUST prevent form submission when email is invalid or empty
- **FR-015**: System MUST trim whitespace from email input before validation

**Email Storage & Persistence**
- **FR-016**: System MUST store submitted email addresses in Google Sheets via API for later retrieval
- **FR-017**: System MUST record timestamp alongside each email submission (using user's local timezone)
- **FR-018**: System MUST allow duplicate email submissions (same email can be submitted multiple times)
- **FR-019**: Collected emails MUST be accessible via Google Sheets interface for export/analysis

**Navigation & Session Management**
- **FR-020**: After successful email submission, system MUST redirect user to main sneaker card interface
- **FR-021**: System MUST remember that user has submitted email permanently using localStorage
- **FR-022**: Returning users who have already submitted email MUST see normal splash screen (2 seconds) and skip directly to main app (NO blind-lift animation, NO email form)
- **FR-023**: System MUST preserve partially entered email text if user refreshes page before submission

**Accessibility & UX**
- **FR-024**: Email input field MUST have appropriate HTML input type and attributes (type="email")
- **FR-025**: "Ingresar" button MUST be keyboard accessible (Enter key submits form)
- **FR-026**: Error messages MUST be clearly visible and associated with the input field

### Key Entities

**EmailEntry**
- Represents a collected email address from a user
- Attributes: email address (string), submission timestamp (ISO 8601 format with timezone), submission count (if duplicate)
- Stored in: Google Sheets (one row per submission)

**UserSession**
- Represents the user's local session state to track whether email has been submitted
- Attributes: hasSubmittedEmail (boolean), submissionTimestamp (ISO string)
- Stored in: Browser localStorage (key: "tinker_email_submitted")

---

## Clarifications Resolved

**Session Date**: 2025-10-03

### 1. Storage Mechanism ✅ RESOLVED
**Decision**: Google Sheets API

**Rationale**: 
- No traditional database required
- Easy to export and view collected emails
- No backend infrastructure needed
- Free for personal use
- Real-time access to data

### 2. Session Persistence ✅ RESOLVED
**Decision**: Permanent (localStorage)

**Behavior**:
- **First-time users**: See full flow (splash → animation → email form → main app)
- **Returning users** (who already submitted email): See normal splash screen (2 seconds) → directly to main app (NO animation, NO email form)
- Email submission remembered indefinitely via localStorage

### 3. Email Validation Rules ✅ RESOLVED
**Decision**: Format validation only, allow duplicates

**Rules**:
- Basic email format check (contains @ and domain)
- Allow same email to be submitted multiple times
- No duplicate prevention (simpler implementation)

### 4. Animation Duration ✅ RESOLVED
**Decision**: 1200ms (1.2 seconds)

**Rationale**: Suave y elegante, provides smooth visual transition

### 5. Error Messages ✅ RESOLVED
**Approved Messages**:
- Empty email field: **"Por favor ingresa tu email"**
- Invalid format: **"Ingresa un email válido"**
- Storage failure: **"Hubo un error. Intenta nuevamente"**

### 6. Button Styling ✅ RESOLVED
**Design Requirement**: "Ingresar" button must be aesthetically identical to the link in CompletionScreen

**Reference**: Match visual style of CompletionScreen link/button

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs) - Avoided specific tech (Google Sheets API mentioned only as storage solution, not implementation)
- [x] Focused on user value and business needs - Email collection for marketing/communication
- [x] Written for non-technical stakeholders - Plain language
- [x] All mandatory sections completed - User scenarios, requirements present

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain - **PASS**: All 6 clarifications resolved
- [x] Requirements are testable and unambiguous - All FRs have specific, measurable criteria
- [x] Success criteria are measurable - Clear acceptance scenarios with Given/When/Then
- [x] Scope is clearly bounded - Email collection only, not full authentication
- [x] Dependencies and assumptions identified - Google Sheets API, localStorage, CompletionScreen button style

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked initially (6 clarification areas)
- [x] User scenarios defined (5 scenarios + edge cases)
- [x] Requirements generated (29 functional requirements - updated with clarifications)
- [x] Entities identified (EmailEntry stored in Google Sheets, UserSession in localStorage)
- [x] Clarifications resolved (all 6 questions answered)
- [x] Review checklist passed - **READY FOR PLANNING**

---

## Next Steps

1. ✅ All clarifications resolved
2. **Execute `/plan` command** to create implementation plan (plan.md)
3. Generate technical research (research.md)
4. Create data model documentation (data-model.md)
5. Define validation scenarios (quickstart.md)
6. Proceed to `/tasks` for task breakdown
7. Finally `/implement` for execution
6. Once clarifications resolved, proceed to `/clarify` command to update spec
7. Then `/plan` to create implementation plan
