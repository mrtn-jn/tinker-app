import type { EmailEntry } from '@/types/email';
import { supabase } from './supabase';

/**
 * Submits email to Supabase database
 * @param email - User's email address (will be trimmed)
 * @throws Error if submission fails
 */
export const submitEmailToGoogleSheets = async (email: string): Promise<void> => {
  const entry: EmailEntry = {
    email: email.trim(),
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };

  const { error } = await supabase
    .from('emails')
    .insert({
      email: entry.email,
      timestamp: entry.timestamp,
      user_agent: entry.userAgent
    });

  if (error) {
    throw new Error(error.message || 'Failed to save email');
  }
};
