import { CoffeeRecipe } from '../types/recipe.ts';
import { getContrastTextColor, escapeHtml } from '../utils/contrast.ts';
import { calculateBrewRatio } from '../utils/espresso.ts';

export function createRecipeCard(
  recipe: CoffeeRecipe,
  onEdit: (recipe: CoffeeRecipe) => void,
  onDelete: (id: string) => void
): HTMLElement {
  const card = document.createElement('div');
  card.className = 'recipe-card';
  card.dataset.id = recipe.id;

  const bannerColor = recipe.bannerColor || '#6F4E37';
  const textColor = getContrastTextColor(bannerColor);
  const ratioInfo = calculateBrewRatio(recipe.coffeeAmount, recipe.yieldAmount);

  card.innerHTML = `
    <div class="card-banner" style="background-color: ${bannerColor}; color: ${textColor};">
      <h3 class="card-bean-name font-serif" style="color: ${textColor};">${escapeHtml(recipe.beanName)}</h3>
      <p class="card-origin" style="color: ${textColor};">${escapeHtml(recipe.country || '')}</p>
    </div>

    <div class="card-body">
      <!-- 3-Column Metrics -->
      <div class="metrics-row">
        <div class="metric-item">
          <span class="metric-label">Dose</span>
          <span class="metric-value">${recipe.coffeeAmount}g</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Grind</span>
          <span class="metric-value">${escapeHtml(recipe.grindSize)}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Yield</span>
          <span class="metric-value">${recipe.yieldAmount}g</span>
        </div>
      </div>

      <!-- Ratio & Shot Time Pill -->
      <div class="sub-metrics">
        <span class="ratio-badge ${ratioInfo.badgeClass}" title="Brew Ratio (${ratioInfo.style})">
          ⚖️ ${ratioInfo.ratioText} <small style="font-weight: 500;">(${ratioInfo.style})</small>
        </span>
        ${
          recipe.shotTimeSeconds
            ? `<span class="shot-time-badge" title="Extraction Duration">⏱️ ${recipe.shotTimeSeconds}s</span>`
            : ''
        }
      </div>

      <!-- Notes -->
      ${
        recipe.notes
          ? `
          <div class="card-notes">
            <div class="notes-label">Tasting Notes</div>
            <p class="notes-text">${escapeHtml(recipe.notes)}</p>
          </div>
        `
          : ''
      }

      <!-- Actions -->
      <div class="card-actions">
        <button class="btn-card-action edit-btn" data-id="${recipe.id}">
          ✏️ Edit
        </button>
        <button class="btn-card-action danger delete-btn" data-id="${recipe.id}">
          🗑️ Delete
        </button>
      </div>
    </div>
  `;

  // Attach event handlers
  const editBtn = card.querySelector('.edit-btn');
  const deleteBtn = card.querySelector('.delete-btn');

  if (editBtn) {
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onEdit(recipe);
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onDelete(recipe.id);
    });
  }

  return card;
}
