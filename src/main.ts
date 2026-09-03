import './styles/main.css';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './config/firebase.ts';
import { CoffeeRecipe, FilterOptions, UserProfile } from './types/recipe.ts';
import { 
  subscribeToRecipes, 
  addRecipe, 
  updateRecipe, 
  deleteRecipe, 
  exportRecipesAsJSON,
  DEMO_RECIPES 
} from './services/recipeService.ts';
import { renderHeader } from './components/Header.ts';
import { renderSearchBar } from './components/SearchBar.ts';
import { createRecipeCard } from './components/RecipeCard.ts';
import { createRecipeModal } from './components/RecipeModal.ts';
import { createCompassModal } from './components/CompassModal.ts';

// Global application state
let currentUser: UserProfile | null = null;
let allRecipes: CoffeeRecipe[] = [];
let unsubscribeFirestore: (() => void) | null = null;

let filterOptions: FilterOptions = {
  query: '',
  sortBy: 'newest',
};

// DOM Mount Points
const appElement = document.getElementById('app') as HTMLElement;
appElement.innerHTML = `
  <div class="app-container">
    <div id="headerMount"></div>
    <div id="guestNoticeMount"></div>
    <div id="toolbarMount"></div>
    <main id="recipesGrid" class="recipes-grid"></main>
    <div id="emptyStateMount" style="display: none; text-align: center; padding: 4rem 1rem;"></div>
  </div>
`;

const headerMount = document.getElementById('headerMount') as HTMLElement;
const guestNoticeMount = document.getElementById('guestNoticeMount') as HTMLElement;
const toolbarMount = document.getElementById('toolbarMount') as HTMLElement;
const recipesGrid = document.getElementById('recipesGrid') as HTMLElement;
const emptyStateMount = document.getElementById('emptyStateMount') as HTMLElement;

// Initialize Modals
const compassModal = createCompassModal();

const recipeModal = createRecipeModal(async (recipeData, id) => {
  if (!currentUser) {
    // If guest, update local list
    if (id) {
      allRecipes = allRecipes.map(r => r.id === id ? { ...r, ...recipeData, updatedAt: Date.now() } : r);
    } else {
      const newRecipe: CoffeeRecipe = {
        ...recipeData,
        id: `guest-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      allRecipes = [newRecipe, ...allRecipes];
    }
    renderApp();
    return;
  }

  if (id) {
    await updateRecipe(currentUser.uid, id, recipeData);
  } else {
    await addRecipe(currentUser.uid, recipeData);
  }
});

// Delete confirmation modal setup
function confirmAndDeleteRecipe(id: string) {
  const confirmed = window.confirm('Are you sure you want to delete this recipe?');
  if (!confirmed) return;

  if (!currentUser) {
    allRecipes = allRecipes.filter(r => r.id !== id);
    renderApp();
    return;
  }

  deleteRecipe(currentUser.uid, id).catch(err => {
    console.error('Error deleting recipe:', err);
    alert('Failed to delete recipe.');
  });
}

// Filter and Sort helper
function getFilteredAndSortedRecipes(): CoffeeRecipe[] {
  let list = [...allRecipes];

  // Filter by search query
  if (filterOptions.query.trim()) {
    const q = filterOptions.query.toLowerCase().trim();
    list = list.filter(r => 
      r.beanName.toLowerCase().includes(q) ||
      (r.country && r.country.toLowerCase().includes(q)) ||
      (r.notes && r.notes.toLowerCase().includes(q)) ||
      r.grindSize.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (filterOptions.sortBy) {
    case 'newest':
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      break;
    case 'oldest':
      list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      break;
    case 'dose':
      list.sort((a, b) => b.coffeeAmount - a.coffeeAmount);
      break;
    case 'name':
      list.sort((a, b) => a.beanName.localeCompare(b.beanName));
      break;
  }

  return list;
}

// Render Function
function renderApp() {
  // 1. Render Header
  renderHeader(
    headerMount, 
    currentUser, 
    handleGoogleSignIn, 
    handleSignOut
  );

  // 2. Render Guest Notice if logged out
  if (!currentUser) {
    guestNoticeMount.innerHTML = `
      <div style="background: #F4ECE1; border: 1px solid #E0D3C1; border-radius: var(--radius-md); padding: 0.85rem 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: gap; gap: 0.75rem;">
        <div style="font-size: 0.88rem; color: #4A3E37;">
          👋 <strong>Welcome to Elvin's Café!</strong> Viewing curated sample dial-ins. Sign in with Google to sync and keep your personal recipes safe across devices.
        </div>
        <button id="guestNoticeSignInBtn" class="btn-primary" style="padding: 0.45rem 0.95rem; font-size: 0.82rem; white-space: nowrap;">
          Sign In
        </button>
      </div>
    `;
    const noticeSignIn = guestNoticeMount.querySelector('#guestNoticeSignInBtn');
    if (noticeSignIn) noticeSignIn.addEventListener('click', handleGoogleSignIn);
  } else {
    guestNoticeMount.innerHTML = '';
  }

  // 3. Render Search & Action Toolbar
  renderSearchBar(
    toolbarMount,
    filterOptions,
    (newOptions) => {
      filterOptions = newOptions;
      renderRecipeList();
    },
    () => recipeModal.open(),
    () => compassModal.open(),
    () => exportRecipesAsJSON(allRecipes)
  );

  // 4. Render Recipe Cards
  renderRecipeList();
}

function renderRecipeList() {
  const visibleRecipes = getFilteredAndSortedRecipes();
  recipesGrid.innerHTML = '';

  if (visibleRecipes.length === 0) {
    emptyStateMount.style.display = 'block';
    emptyStateMount.innerHTML = `
      <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">☕</div>
      <h3 class="font-serif" style="font-size: 1.3rem; font-weight: 700; color: var(--color-espresso);">
        No recipes found
      </h3>
      <p style="font-size: 0.9rem; color: var(--color-stone-muted); margin-top: 0.25rem; margin-bottom: 1.25rem;">
        ${filterOptions.query ? `No coffee recipes match "${filterOptions.query}".` : 'Get started by dialing in your first coffee recipe!'}
      </p>
      <button type="button" class="btn-primary" id="emptyStateAddBtn">
        + Add New Recipe
      </button>
    `;
    const emptyAdd = emptyStateMount.querySelector('#emptyStateAddBtn');
    if (emptyAdd) emptyAdd.addEventListener('click', () => recipeModal.open());
  } else {
    emptyStateMount.style.display = 'none';
    visibleRecipes.forEach(recipe => {
      const card = createRecipeCard(
        recipe,
        (r) => recipeModal.open(r),
        (id) => confirmAndDeleteRecipe(id)
      );
      recipesGrid.appendChild(card);
    });
  }
}

// Authentication Handlers
async function handleGoogleSignIn() {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err: unknown) {
    console.error('Google Sign-in error:', err);
    alert('Sign-in failed. Please ensure popups are permitted in your browser.');
  }
}

async function handleSignOut() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign-out error:', err);
  }
}

// Authentication Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    if (unsubscribeFirestore) unsubscribeFirestore();

    unsubscribeFirestore = subscribeToRecipes(
      user.uid,
      (recipes) => {
        allRecipes = recipes;
        renderApp();
      },
      () => {
        // In case of error (e.g. offline with empty cache), keep existing
        renderApp();
      }
    );
  } else {
    currentUser = null;
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
      unsubscribeFirestore = null;
    }
    // Fall back to curated demo recipes
    allRecipes = [...DEMO_RECIPES];
    renderApp();
  }
});
