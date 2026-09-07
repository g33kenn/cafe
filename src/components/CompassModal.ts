import { DIAL_IN_GUIDES } from '../utils/espresso.ts';

export function createCompassModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'compassModalOverlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'compassModalTitle');

  overlay.innerHTML = `
    <div class="modal-card" style="max-width: 680px;">
      <div class="modal-header">
        <div>
          <h2 id="compassModalTitle" class="modal-title font-serif">Espresso Dialing Guide</h2>
          <p style="font-size: 0.82rem; color: var(--color-stone-muted); margin-top: 0.15rem;">
            Barista Hustle Compass for Breville Bambino & Fellow Opus
          </p>
        </div>
        <button type="button" class="modal-close-btn" id="compassCloseBtn" aria-label="Close compass">
          ✕
        </button>
      </div>

      <div class="modal-body" style="padding-top: 1rem;">
        <!-- Switchable Tabs -->
        <div class="compass-tabs">
          <button type="button" class="compass-tab-btn active" data-tab="assistant">
            🧭 Interactive Troubleshooter
          </button>
          <button type="button" class="compass-tab-btn" data-tab="chart">
            📐 Full Compass Chart
          </button>
        </div>

        <!-- Tab 1: Interactive Troubleshooter -->
        <div id="tabAssistant" class="compass-tab-content">
          <p style="font-size: 0.9rem; color: #5A4C42; margin-bottom: 0.85rem;">
            How did your last espresso shot taste? Select the closest sensation:
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem; margin-bottom: 1.25rem;">
            ${DIAL_IN_GUIDES.map((guide, idx) => `
              <button
                type="button"
                class="btn-secondary symptom-selector-btn ${idx === 0 ? 'active-symptom' : ''}"
                data-index="${idx}"
                style="padding: 0.6rem 0.75rem; text-align: left; font-size: 0.85rem; font-weight: 600; line-height: 1.3;"
              >
                ${guide.tasteCategory === 'sour' ? '🍋' : guide.tasteCategory === 'bitter' ? '🍫' : guide.tasteCategory === 'watery' ? '💧' : guide.tasteCategory === 'strong' ? '⚡' : '✨'}
                ${guide.symptom.split('(')[0].trim()}
              </button>
            `).join('')}
          </div>

          <!-- Dynamic Diagnosis Details -->
          <div class="diagnosis-card" id="diagnosisCard">
            <!-- Injected by JavaScript -->
          </div>
        </div>

        <!-- Tab 2: Full Compass Chart -->
        <div id="tabChart" class="compass-tab-content" style="display: none;">
          <div class="compass-img-container">
            <img
              src="/compass.webp"
              alt="The Espresso Compass by Barista Hustle"
              class="compass-img"
              loading="lazy"
            />
          </div>
          <p style="font-size: 0.75rem; color: var(--color-stone-muted); text-align: center; margin-top: 0.5rem;">
            Espresso Compass diagram by Barista Hustle. High-resolution WebP (104 KB).
          </p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('#compassCloseBtn') as HTMLButtonElement;
  const tabBtns = overlay.querySelectorAll('.compass-tab-btn');
  const tabAssistant = overlay.querySelector('#tabAssistant') as HTMLElement;
  const tabChart = overlay.querySelector('#tabChart') as HTMLElement;
  const diagnosisCard = overlay.querySelector('#diagnosisCard') as HTMLElement;
  const symptomBtns = overlay.querySelectorAll('.symptom-selector-btn');

  function renderDiagnosis(index: number) {
    const guide = DIAL_IN_GUIDES[index];
    if (!guide) return;

    diagnosisCard.innerHTML = `
      <div class="diagnosis-title font-serif">
        ${guide.symptom}
      </div>
      <p style="font-size: 0.88rem; color: var(--color-stone-muted); margin-bottom: 0.65rem;">
        ${guide.description}
      </p>

      <div style="background: #FFFFFF; padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid #EAE3D9; margin-bottom: 0.75rem;">
        <strong style="color: var(--color-espresso); font-size: 0.85rem;">Diagnosis:</strong>
        <span style="font-size: 0.85rem; color: #4A3E37;"> ${guide.diagnosis}</span>
      </div>

      <div style="margin-bottom: 0.75rem;">
        <strong style="font-size: 0.85rem; color: var(--color-espresso);">Recommended Adjustments:</strong>
        <ul class="diagnosis-actions-list">
          ${guide.actions.map(action => `<li>${action}</li>`).join('')}
        </ul>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem; border-top: 1px solid #E5DDD3; padding-top: 0.85rem;">
        <div>
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-coffee-primary); text-transform: uppercase;">
            ⚙️ Fellow Opus Setting
          </div>
          <div style="font-size: 0.82rem; color: #4A3E37; margin-top: 0.2rem;">
            ${guide.opusAdjustment}
          </div>
        </div>
        <div>
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-coffee-primary); text-transform: uppercase;">
            ☕ Breville Bambino Tip
          </div>
          <div style="font-size: 0.82rem; color: #4A3E37; margin-top: 0.2rem;">
            ${guide.bambinoTip}
          </div>
        </div>
      </div>
    `;
  }

  // Initial diagnosis render
  renderDiagnosis(0);

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = (btn as HTMLElement).dataset.tab;
      if (tab === 'assistant') {
        tabAssistant.style.display = 'block';
        tabChart.style.display = 'none';
      } else {
        tabAssistant.style.display = 'none';
        tabChart.style.display = 'block';
      }
    });
  });

  // Symptom selection
  symptomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      symptomBtns.forEach(b => (b as HTMLElement).style.borderColor = 'var(--color-border)');
      (btn as HTMLElement).style.borderColor = 'var(--color-coffee-primary)';
      const idx = parseInt((btn as HTMLElement).dataset.index || '0', 10);
      renderDiagnosis(idx);
    });
  });

  function open() {
    overlay.classList.add('open');
  }

  function close() {
    overlay.classList.remove('open');
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });

  return { open, close };
}
