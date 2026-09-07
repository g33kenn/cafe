import { CoffeeRecipe } from '../types/recipe.ts';
import { calculateBrewRatio } from '../utils/espresso.ts';

export function createRecipeModal(
  onSave: (recipeData: Omit<CoffeeRecipe, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => Promise<void>
) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'recipeModalOverlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modalTitle');

  overlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h2 id="modalTitle" class="modal-title font-serif">Add New Recipe</h2>
        <button type="button" class="modal-close-btn" id="modalCloseBtn" aria-label="Close modal">
          ✕
        </button>
      </div>

      <form id="recipeForm" class="modal-body">
        <input type="hidden" id="formRecipeId" />

        <!-- Bean Name -->
        <div class="form-group">
          <label class="form-label" for="formBeanName">Coffee Bean / Blend Name *</label>
          <input
            type="text"
            id="formBeanName"
            class="form-input"
            required
            placeholder="e.g., Ethiopian Yirgacheffe G1"
          />
        </div>

        <!-- Origin / Country -->
        <div class="form-group">
          <label class="form-label" for="formCountry">Origin / Processing</label>
          <input
            type="text"
            id="formCountry"
            class="form-input"
            placeholder="e.g., Ethiopia, Washed"
          />
        </div>

        <!-- Banner Color -->
        <div class="form-group">
          <label class="form-label" for="formBannerColor">Card Banner Accent Color</label>
          <div class="color-picker-row">
            <input type="color" id="formBannerColor" value="#6F4E37" />
            <span style="font-size: 0.85rem; color: var(--color-stone-muted);">
              Pick a color reflecting the roast or flavor note
            </span>
          </div>
        </div>

        <!-- Banner Text Color Option -->
        <div class="form-group">
          <label class="form-label">Banner Text Color</label>
          <div class="text-color-toggle-group" style="display: flex; gap: 1rem; align-items: center; margin-top: 0.25rem;">
            <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; cursor: pointer; color: var(--color-espresso);">
              <input type="radio" name="formBannerTextColor" value="black" id="textColorBlack" />
              <span>Black</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; cursor: pointer; color: var(--color-espresso);">
              <input type="radio" name="formBannerTextColor" value="white" id="textColorWhite" />
              <span>White</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer; color: var(--color-stone-muted);">
              <input type="radio" name="formBannerTextColor" value="auto" id="textColorAuto" checked />
              <span>Auto</span>
            </label>
          </div>
        </div>

        <!-- Dial-in Parameters Grid -->
        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label" for="formCoffeeAmount">Dose (g) *</label>
            <input
              type="number"
              id="formCoffeeAmount"
              class="form-input"
              step="0.1"
              min="5"
              max="40"
              required
              placeholder="18.0"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="formGrindSize">Opus Grind *</label>
            <input
              type="text"
              id="formGrindSize"
              class="form-input"
              required
              placeholder="e.g. 2.1"
              title="Fellow Opus Macro & Micro (e.g. 2.0, 2.1, 2+)"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="formYieldAmount">Yield (g) *</label>
            <input
              type="number"
              id="formYieldAmount"
              class="form-input"
              step="0.1"
              min="5"
              max="150"
              required
              placeholder="36.0"
            />
          </div>
        </div>

        <!-- Real-Time Ratio Preview -->
        <div class="ratio-preview-box" id="ratioPreviewBox">
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-espresso);">
            Computed Ratio:
          </span>
          <span id="ratioPreviewText" class="ratio-badge ratio-badge-espresso">
            ⚖️ 1:2.0 (Espresso)
          </span>
        </div>

        <!-- Shot Duration with Built-in Stopwatch -->
        <div class="form-group" style="margin-top: 1.25rem;">
          <label class="form-label" for="formShotTime">Extraction Duration (Seconds)</label>
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <input
              type="number"
              id="formShotTime"
              class="form-input"
              step="1"
              min="5"
              max="120"
              placeholder="e.g., 28"
              style="flex: 1;"
            />
          </div>

          <!-- Bambino Shot Timer -->
          <div class="shot-timer-section">
            <div>
              <div style="font-size: 0.75rem; font-weight: 600; color: var(--color-stone-muted); text-transform: uppercase;">
                Bambino Shot Timer
              </div>
              <div class="timer-display" id="timerDisplay">00.0s</div>
            </div>
            <button type="button" class="btn-timer-toggle" id="btnTimerToggle">
              ▶ Start Timer
            </button>
          </div>
        </div>

        <!-- Tasting Notes -->
        <div class="form-group">
          <label class="form-label" for="formNotes">Tasting Notes & Observations</label>
          <textarea
            id="formNotes"
            class="form-textarea"
            rows="3"
            placeholder="e.g., Bright peach aroma, caramel sweetness, smooth crema. Pre-infusion 6s."
          ></textarea>
        </div>

        <!-- Modal Actions -->
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; border-top: 1px solid var(--color-border); padding-top: 1rem;">
          <button type="button" class="btn-secondary" id="modalCancelBtn">Cancel</button>
          <button type="submit" class="btn-primary" id="modalSubmitBtn">Save Recipe</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  // Form DOM elements
  const form = overlay.querySelector('#recipeForm') as HTMLFormElement;
  const modalTitle = overlay.querySelector('#modalTitle') as HTMLHeadingElement;
  const closeBtn = overlay.querySelector('#modalCloseBtn') as HTMLButtonElement;
  const cancelBtn = overlay.querySelector('#modalCancelBtn') as HTMLButtonElement;
  const submitBtn = overlay.querySelector('#modalSubmitBtn') as HTMLButtonElement;

  const idInput = overlay.querySelector('#formRecipeId') as HTMLInputElement;
  const beanInput = overlay.querySelector('#formBeanName') as HTMLInputElement;
  const countryInput = overlay.querySelector('#formCountry') as HTMLInputElement;
  const colorInput = overlay.querySelector('#formBannerColor') as HTMLInputElement;
  const textColorBlack = overlay.querySelector('#textColorBlack') as HTMLInputElement;
  const textColorWhite = overlay.querySelector('#textColorWhite') as HTMLInputElement;
  const textColorAuto = overlay.querySelector('#textColorAuto') as HTMLInputElement;
  const coffeeInput = overlay.querySelector('#formCoffeeAmount') as HTMLInputElement;
  const grindInput = overlay.querySelector('#formGrindSize') as HTMLInputElement;
  const yieldInput = overlay.querySelector('#formYieldAmount') as HTMLInputElement;
  const shotTimeInput = overlay.querySelector('#formShotTime') as HTMLInputElement;
  const notesInput = overlay.querySelector('#formNotes') as HTMLTextAreaElement;

  const ratioPreviewText = overlay.querySelector('#ratioPreviewText') as HTMLElement;

  // Shot Timer state
  let timerInterval: number | null = null;
  let timerStartTime: number = 0;
  const timerDisplay = overlay.querySelector('#timerDisplay') as HTMLElement;
  const btnTimerToggle = overlay.querySelector('#btnTimerToggle') as HTMLButtonElement;

  function updateTimer() {
    const elapsedMs = Date.now() - timerStartTime;
    const seconds = (elapsedMs / 1000).toFixed(1);
    timerDisplay.textContent = `${seconds}s`;
  }

  function toggleTimer() {
    if (timerInterval) {
      // Stop timer
      clearInterval(timerInterval);
      timerInterval = null;
      btnTimerToggle.textContent = '▶ Restart';
      btnTimerToggle.classList.remove('running');
      const finalSec = Math.round((Date.now() - timerStartTime) / 1000);
      shotTimeInput.value = String(finalSec);
    } else {
      // Start timer
      timerStartTime = Date.now();
      btnTimerToggle.textContent = '⏹ Stop (Auto-fill)';
      btnTimerToggle.classList.add('running');
      timerInterval = window.setInterval(updateTimer, 100);
    }
  }

  function resetTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    btnTimerToggle.textContent = '▶ Start Timer';
    btnTimerToggle.classList.remove('running');
    timerDisplay.textContent = '00.0s';
  }

  btnTimerToggle.addEventListener('click', toggleTimer);

  // Live Ratio Calculation Preview
  function updateRatioPreview() {
    const dose = parseFloat(coffeeInput.value);
    const yld = parseFloat(yieldInput.value);
    const info = calculateBrewRatio(dose, yld);
    ratioPreviewText.className = `ratio-badge ${info.badgeClass}`;
    ratioPreviewText.textContent = `⚖️ ${info.ratioText} (${info.style})`;
  }

  coffeeInput.addEventListener('input', updateRatioPreview);
  yieldInput.addEventListener('input', updateRatioPreview);

  function open(recipe?: CoffeeRecipe) {
    resetTimer();
    form.reset();

    if (recipe) {
      modalTitle.textContent = 'Edit Coffee Recipe';
      idInput.value = recipe.id;
      beanInput.value = recipe.beanName;
      countryInput.value = recipe.country || '';
      colorInput.value = recipe.bannerColor || '#6F4E37';
      if (recipe.bannerTextColor === 'black') {
        textColorBlack.checked = true;
      } else if (recipe.bannerTextColor === 'white') {
        textColorWhite.checked = true;
      } else {
        textColorAuto.checked = true;
      }
      coffeeInput.value = String(recipe.coffeeAmount);
      grindInput.value = recipe.grindSize;
      yieldInput.value = String(recipe.yieldAmount);
      shotTimeInput.value = recipe.shotTimeSeconds ? String(recipe.shotTimeSeconds) : '';
      notesInput.value = recipe.notes || '';
    } else {
      modalTitle.textContent = 'Add a New Recipe';
      idInput.value = '';
      colorInput.value = '#6F4E37';
      textColorAuto.checked = true;
      coffeeInput.value = '18.0';
      grindInput.value = '2.1';
      yieldInput.value = '36.0';
    }

    updateRatioPreview();
    overlay.classList.add('open');
    beanInput.focus();
  }

  function close() {
    resetTimer();
    overlay.classList.remove('open');
  }

  // Close handlers
  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });

  // Submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    let selectedTextColor: 'black' | 'white' | undefined = undefined;
    if (textColorBlack.checked) {
      selectedTextColor = 'black';
    } else if (textColorWhite.checked) {
      selectedTextColor = 'white';
    }

    const recipeData: Omit<CoffeeRecipe, 'id' | 'createdAt' | 'updatedAt'> = {
      beanName: beanInput.value.trim(),
      country: countryInput.value.trim() || undefined,
      bannerColor: colorInput.value,
      bannerTextColor: selectedTextColor,
      coffeeAmount: parseFloat(coffeeInput.value) || 18,
      grindSize: grindInput.value.trim() || '2.0',
      yieldAmount: parseFloat(yieldInput.value) || 36,
      shotTimeSeconds: shotTimeInput.value ? parseInt(shotTimeInput.value, 10) : undefined,
      notes: notesInput.value.trim() || undefined,
    };

    const id = idInput.value || undefined;

    try {
      await onSave(recipeData, id);
      close();
    } catch (err) {
      console.error('Failed to save recipe:', err);
      alert('Failed to save recipe. Please check your connection and try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Recipe';
    }
  });

  return { open, close };
}
