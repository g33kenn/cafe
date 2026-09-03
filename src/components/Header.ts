import { UserProfile } from '../types/recipe.ts';

export function renderHeader(
  container: HTMLElement, 
  user: UserProfile | null, 
  onSignIn: () => void, 
  onSignOut: () => void
) {
  const userHtml = user
    ? `
      <div class="user-profile-badge">
        ${user.photoURL ? `<img class="user-avatar" src="${user.photoURL}" alt="${user.displayName || 'User'}" />` : `<div class="user-avatar flex items-center justify-center">☕</div>`}
        <span class="user-name" title="${user.displayName || user.email || ''}">${user.displayName || 'Barista'}</span>
        <button id="signOutBtn" class="btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; margin-left: 0.25rem;">
          Sign Out
        </button>
      </div>
    `
    : `
      <button id="signInBtn" class="btn-secondary flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.218,44,30.606,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
        </svg>
        Sign in with Google
      </button>
    `;

  container.innerHTML = `
    <nav class="app-nav">
      <div class="brand-section">
        <div class="brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
        </div>
        <div>
          <div class="brand-title font-serif">Elvin's Café</div>
          <div class="brand-tagline">Breville Bambino & Fellow Opus</div>
        </div>
      </div>
      <div class="auth-group">
        ${userHtml}
      </div>
    </nav>

    <header class="hero-header">
      <h1 class="hero-title font-serif">Coffee Dial-in Notebook</h1>
      <div class="hero-equipment">
        <span>☕ Breville Bambino</span>
        <span>•</span>
        <span>⚙️ Fellow Opus</span>
      </div>
    </header>
  `;

  const signInBtn = container.querySelector('#signInBtn');
  const signOutBtn = container.querySelector('#signOutBtn');

  if (signInBtn) signInBtn.addEventListener('click', onSignIn);
  if (signOutBtn) signOutBtn.addEventListener('click', onSignOut);
}
