import { FilterOptions, SortOption } from '../types/recipe.ts';

export function renderSearchBar(
  container: HTMLElement,
  options: FilterOptions,
  onFilterChange: (newOptions: FilterOptions) => void,
  onAddClick: () => void,
  onCompassClick: () => void,
  onExportClick: () => void
) {
  container.className = 'toolbar-section';
  container.innerHTML = `
    <!-- Search Box -->
    <div class="search-box">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input 
        type="text" 
        class="search-input" 
        id="recipeSearchInput" 
        placeholder="Search beans, country origin, or notes..." 
        value="${options.query}"
      />
    </div>

    <!-- Actions & Sort -->
    <div class="toolbar-actions">
      <select class="select-custom" id="sortSelect" aria-label="Sort recipes">
        <option value="newest" ${options.sortBy === 'newest' ? 'selected' : ''}>Newest First</option>
        <option value="oldest" ${options.sortBy === 'oldest' ? 'selected' : ''}>Oldest First</option>
        <option value="dose" ${options.sortBy === 'dose' ? 'selected' : ''}>Dose Amount</option>
        <option value="name" ${options.sortBy === 'name' ? 'selected' : ''}>Bean Name (A-Z)</option>
      </select>

      <button type="button" class="btn-secondary" id="toolbarCompassBtn" title="Open Dialing Guide">
        🧭 Compass
      </button>

      <button type="button" class="btn-primary" id="toolbarAddBtn">
        + Add Recipe
      </button>

      <button type="button" class="btn-secondary" id="toolbarExportBtn" title="Export recipes to JSON" style="padding: 0.65rem 0.85rem;">
        📥
      </button>
    </div>
  `;

  const searchInput = container.querySelector('#recipeSearchInput') as HTMLInputElement;
  const sortSelect = container.querySelector('#sortSelect') as HTMLSelectElement;
  const addBtn = container.querySelector('#toolbarAddBtn') as HTMLButtonElement;
  const compassBtn = container.querySelector('#toolbarCompassBtn') as HTMLButtonElement;
  const exportBtn = container.querySelector('#toolbarExportBtn') as HTMLButtonElement;

  searchInput.addEventListener('input', (e) => {
    onFilterChange({
      ...options,
      query: (e.target as HTMLInputElement).value
    });
  });

  sortSelect.addEventListener('change', (e) => {
    onFilterChange({
      ...options,
      sortBy: (e.target as HTMLSelectElement).value as SortOption
    });
  });

  addBtn.addEventListener('click', onAddClick);
  compassBtn.addEventListener('click', onCompassClick);
  exportBtn.addEventListener('click', onExportClick);
}
