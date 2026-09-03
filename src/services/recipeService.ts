import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../config/firebase.ts';
import { CoffeeRecipe } from '../types/recipe.ts';

const COLLECTION_NAME = 'coffee_recipes';

/**
 * Curated initial / demo recipes for visitors and guests
 */
export const DEMO_RECIPES: CoffeeRecipe[] = [
  {
    id: 'demo-ethiopia',
    beanName: 'Ethiopian Yirgacheffe G1',
    country: 'Ethiopia (Washed)',
    bannerColor: '#9C6644',
    coffeeAmount: 18.0,
    yieldAmount: 40.0,
    grindSize: 'Opus 2.1',
    shotTimeSeconds: 29,
    roastLevel: 'Medium-Light',
    rating: 5,
    isFavorite: true,
    notes: 'Jasmine floral aroma, bergamot citrus acidity, silky honey finish. Pre-infused for 7 seconds on Bambino.',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'demo-colombia',
    beanName: 'Huila Supremo',
    country: 'Colombia (Natural)',
    bannerColor: '#6F4E37',
    coffeeAmount: 18.5,
    yieldAmount: 37.0,
    grindSize: 'Opus 2.0',
    shotTimeSeconds: 27,
    roastLevel: 'Medium',
    rating: 4,
    isFavorite: false,
    notes: 'Dark chocolate, dried plum, and caramel sweetness. Rich crema, excellent for cortados or flat whites.',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'demo-kenya',
    beanName: 'Nyeri Hill Farm Peaberry',
    country: 'Kenya (Double Washed)',
    bannerColor: '#84513E',
    coffeeAmount: 17.5,
    yieldAmount: 38.0,
    grindSize: 'Opus 2.2',
    shotTimeSeconds: 31,
    roastLevel: 'Light',
    rating: 5,
    isFavorite: true,
    notes: 'Blackcurrant, ruby grapefruit, brown sugar finish. Pull ratio slightly longer (1:2.17) to tame acidity.',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 10,
  }
];

/**
 * Subscribes to real-time changes in the user's coffee recipes
 */
export function subscribeToRecipes(
  userId: string, 
  onSuccess: (recipes: CoffeeRecipe[]) => void, 
  onError?: (error: Error) => void
): Unsubscribe {
  const collectionRef = collection(db, 'users', userId, COLLECTION_NAME);
  const q = query(collectionRef);

  return onSnapshot(
    q,
    (snapshot) => {
      const recipes: CoffeeRecipe[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        recipes.push({
          id: docSnap.id,
          beanName: data.beanName || 'Untitled Bean',
          country: data.country || '',
          bannerColor: data.bannerColor || '#6F4E37',
          coffeeAmount: Number(data.coffeeAmount) || 18,
          yieldAmount: Number(data.yieldAmount) || 36,
          grindSize: String(data.grindSize || '2'),
          shotTimeSeconds: data.shotTimeSeconds ? Number(data.shotTimeSeconds) : undefined,
          notes: data.notes || '',
          isFavorite: Boolean(data.isFavorite),
          rating: data.rating ? Number(data.rating) : undefined,
          roastLevel: data.roastLevel || undefined,
          createdAt: data.createdAt || Date.now(),
          updatedAt: data.updatedAt || Date.now(),
        });
      });

      // Sort by createdAt descending (newest first)
      recipes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      onSuccess(recipes);
    },
    (err) => {
      console.error('Firestore subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Saves a new coffee recipe
 */
export async function addRecipe(userId: string, recipe: Omit<CoffeeRecipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = Date.now();
  const collectionRef = collection(db, 'users', userId, COLLECTION_NAME);
  const docRef = await addDoc(collectionRef, {
    ...recipe,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

/**
 * Updates an existing recipe
 */
export async function updateRecipe(userId: string, id: string, recipe: Partial<CoffeeRecipe>): Promise<void> {
  const docRef = doc(db, 'users', userId, COLLECTION_NAME, id);
  await setDoc(docRef, {
    ...recipe,
    updatedAt: Date.now(),
  }, { merge: true });
}

/**
 * Deletes a recipe
 */
export async function deleteRecipe(userId: string, id: string): Promise<void> {
  const docRef = doc(db, 'users', userId, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * Export recipes as JSON file
 */
export function exportRecipesAsJSON(recipes: CoffeeRecipe[]) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recipes, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `elvin-coffee-recipes-${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
