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
