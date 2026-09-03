export interface CoffeeRecipe {
  id: string;
  beanName: string;
  country?: string;
  bannerColor?: string;
  coffeeAmount: number;     // Dose in grams (e.g., 18.0)
  yieldAmount: number;      // Liquid espresso out in grams (e.g., 36.0)
  grindSize: string;        // Fellow Opus setting (e.g., "2.1" or "2")
  shotTimeSeconds?: number; // Shot duration in seconds (e.g., 28)
  notes?: string;
  isFavorite?: boolean;
  rating?: number;          // 1 to 5 stars
  roastLevel?: 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  createdAt?: number;       // Unix timestamp in ms
  updatedAt?: number;       // Unix timestamp in ms
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export type SortOption = 'newest' | 'oldest' | 'ratio' | 'dose' | 'name';

export interface FilterOptions {
  query: string;
  sortBy: SortOption;
}

export interface DialInGuidance {
  symptom: string;
  tasteCategory: 'sour' | 'bitter' | 'watery' | 'strong' | 'balanced';
  description: string;
  diagnosis: string;
  actions: string[];
  opusAdjustment: string;
  bambinoTip: string;
}
