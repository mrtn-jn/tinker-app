# Data Model: Email Collection Login Screen

## Entities

### 1. EmailEntry
**Purpose**: Represents a single email submission stored in Google Sheets

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | Yes | User's email address (trimmed, validated) |
| `timestamp` | `string` | Yes | ISO 8601 timestamp of submission (e.g., "2025-10-03T14:32:10.123Z") |
| `userAgent` | `string` | Yes | Browser user agent for analytics (e.g., "Mozilla/5.0...") |

**Validation Rules**:
- `email`: Must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, max 254 characters, trimmed
- `timestamp`: Generated server-side using `new Date().toISOString()`
- `userAgent`: Captured from `navigator.userAgent`

**Storage**: Google Sheets row format
```
| Email                | Timestamp              | User Agent                    |
|---------------------|------------------------|-------------------------------|
| user@example.com    | 2025-10-03T14:32:10.123Z | Mozilla/5.0 (Windows NT...) |
```

**TypeScript Interface**:
```typescript
export interface EmailEntry {
  email: string;
  timestamp: string; // ISO 8601 format
  userAgent: string;
}
```

---

### 2. UserSession
**Purpose**: Tracks whether user has already submitted email (stored in localStorage)

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hasSubmittedEmail` | `boolean` | Yes | True if user has submitted email before |
| `submissionTimestamp` | `string` | Yes | ISO 8601 timestamp of first submission |

**Validation Rules**:
- `hasSubmittedEmail`: Must be `true` (only stored after successful submission)
- `submissionTimestamp`: Same format as EmailEntry.timestamp

**Storage**: localStorage key `"tinker_email_submitted"`
```json
{
  "hasSubmittedEmail": true,
  "submissionTimestamp": "2025-10-03T14:32:10.123Z"
}
```

**TypeScript Interface**:
```typescript
export interface UserSession {
  hasSubmittedEmail: boolean;
  submissionTimestamp: string; // ISO 8601 format
}
```

**Lifecycle**:
- **Created**: After successful Google Sheets submission
- **Read**: On SplashScreen mount to determine if user is returning
- **Updated**: Never (flag is permanent once set)
- **Deleted**: Only by user clearing browser data (acceptable)

---

### 3. SubmissionStatus
**Purpose**: Represents current state of email submission process

**Type**: Discriminated union for type-safe state management

**States**:
| State | Description | UI Behavior |
|-------|-------------|-------------|
| `idle` | Initial state, form ready | Submit button enabled |
| `validating` | Client-side email validation in progress | Brief (sync), no UI change |
| `submitting` | API request in flight | Submit button disabled, show loading indicator |
| `success` | Email submitted successfully | Navigate to main app immediately |
| `error` | Submission failed | Show error message, button re-enabled |

**TypeScript Type**:
```typescript
export type SubmissionStatus = 
  | { type: 'idle' }
  | { type: 'validating' }
  | { type: 'submitting' }
  | { type: 'success' }
  | { type: 'error'; message: string };
```

**State Transitions**:
```
idle → validating → [invalid] → idle (with error)
                  ↓ [valid]
                submitting → [API success] → success → navigate away
                          ↓ [API error]
                          error → idle (on retry)
```

---

## Relationships

### EmailEntry ↔ UserSession
- **One-to-one**: Each UserSession corresponds to first EmailEntry submission
- **Constraint**: UserSession is created only after successful EmailEntry storage
- **No foreign key**: These are stored in separate systems (Google Sheets vs localStorage)

### EmailEntry Duplication
- **Allowed**: Same email can be submitted multiple times (per requirements)
- **Use case**: Multiple devices, cleared localStorage, user re-submits intentionally
- **No uniqueness constraint** in Google Sheets

---

## Storage Implementation

### Google Sheets Schema
**Spreadsheet ID**: `process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID`  
**Sheet Name**: `Sheet1` (default)  
**Columns**: A (Email), B (Timestamp), C (User Agent)

**Header Row** (optional, for readability):
```
Email | Timestamp | User Agent
```

**API Call Pattern**:
```typescript
POST https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/Sheet1:append
Query: ?valueInputOption=USER_ENTERED&key={API_KEY}
Body: {
  "values": [
    ["user@example.com", "2025-10-03T14:32:10.123Z", "Mozilla/5.0..."]
  ]
}
```

**Response**:
```json
{
  "spreadsheetId": "...",
  "tableRange": "Sheet1!A1:C1",
  "updates": {
    "updatedRows": 1
  }
}
```

### localStorage Schema
**Key**: `"tinker_email_submitted"`  
**Value**: JSON-stringified UserSession object

**Example**:
```javascript
localStorage.setItem('tinker_email_submitted', JSON.stringify({
  hasSubmittedEmail: true,
  submissionTimestamp: "2025-10-03T14:32:10.123Z"
}));
```

**Error Handling**:
- localStorage unavailable (private browsing): Catch exception, treat as not submitted
- Corrupted JSON: Catch parse error, treat as not submitted
- Missing key: Treat as not submitted

---

## Validation Summary

### Email Validation (Client-Side)
| Rule | Error Message (Spanish) |
|------|------------------------|
| Empty | "Por favor, ingresa tu correo electrónico." |
| Invalid format | "Por favor, ingresa un correo electrónico válido." |
| Too long (>254 chars) | "El correo electrónico es demasiado largo (máximo 254 caracteres)." |

### API Validation (Google Sheets)
- No server-side validation (Google Sheets accepts any string)
- Client is responsible for all validation before submission

---

## Performance Considerations

### Google Sheets API Quotas
- **Limit**: 100 requests per 100 seconds per user
- **Expected usage**: ~1 request per user per session (first visit only)
- **Risk**: Very low (unless malicious rapid resubmission)

### localStorage Performance
- **Read**: Synchronous, <1ms (happens once on SplashScreen mount)
- **Write**: Synchronous, <1ms (happens once after successful submission)
- **Size**: ~100 bytes (negligible vs 5MB limit)

---

## Migration Path

### If Moving Away from Google Sheets
1. Export Google Sheets data as CSV
2. Import to new system (database, CRM, etc.)
3. Column mapping: Email → email, Timestamp → created_at, User Agent → user_agent
4. No data loss (all submissions preserved)

### localStorage Compatibility
- No migration needed (flag-only, no personal data)
- If changing key name: Read old key, write to new key, delete old key

---

## Security & Privacy

### Data Classification
- **Email**: Non-sensitive (user consents by submitting)
- **Timestamp**: Non-sensitive (analytics only)
- **User Agent**: Non-sensitive (standard browser string)

### GDPR Considerations
- User provides email voluntarily (implied consent)
- No password, no authentication, no sensitive data
- Easy export/deletion via Google Sheets interface
- Privacy policy should mention: "Email stored for communication purposes"

### API Key Security
- ✅ API key restricted to Sheets API only
- ✅ API key restricted by HTTP referrer (domain whitelist)
- ✅ Public API key acceptable (no sensitive operations)
- ✅ Sheet can be configured with "Anyone with link can edit" or restricted to API key only

---

## Summary

**Total Entities**: 3 (EmailEntry, UserSession, SubmissionStatus)  
**Storage Systems**: 2 (Google Sheets, localStorage)  
**API Calls**: 1 per user (append row to Google Sheets)  
**Client-Side State**: SubmissionStatus (form state management)

All entities align with:
- ✅ Constitutional principles (static-first, no backend)
- ✅ Functional requirements (email validation, duplicate handling, persistence)
- ✅ Performance goals (<100ms validation, <3s API response)
- ✅ Security requirements (API key restrictions, no sensitive data)

Ready for quickstart.md generation (manual validation scenarios).
