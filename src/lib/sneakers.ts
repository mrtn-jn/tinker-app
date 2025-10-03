// Sneaker data loader and validator

import { SneakerProfile } from '@/types/sneaker';
import sneakersData from '../../public/info/sneakers-data.json';

/**
 * Validates that sneaker data meets requirements
 * @throws Error if data is invalid
 */
export function validateSneakerData(data: unknown): SneakerProfile[] {
  if (!Array.isArray(data) || data.length !== 4) {
    throw new Error('sneakers-data.json must contain exactly 4 sneakers');
  }
  
  data.forEach((sneaker, index) => {
    if (
      !sneaker.name || 
      !sneaker.description || 
      !sneaker.purchase_type || 
      !sneaker.availability_type ||
      !Array.isArray(sneaker.images) || 
      sneaker.images.length === 0
    ) {
      throw new Error(`Invalid sneaker data at index ${index}: missing required fields`);
    }
  });
  
  return data as SneakerProfile[];
}

/**
 * Gets all sneakers from static JSON file
 * @returns Array of 4 validated sneaker profiles
 */
export function getSneakers(): SneakerProfile[] {
  return validateSneakerData(sneakersData);
}
