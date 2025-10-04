'use client';

import { useState } from 'react';
import type { SubmissionStatus, UserSession } from '@/types/email';
import { validateEmail } from '@/utils/emailValidation';
import { submitEmailToGoogleSheets } from '@/lib/googleSheets';

const STORAGE_KEY = 'tinker_email_submitted';

/**
 * Custom hook for email form submission with validation and Google Sheets integration
 * @returns Form state and handlers
 */
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

    // Submit to Google Sheets
    setStatus({ type: 'submitting' });
    try {
      await submitEmailToGoogleSheets(email);
      
      // Set localStorage flag on success
      const session: UserSession = {
        hasSubmittedEmail: true,
        submissionTimestamp: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      
      setStatus({ type: 'success' });
    } catch (err) {
      console.error('Email submission error:', err);
      setStatus({ 
        type: 'error', 
        message: 'Hubo un problema al enviar tu correo. Por favor, intenta de nuevo.' 
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error on typing (good UX)
    if (status.type === 'error') {
      setStatus({ type: 'idle' });
    }
  };

  return { email, status, handleSubmit, handleChange };
};

/**
 * Checks if user has already submitted email (reads from localStorage)
 * @returns true if email was submitted before, false otherwise
 */
export const checkEmailSubmitted = (): boolean => {
  try {
    const session = localStorage.getItem(STORAGE_KEY);
    if (!session) return false;
    
    const parsed: UserSession = JSON.parse(session);
    return parsed.hasSubmittedEmail === true;
  } catch (error) {
    // Corrupted data or localStorage unavailable = treat as not submitted
    console.warn('Failed to read email submission status from localStorage:', error);
    return false;
  }
};
