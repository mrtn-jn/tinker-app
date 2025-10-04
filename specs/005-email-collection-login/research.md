# Research: Email Collection Login Screen

## 1. Google Sheets API v4 Integration for Client-Side Next.js

**Decision**: Use Google Sheets API v4 with API Key authentication (read/write access)

**Rationale**:
- Client-side only integration (no backend server required)
- Static export compatible (API calls happen at runtime in browser)
- Simple authentication using API key in environment variables
- Official Google client library available: `gapi` or `@googleapis/sheets`
- Quota: 100 requests per 100 seconds per user (sufficient for email collection)
- Low complexity: Single API call to append row to spreadsheet

**Alternatives Considered**:
1. **OAuth 2.0 Flow**: Rejected - Requires user authentication, adds complexity
2. **Service Account**: Rejected - Requires backend server to keep credentials secure
3. **Google Forms**: Rejected - Loses control over UI/UX, requires iframe or redirect
4. **Formspree/Form submission services**: Rejected - Additional dependency, monthly costs

**Implementation Pattern**:
```typescript
// Using fetch API directly (no client library)
const appendRow = async (email: string) => {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1:append?valueInputOption=USER_ENTERED&key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        values: [[email, new Date().toISOString(), navigator.userAgent]]
      })
    }
  );
  return response.json();
};
```

**Security Notes**:
- API key is public (NEXT_PUBLIC_ prefix)
- Restrict API key to Sheets API only (Google Cloud Console)
- Restrict by HTTP referrer (your domain only)
- No sensitive data exposed (emails are already considered non-sensitive)

---

## 2. CSS Animation for Blind-Lift Effect

**Decision**: Use CSS `@keyframes` with `transform: scaleY()` and `transform-origin: bottom`

**Rationale**:
- Pure CSS approach (no JS animation libraries)
- GPU-accelerated (transform property uses compositor)
- Duration: 1200ms as specified in requirements
- Easing: `ease-out` for smooth deceleration
- Red background rises from bottom to 1/3 of screen height
- Logo scales to 75% simultaneously

**Alternatives Considered**:
1. **Framer Motion**: Rejected - Adds bundle size, constitution prefers simple CSS
2. **React Spring**: Rejected - Additional dependency for simple animation
3. **GSAP**: Rejected - Overkill for single animation sequence
4. **Height animation**: Rejected - Height changes trigger reflow (worse performance)

**Implementation Pattern**:
```css
@keyframes blind-lift {
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
}

.red-background {
  height: 33.33vh; /* 1/3 of viewport */
  transform-origin: bottom;
  animation: blind-lift 1200ms ease-out forwards;
}

@keyframes logo-shrink {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.75);
  }
}

.logo {
  animation: logo-shrink 1200ms ease-out forwards;
}
```

**Performance Considerations**:
- Use `will-change: transform` to hint browser of upcoming animation
- Apply `backface-visibility: hidden` to prevent sub-pixel rendering issues
- Remove `will-change` after animation completes (memory optimization)

---

## 3. localStorage Best Practices for Session Persistence

**Decision**: Use boolean flag `"tinker_email_submitted"` with ISO timestamp, no expiration

**Rationale**:
- Simple key-value storage (no complex session management)
- Permanent persistence (per requirements: returning users skip email forever)
- Timestamp for potential future analytics
- No personal data stored (just submission flag)
- 5-10MB storage limit is more than sufficient

**Alternatives Considered**:
1. **sessionStorage**: Rejected - Clears on tab close, requirement is permanent
2. **IndexedDB**: Rejected - Overkill for single boolean flag
3. **Cookies**: Rejected - Adds HTTP overhead, localStorage is simpler
4. **Store email in localStorage**: Rejected - Privacy concern if device shared

**Implementation Pattern**:
```typescript
// Set flag after successful submission
const markEmailSubmitted = () => {
  const session = {
    hasSubmittedEmail: true,
    submissionTimestamp: new Date().toISOString()
  };
  localStorage.setItem('tinker_email_submitted', JSON.stringify(session));
};

// Check flag on app load
const hasSubmittedEmail = (): boolean => {
  try {
    const session = localStorage.getItem('tinker_email_submitted');
    if (!session) return false;
    const parsed = JSON.parse(session);
    return parsed.hasSubmittedEmail === true;
  } catch {
    return false; // Corrupted data = treat as not submitted
  }
};
```

**Edge Cases**:
- Private browsing: localStorage disabled → show email form every time (acceptable)
- Manual clear: User clears browser data → show email form again (acceptable)
- Multiple devices: Each device tracks separately → email may be submitted multiple times (per requirements: duplicates allowed)

---

## 4. Email Validation Patterns (RFC 5321 Compliant)

**Decision**: Use simplified regex for basic format validation, allow most valid emails

**Rationale**:
- Requirement: Basic validation only (presence of @, domain part)
- No strict RFC 5321 enforcement (too complex, rejects valid emails)
- Allow duplicates (per clarifications resolved)
- 254 character limit (RFC 5321 maximum)
- Spanish error messages (per clarifications)

**Alternatives Considered**:
1. **Strict RFC 5321 regex**: Rejected - Too complex, rejects uncommon valid emails
2. **Email verification service**: Rejected - Adds latency, requires API calls
3. **No validation**: Rejected - UX suffers with typos
4. **Domain MX record check**: Rejected - Requires backend, adds complexity

**Implementation Pattern**:
```typescript
// Simplified email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): string | null => {
  const trimmed = email.trim();
  
  if (trimmed.length === 0) {
    return 'Por favor, ingresa tu correo electrónico.';
  }
  
  if (trimmed.length > 254) {
    return 'El correo electrónico es demasiado largo (máximo 254 caracteres).';
  }
  
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Por favor, ingresa un correo electrónico válido.';
  }
  
  return null; // Valid
};
```

**Error Messages (Spanish)**:
- Empty: "Por favor, ingresa tu correo electrónico."
- Invalid format: "Por favor, ingresa un correo electrónico válido."
- Too long: "El correo electrónico es demasiado largo (máximo 254 caracteres)."
- API error: "Hubo un problema al enviar tu correo. Por favor, intenta de nuevo."

---

## 5. Environment Variable Management for API Keys in Next.js Static Export

**Decision**: Use `NEXT_PUBLIC_` prefix for client-side variables, manage in `.env.local`

**Rationale**:
- Next.js convention: `NEXT_PUBLIC_*` variables are embedded at build time
- Static export compatible (no runtime environment variable resolution)
- Git-ignored `.env.local` keeps secrets out of version control
- Example `.env.local.example` for team documentation

**Alternatives Considered**:
1. **Hardcoded in source**: Rejected - Security risk, no key rotation
2. **Runtime config**: Rejected - Not supported in static export
3. **Build-time injection**: Rejected - Requires CI/CD changes, less flexible

**Implementation Pattern**:
```bash
# .env.local (git-ignored)
NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=AIzaSy...your-key-here
NEXT_PUBLIC_GOOGLE_SHEET_ID=1abc...your-sheet-id
```

```typescript
// Access in code
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;

if (!API_KEY || !SHEET_ID) {
  throw new Error('Missing Google Sheets configuration');
}
```

**Security Checklist**:
- ✅ API key restricted to Sheets API only (Google Cloud Console)
- ✅ API key restricted by HTTP referrer (your-domain.com/*)
- ✅ .env.local added to .gitignore
- ✅ .env.local.example committed for documentation
- ✅ Production deployment: Set environment variables in hosting platform (Vercel, Netlify, etc.)

**Team Documentation**:
```bash
# .env.local.example
NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id_here
```

---

## 6. Form Error State Management

**Decision**: Use React `useState` for error message, display below input field

**Rationale**:
- Simple component-level state (no global state needed)
- Error message cleared on user typing (good UX)
- Red text color for visibility (Tailwind: `text-red-600`)
- Validation triggered on submit, not on blur (less intrusive)

**Alternatives Considered**:
1. **Formik/React Hook Form**: Rejected - Overkill for single input field
2. **Global state (Zustand/Context)**: Rejected - Unnecessary complexity
3. **Inline validation on blur**: Rejected - Too aggressive for email input

**Implementation Pattern**:
```typescript
const [email, setEmail] = useState('');
const [error, setError] = useState<string | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate
  const validationError = validateEmail(email);
  if (validationError) {
    setError(validationError);
    return;
  }
  
  // Submit
  setError(null);
  setIsSubmitting(true);
  try {
    await submitToGoogleSheets(email);
    markEmailSubmitted();
    // Navigate to main app
  } catch (err) {
    setError('Hubo un problema al enviar tu correo. Por favor, intenta de nuevo.');
  } finally {
    setIsSubmitting(false);
  }
};

// Clear error on typing
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(e.target.value);
  if (error) setError(null);
};
```

**UI States**:
1. **Initial**: Empty input, no error, submit button enabled
2. **Typing**: User typing, error cleared if present
3. **Validation error**: Red text below input, submit button enabled
4. **Submitting**: Button disabled, loading indicator
5. **Success**: Navigate to main app immediately

---

## Summary

All technical decisions documented and aligned with:
- ✅ Constitution: Static-first (Google Sheets is client-side), simplicity first, no backend
- ✅ Requirements: 1200ms animation, Spanish errors, localStorage persistence, Google Sheets storage
- ✅ Performance: 60 FPS animations (transform-based), <100ms validation, <3s API response
- ✅ Security: API key restrictions, no sensitive data exposure
- ✅ UX: Smooth animations, clear error messages, returning user flow

Ready for Phase 1 (data-model.md and quickstart.md generation).
