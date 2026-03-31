/* ==========================================================================
   Scan Workflow Builder — Interactions
   ========================================================================== */

function toggleStep(headerEl) {
  const card = headerEl.closest('.step-card');
  const body = card.querySelector('.step-card-body');
  const toggle = card.querySelector('.step-toggle');

  card.classList.toggle('expanded');

  if (card.classList.contains('expanded')) {
    body.style.display = 'block';
    toggle.classList.replace('fa-chevron-down', 'fa-chevron-up');
  } else {
    body.style.display = 'none';
    toggle.classList.replace('fa-chevron-up', 'fa-chevron-down');
  }
}

function removeStep(btnEl) {
  const card = btnEl.closest('.step-card');
  card.style.opacity = '0';
  card.style.transform = 'translateX(-10px)';
  card.style.transition = 'opacity 0.2s, transform 0.2s';
  setTimeout(() => card.remove(), 200);
}

/* --- Conditional toggle groups --- */

function toggleConditional(checkboxEl, groupId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  if (checkboxEl.checked) {
    group.classList.remove('hidden');
  } else {
    group.classList.add('hidden');
  }
}

/* --- Dropdown --- */

function toggleDropdown(btnEl) {
  const wrapper = btnEl.closest('.add-step-wrapper');
  const dropdown = wrapper.querySelector('.step-dropdown');
  const isOpen = dropdown.classList.contains('open');

  closeAllDropdowns();

  if (!isOpen) {
    dropdown.classList.add('open');
    btnEl.classList.add('active');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.step-dropdown.open').forEach(d => {
    d.classList.remove('open');
    d.closest('.add-step-wrapper').querySelector('.add-step-btn').classList.remove('active');
  });
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.add-step-wrapper')) {
    closeAllDropdowns();
  }
});

/* --- Step templates with real config fields --- */

const stepTemplates = {
  'User Prompts': {
    icon: 'ti ti-user-question',
    html: `
      <div class="step-config">
        <p class="config-helper">Define fields the user must fill in before scanning. Use variable names in filename or metadata templates.</p>
        <table class="user-inputs-table">
          <thead><tr><th>Field title</th><th>Variable name</th><th>Type</th><th>Required</th><th></th></tr></thead>
          <tbody></tbody>
        </table>
        <button class="btn btn-text btn-primary btn-sm" onclick="addUserInputRow(this)">+ Add field</button>
      </div>`
  },
  'Data Extraction (OCR)': {
    icon: 'ti ti-text-recognition',
    html: `
      <div class="step-config">
        <div class="config-row"><span class="config-label">Language</span><div class="chip-group"><span class="chip">English <button class="chip-remove"><i class="fa-solid fa-xmark"></i></button></span></div></div>
        <div class="config-row"><span class="config-label">Detect page orientation</span><label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label></div>
        <div class="config-row"><span class="config-label">Change default OCR profile</span><label class="toggle"><input type="checkbox"><span class="toggle-slider"></span></label></div>
      </div>`
  },
  'Barcode Recognition': {
    icon: 'ti ti-barcode',
    html: `
      <div class="step-config">
        <div class="config-row"><span class="config-label">Barcode type</span><select class="select config-control"><option selected>Select barcode type</option><option>QR Code</option><option>Code 128</option><option>Code 39</option><option>EAN-13</option><option>Data Matrix</option></select></div>
        <p class="config-helper">You can access the barcode value with <code>{{barcode}}</code> variable.</p>
      </div>`
  },
  'Document Separation': {
    icon: 'ti ti-cut',
    html: `
      <div class="step-config">
        <div class="config-row"><span class="config-label">Separate using</span><select class="select config-control"><option selected>Choose One</option><option>Blank page</option><option>Barcode</option><option>Patch code</option></select></div>
      </div>`
  },
  'Highlighted Text Redaction': {
    icon: 'ti ti-highlight',
    html: `
      <div class="step-config">
        <div class="config-row"><span class="config-label">Highlighter color</span><select class="select config-control"><option selected>Select highlighter color</option><option>Yellow</option><option>Green</option><option>Pink</option><option>Blue</option></select></div>
        <div class="config-row"><span class="config-label">Search for highlighter</span><select class="select config-control"><option selected>In range of pages</option><option>All pages</option></select></div>
        <div class="config-row"><span class="config-label">From page</span><input class="input config-control" value="1"></div>
        <div class="config-row"><span class="config-label">To page</span><input class="input config-control" value="1"></div>
      </div>`
  },
  'Remove Blank Pages': {
    icon: 'ti ti-file-x',
    html: `
      <div class="step-config">
        <p class="config-helper">No additional configuration needed. Blank pages will be automatically detected and removed.</p>
      </div>`
  },
  'Split Dual Pages': {
    icon: 'ti ti-layout-columns',
    html: `
      <div class="step-config">
        <p class="config-helper">No additional configuration needed. Facing pages will be split into individual pages.</p>
      </div>`
  },
  'Despeckle': {
    icon: 'ti ti-sparkles',
    html: `
      <div class="step-config">
        <p class="config-helper">No additional configuration needed. Noise and specks will be removed from scanned images.</p>
      </div>`
  },
  'SMTP': {
    icon: 'ti ti-mail-forward',
    html: `
      <div class="step-config">
        <div class="config-row"><span class="config-label">Connector</span><select class="select config-control"><option selected>SMTP</option></select></div>
      </div>`
  },
  'OneDrive': {
    icon: 'ti ti-brand-onedrive',
    html: `
      <div class="step-config">
        <div class="config-row"><span class="config-label">Connector</span><select class="select config-control"><option selected>OneDrive</option></select></div>
      </div>`
  },
};

/* --- Add step from dropdown --- */

function addStepFromDropdown(itemEl, phase) {
  if (itemEl.classList.contains('disabled')) return;

  const name = itemEl.querySelector('.dropdown-item-name').textContent.trim();
  const template = stepTemplates[name];
  const iconClass = template ? template.icon : 'ti ti-settings';
  const bodyHtml = template ? template.html : '<div class="step-config"><p class="config-helper" style="color: var(--surface-400);">Configuration options will appear here</p></div>';

  const section = itemEl.closest('.pipeline-phase');
  const wrapper = section.querySelector('.add-step-wrapper');

  const card = document.createElement('div');
  card.className = 'step-card';
  card.innerHTML = `
    <div class="step-card-header" onclick="toggleStep(this)">
      <i class="fa-solid fa-chevron-down step-toggle"></i>
      <span class="drag-handle" title="Drag to reorder"><i class="ti ti-grip-vertical"></i></span>
      <i class="${iconClass} step-icon"></i>
      <div class="step-info">
        <span class="step-name">${name}</span>
      </div>
      <button class="btn-remove-step" onclick="event.stopPropagation(); removeStep(this)" title="Remove step">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="step-card-body">${bodyHtml}</div>
  `;

  card.style.opacity = '0';
  card.style.transform = 'translateY(-6px)';
  section.insertBefore(card, wrapper);
  requestAnimationFrame(() => {
    card.style.transition = 'opacity 0.2s, transform 0.2s';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });

  // Init drag handle on new card
  const newHandle = card.querySelector('.drag-handle');
  if (newHandle) initDragHandle(newHandle);

  closeAllDropdowns();
}

/* --- Drag & Drop reorder within section --- */

let draggedCard = null;

function initDragHandle(handle) {
  const card = handle.closest('.step-card');

  handle.addEventListener('mousedown', () => {
    card.setAttribute('draggable', 'true');
  });

  card.addEventListener('dragstart', (e) => {
    draggedCard = card;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    // Needed for Firefox
    e.dataTransfer.setData('text/plain', '');
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    card.removeAttribute('draggable');
    draggedCard = null;
    removePlaceholder();
  });
}

// Placeholder element
let placeholder = null;

function getPlaceholder() {
  if (!placeholder) {
    placeholder = document.createElement('div');
    placeholder.className = 'drop-placeholder';
  }
  return placeholder;
}

function removePlaceholder() {
  if (placeholder && placeholder.parentNode) {
    placeholder.parentNode.removeChild(placeholder);
  }
}

// Delegate dragover/drop to sections
document.addEventListener('dragover', (e) => {
  e.preventDefault();
  if (!draggedCard) return;

  const section = draggedCard.closest('.pipeline-phase');
  const cards = [...section.querySelectorAll('.step-card:not(.dragging)')];
  const afterCard = cards.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = e.clientY - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;

  const ph = getPlaceholder();
  const wrapper = section.querySelector('.add-step-wrapper');

  if (afterCard) {
    section.insertBefore(ph, afterCard);
  } else {
    section.insertBefore(ph, wrapper);
  }
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
  if (!draggedCard) return;

  const ph = getPlaceholder();
  if (ph.parentNode) {
    ph.parentNode.insertBefore(draggedCard, ph);
  }
  removePlaceholder();
});

// Init existing cards
function initAllDragHandles() {
  document.querySelectorAll('.drag-handle').forEach(initDragHandle);
}
document.addEventListener('DOMContentLoaded', initAllDragHandles);

// Patch addStepFromDropdown to add drag handle & init
const _origAddStep = addStepFromDropdown;

/* --- User inputs table helper --- */

function addUserInputRow(btnEl) {
  const tbody = btnEl.closest('.step-config').querySelector('tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input class="input input-sm" placeholder="e.g. Invoice number"></td>
    <td><input class="input input-sm" placeholder="e.g. invoiceNo"></td>
    <td><select class="select" style="font-size:12px;height:28px;padding:2px 6px"><option>Text</option><option>Number</option><option>Date</option></select></td>
    <td style="text-align:center"><input type="checkbox"></td>
    <td><button class="btn-remove-step" style="opacity:1" onclick="this.closest('tr').remove()"><i class="fa-solid fa-xmark"></i></button></td>
  `;
  tbody.appendChild(row);
}
