/* ==========================================================================
   ne.Hub — Quote Form — Interactivity (1:1 match with JSX)
   ========================================================================== */

const state = {
  product: 'pro',
  term: '12',
  printQty: 20,
  mfpQty: 20,
  cardReaders: false,
  cardReaderQty: 20,
  savedQuotes: [],
};

// ---- Views ----

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
  document.getElementById('view-' + name).style.display = '';
  if (name === 'form') updateForm();
}

function closeForm() {
  showView(state.savedQuotes.length > 0 ? 'detail' : 'landing');
}

// ---- Product selector ----

document.getElementById('product-selector').addEventListener('click', function(e) {
  const btn = e.target.closest('.sb-opt');
  if (!btn) return;
  this.querySelectorAll('.sb-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.product = btn.dataset.value;
  updateForm();
});

// ---- Spinner ----

function spinValue(inputId, delta) {
  const input = document.getElementById(inputId);
  const val = Math.max(0, (parseInt(input.value) || 0) + delta);
  input.value = val;
  writeStateFromInput(inputId, val);
  updateForm();
}

// ---- Direct typed input ----

function onNumInput(inputId) {
  const input = document.getElementById(inputId);
  // strip non-digits
  const cleaned = input.value.replace(/[^0-9]/g, '');
  if (cleaned !== input.value) input.value = cleaned;
  const val = cleaned === '' ? 0 : parseInt(cleaned);
  writeStateFromInput(inputId, val);
  updateForm();
}

function writeStateFromInput(inputId, val) {
  if (inputId === 'print-qty') state.printQty = val;
  if (inputId === 'mfp-qty') state.mfpQty = val;
  if (inputId === 'card-reader-qty') state.cardReaderQty = val;
}

// ---- Toggles ----

function toggleCardReaders() {
  state.cardReaders = document.getElementById('card-readers-toggle').checked;
  document.getElementById('card-reader-options').style.display = state.cardReaders ? '' : 'none';
  updateForm();
}

function toggleAdvanced() {
  const section = document.getElementById('advanced-options');
  const chevron = document.getElementById('advanced-chevron');
  const visible = section.style.display !== 'none';
  section.style.display = visible ? 'none' : '';
  chevron.style.transform = visible ? '' : 'rotate(180deg)';
}

function toggleComparison() {
  const section = document.getElementById('comparison-section');
  const chevron = document.getElementById('comparison-chevron');
  const visible = section.style.display !== 'none';
  section.style.display = visible ? 'none' : '';
  chevron.style.transform = visible ? '' : 'rotate(180deg)';
  if (!visible) renderComparison();
}

function matchCardReaders() {
  document.getElementById('card-reader-qty').value = state.mfpQty;
  state.cardReaderQty = state.mfpQty;
  updateForm();
}

function toggleCustomDate() {
  const isCustom = document.querySelector('input[name="start-date"][value="custom"]').checked;
  const picker = document.getElementById('custom-date-picker');
  picker.style.display = isCustom ? '' : 'none';
  if (isCustom && !document.getElementById('custom-start-date').value) {
    document.getElementById('custom-start-date').value = new Date().toISOString().split('T')[0];
  }
  updateForm();
}

// ---- Pricing ----

function calculatePricing(config) {
  const { product, term, printQty, mfpQty, cardReaders, cardReaderQty } = config;
  const basePrice = product === 'pro' ? 60 : 40;
  const termMonths = parseInt(term);
  const lines = [];

  const sku = product === 'pro' ? 'YSQLP-000-1P02-A' : 'YSQLP-000-1B02-A';
  const productName = product === 'pro' ? 'YSoft SAFEQ Cloud Pro' : 'YSoft SAFEQ Cloud Breeze';

  lines.push({
    sku,
    name: productName + ' - Print (1-49)',
    term: termMonths + ' months (Fixed term)',
    qty: printQty,
    purchase: printQty * basePrice,
    selling: printQty * Math.round(basePrice * 1.16),
  });

  lines.push({
    sku,
    name: productName + ' - MFP (1-49)',
    term: termMonths + ' months (Fixed term)',
    qty: mfpQty,
    purchase: mfpQty * basePrice,
    selling: mfpQty * Math.round(basePrice * 1.16),
  });

  if (cardReaders) {
    lines.push({
      sku: 'YSHW-CR-MFX4-A',
      name: 'Card readers',
      term: null,
      qty: cardReaderQty,
      purchase: cardReaderQty * 10,
      selling: Math.round(cardReaderQty * 15),
    });
  }

  return lines;
}

// ---- Render ----

function updateForm() {
  state.term = document.getElementById('term-select').value;

  const pricing = calculatePricing(state);
  const totalPurchase = pricing.reduce((s, l) => s + l.purchase, 0);
  const totalSelling = pricing.reduce((s, l) => s + l.selling, 0);

  // Pricing rows
  document.getElementById('pricing-rows').innerHTML = pricing.map(line => `
    <div class="pricing-row">
      <div class="col-item">
        <p class="pricing-sku">${line.sku}</p>
        <p class="pricing-name">${line.name}</p>
        ${line.term ? '<p class="pricing-term">' + line.term + '</p>' : ''}
      </div>
      <div class="col-qty">${line.qty}</div>
      <div class="col-num">${line.purchase} EUR</div>
      <div class="col-num">${line.selling} EUR</div>
    </div>
  `).join('');

  document.getElementById('total-purchase').textContent = totalPurchase + ' EUR';
  document.getElementById('total-selling').textContent = totalSelling + ' EUR';

  // Term hint
  const d = new Date();
  d.setMonth(d.getMonth() + parseInt(state.term));
  document.getElementById('term-hint').textContent = 'Ends ' + d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  // Order date hint
  const orderHint = document.getElementById('order-date-hint');
  if (orderHint) {
    const endD = new Date(Date.now() + parseInt(state.term) * 30 * 24 * 60 * 60 * 1000);
    orderHint.textContent = 'Ends ' + endD.toLocaleDateString('en-GB') + ' if completed today';
  }

  // Mismatch warning + Match button (visible only when values differ)
  const warn = document.getElementById('mismatch-warning');
  const matchBtn = document.getElementById('match-btn');
  const mismatch = state.cardReaders && state.cardReaderQty !== state.mfpQty;
  if (mismatch) {
    warn.style.display = 'flex';
    document.getElementById('mismatch-text').textContent = "Doesn't match MFP count (" + state.mfpQty + ")";
    if (matchBtn) matchBtn.style.display = '';
  } else {
    warn.style.display = 'none';
    if (matchBtn) matchBtn.style.display = 'none';
  }

  // Comparison if visible
  if (document.getElementById('comparison-section').style.display !== 'none') {
    renderComparison();
  }
}

// ---- Alternatives state ----

const altVariations = new Set();

function renderComparison() {
  const versions = [
    { term: '12', label: '1 year' },
    { term: '36', label: '3 years' },
    { term: '60', label: '5 years' },
  ];
  const productLabel = state.product === 'pro' ? 'SAFEQ Cloud PRO' : 'SAFEQ Cloud Breeze';
  const baseTotal = calculatePricing({ ...state, term: '12' }).reduce((s, l) => s + l.selling, 0);

  const summary = [state.printQty + ' PRINT', state.mfpQty + ' MFP'];
  if (state.cardReaders) summary.push(state.cardReaderQty + ' Card readers');
  const summaryText = summary.join(', ');

  const saveIcon = '<i class="pi pi-download"></i>';

  let rows = versions.map(v => {
    const p = calculatePricing({ ...state, term: v.term });
    const total = p.reduce((s, l) => s + l.selling, 0);
    const saving = v.term !== '12' ? Math.round((1 - total / (baseTotal * parseInt(v.term) / 12)) * 100) : 0;
    const savingHtml = saving > 0 ? `<span style="font-family:'Lab Grotesque',sans-serif;font-size:12px;font-weight:600;color:#16a34a;margin-right:4px">-${saving}%</span>` : '';

    return `<div class="comparison-row">
      <div style="flex:1">
        <span>${productLabel} - ${v.label}</span>
        <p style="margin:2px 0 0;font-size:12px;color:#64748b">${summaryText}</p>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        ${savingHtml}<span style="font-weight:700">${total} EUR</span>
        <button onclick="saveComparisonQuote('${v.term}','${state.product}')" style="background:transparent;border:none;cursor:pointer;color:#64748b;display:inline-flex;align-items:center;padding:4px" title="Save quote">${saveIcon}</button>
      </div>
    </div>`;
  });

  // Added variations
  if (altVariations.has('breeze')) {
    const altProduct = state.product === 'pro' ? 'breeze' : 'pro';
    const altLabel = altProduct === 'pro' ? 'SAFEQ Cloud PRO' : 'SAFEQ Cloud Breeze';
    versions.forEach(v => {
      const p = calculatePricing({ ...state, product: altProduct, term: v.term });
      const total = p.reduce((s, l) => s + l.selling, 0);
      const saving = Math.round((1 - total / baseTotal) * 100);
      const savingHtml = saving > 0 ? `<span style="font-family:'Lab Grotesque',sans-serif;font-size:12px;font-weight:600;color:#16a34a;margin-right:4px">-${Math.abs(saving)}%</span>` : '';
      rows.push(`<div class="comparison-row">
        <div style="flex:1">
          <span>${altLabel} - ${v.label}</span>
          <p style="margin:2px 0 0;font-size:12px;color:#64748b">${summaryText}</p>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          ${savingHtml}<span style="font-weight:700">${total} EUR</span>
          <button onclick="saveComparisonQuote('${v.term}','${altProduct}')" style="background:transparent;border:none;cursor:pointer;color:#64748b;display:inline-flex;align-items:center;padding:4px" title="Save quote">${saveIcon}</button>
        </div>
      </div>`);
    });
  }

  if (altVariations.has('direct')) {
    versions.forEach(v => {
      const p = calculatePricing({ ...state, term: v.term });
      const total = p.reduce((s, l) => s + l.selling, 0);
      const withDirect = Math.round(total * 1.05);
      const diffPct = Math.round((withDirect / baseTotal - 1) * 100);
      const diffHtml = diffPct > 0 ? `<span style="font-family:'Lab Grotesque',sans-serif;font-size:12px;font-weight:600;color:#64748b;margin-right:4px">+${diffPct}%</span>` : '';
      rows.push(`<div class="comparison-row">
        <div style="flex:1">
          <span>${productLabel} + Direct support - ${v.label}</span>
          <p style="margin:2px 0 0;font-size:12px;color:#64748b">${summaryText}</p>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          ${diffHtml}<span style="font-weight:700">${withDirect} EUR</span>
          <button onclick="saveComparisonQuote('${v.term}','${state.product}')" style="background:transparent;border:none;cursor:pointer;color:#64748b;display:inline-flex;align-items:center;padding:4px" title="Save quote">${saveIcon}</button>
        </div>
      </div>`);
    });
  }

  if (altVariations.has('professional')) {
    versions.forEach(v => {
      const p = calculatePricing({ ...state, term: v.term });
      const total = p.reduce((s, l) => s + l.selling, 0);
      const withProf = Math.round(total * 1.18);
      const diffPct = Math.round((withProf / baseTotal - 1) * 100);
      const diffHtml = diffPct > 0 ? `<span style="font-family:'Lab Grotesque',sans-serif;font-size:12px;font-weight:600;color:#64748b;margin-right:4px">+${diffPct}%</span>` : '';
      rows.push(`<div class="comparison-row">
        <div style="flex:1">
          <span>${productLabel} + Professional services - ${v.label}</span>
          <p style="margin:2px 0 0;font-size:12px;color:#64748b">${summaryText}</p>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          ${diffHtml}<span style="font-weight:700">${withProf} EUR</span>
          <button onclick="saveComparisonQuote('${v.term}','${state.product}')" style="background:transparent;border:none;cursor:pointer;color:#64748b;display:inline-flex;align-items:center;padding:4px" title="Save quote">${saveIcon}</button>
        </div>
      </div>`);
    });
  }

  document.getElementById('comparison-rows').innerHTML = rows.join('');

  // Render tags
  const gearIcon = '<i class="pi pi-cog"></i>';
  const tagStyle = 'font-family:\'Lab Grotesque\',sans-serif;font-size:12px;font-weight:500;padding:6px 10px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;background:#fff;color:#475569;border:1px solid #e2e8f0';
  const altProduct = state.product === 'pro' ? 'Breeze' : 'Pro';

  const tags = [];
  if (!altVariations.has('breeze')) tags.push(`<button onclick="addAltVariation('breeze')" style="${tagStyle}">${gearIcon} Show SAFEQ Cloud ${altProduct} variation</button>`);
  if (!altVariations.has('direct')) tags.push(`<button onclick="addAltVariation('direct')" style="${tagStyle}">${gearIcon} Show SAFEQ Cloud ${state.product === 'pro' ? 'Pro' : 'Breeze'} with Direct support variation</button>`);
  if (!altVariations.has('professional')) tags.push(`<button onclick="addAltVariation('professional')" style="${tagStyle}">${gearIcon} Show SAFEQ Cloud ${state.product === 'pro' ? 'Pro' : 'Breeze'} with Professional services variation</button>`);
  document.getElementById('alt-tags').innerHTML = tags.join('');
}

function addAltVariation(type) {
  altVariations.add(type);
  renderComparison();
}

function saveComparisonQuote(term, product) {
  const origTerm = state.term;
  const origProduct = state.product;
  state.term = term;
  state.product = product;

  const productName = state.product === 'pro' ? 'SAFEQ Cloud PRO' : 'SAFEQ Cloud Breeze';
  const termLabel = term === '12' ? '1 year' : term === '36' ? '3 years' : '5 years';
  const pricing = calculatePricing(state);
  state.savedQuotes.push({
    id: Date.now(),
    name: productName + ' - ' + termLabel,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }),
    purchase: pricing.reduce((s, l) => s + l.purchase, 0),
    selling: pricing.reduce((s, l) => s + l.selling, 0),
    config: {
      product: state.product,
      term: state.term,
      printQty: state.printQty,
      mfpQty: state.mfpQty,
      cardReaders: state.cardReaders,
      cardReaderQty: state.cardReaderQty,
    },
  });
  persistQuotes();
  renderQuotesList();

  state.term = origTerm;
  state.product = origProduct;

  showToast(productName + ' - ' + termLabel + ' saved');
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.innerHTML = `
    <i class="pi pi-check-circle toast-icon"></i>
    <div class="toast-content">
      <div class="toast-summary">Quote saved</div>
      <div class="toast-detail">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()"><i class="pi pi-times"></i></button>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ---- Save quotes ----

function persistQuotes() {
  localStorage.setItem('ne-hub-quotes', JSON.stringify(state.savedQuotes));
}

function loadQuotes() {
  try {
    const saved = localStorage.getItem('ne-hub-quotes');
    if (saved) state.savedQuotes = JSON.parse(saved);
  } catch (e) {}
}

function saveQuote() {
  const productName = state.product === 'pro' ? 'SAFEQ Cloud PRO' : 'SAFEQ Cloud Breeze';
  const termLabel = state.term === '12' ? '1 year' : state.term === '36' ? '3 years' : '5 years';
  const pricing = calculatePricing(state);
  state.savedQuotes.push({
    id: Date.now(),
    name: productName + ' - ' + termLabel,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' }),
    purchase: pricing.reduce((s, l) => s + l.purchase, 0),
    selling: pricing.reduce((s, l) => s + l.selling, 0),
    config: {
      product: state.product,
      term: state.term,
      printQty: state.printQty,
      mfpQty: state.mfpQty,
      cardReaders: state.cardReaders,
      cardReaderQty: state.cardReaderQty,
    },
  });
  persistQuotes();
  renderQuotesList();
  showView('detail');
}

function saveAllVersions() {
  const productName = state.product === 'pro' ? 'SAFEQ Cloud PRO' : 'SAFEQ Cloud Breeze';
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });
  [
    { term: '12', label: '1 year' },
    { term: '36', label: '3 years' },
    { term: '60', label: '5 years' },
  ].forEach(v => {
    const p = calculatePricing({ ...state, term: v.term });
    state.savedQuotes.push({
      id: Date.now() + parseInt(v.term),
      name: productName + ' - ' + v.label,
      date: dateStr,
      purchase: p.reduce((s, l) => s + l.purchase, 0),
      selling: p.reduce((s, l) => s + l.selling, 0),
      config: {
        product: state.product,
        term: v.term,
        printQty: state.printQty,
        mfpQty: state.mfpQty,
        cardReaders: state.cardReaders,
        cardReaderQty: state.cardReaderQty,
      },
    });
  });
  persistQuotes();
  renderQuotesList();
  showView('detail');
}

function loadQuote(id) {
  const q = state.savedQuotes.find(q => q.id === id);
  if (!q || !q.config) return;
  state.product = q.config.product;
  state.term = q.config.term;
  state.printQty = q.config.printQty;
  state.mfpQty = q.config.mfpQty;
  state.cardReaders = q.config.cardReaders;
  state.cardReaderQty = q.config.cardReaderQty;

  // Sync UI controls
  document.querySelectorAll('#product-selector .sb-opt').forEach(b => {
    b.classList.toggle('active', b.dataset.value === state.product);
  });
  document.getElementById('term-select').value = state.term;
  document.getElementById('print-qty').value = state.printQty;
  document.getElementById('mfp-qty').value = state.mfpQty;
  document.getElementById('card-readers-toggle').checked = state.cardReaders;
  document.getElementById('card-reader-options').style.display = state.cardReaders ? '' : 'none';
  document.getElementById('card-reader-qty').value = state.cardReaderQty;

  showView('form');
}

function deleteQuote(id) {
  state.savedQuotes = state.savedQuotes.filter(q => q.id !== id);
  persistQuotes();
  renderQuotesList();
}

function renderQuotesList() {
  const container = document.getElementById('quotes-list');
  if (state.savedQuotes.length === 0) {
    container.innerHTML = '<p style="margin:16px 0 0;font-size:12px;color:#64748b">No quotes yet</p>';
    return;
  }
  container.innerHTML = state.savedQuotes.map(q => `
    <div class="quote-item">
      <div class="quote-item-info" onclick="loadQuote(${q.id})" style="cursor:pointer">
        <p class="quote-item-name">${q.name}</p>
        <p class="quote-item-date">${q.date} &middot; ${q.selling} EUR</p>
      </div>
      <button class="btn btn-secondary btn-icon">
        <i class="pi pi-download"></i>
      </button>
      <div style="position:relative">
        <button onclick="toggleContextMenu(${q.id}, event)" class="btn btn-secondary btn-icon">
          <i class="pi pi-ellipsis-h"></i>
        </button>
        <div class="ctx-menu" id="ctx-${q.id}" style="display:none">
          <div class="ctx-menu-header">Actions</div>
          <div class="ctx-menu-item" onclick="loadQuote(${q.id})"><i class="pi pi-pencil"></i> Edit</div>
          <div class="ctx-menu-item" onclick="closeContextMenus()"><i class="pi pi-copy"></i> Duplicate</div>
          <div class="ctx-menu-item" onclick="deleteQuote(${q.id})"><i class="pi pi-trash"></i> Delete</div>
          <div class="ctx-menu-item" onclick="closeContextMenus()"><i class="pi pi-table"></i> Convert to order?</div>
          <div class="ctx-menu-item" onclick="closeContextMenus()"><i class="pi pi-cog"></i> Generate version for SAFEQ Cloud Breeze</div>
          <div class="ctx-menu-item" onclick="closeContextMenus()"><i class="pi pi-cog"></i> Generate version for Direct support</div>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleContextMenu(id, e) {
  e.stopPropagation();
  closeContextMenus();
  const menu = document.getElementById('ctx-' + id);
  if (menu) menu.style.display = '';
}

function closeContextMenus() {
  document.querySelectorAll('.ctx-menu').forEach(m => m.style.display = 'none');
}

document.addEventListener('click', closeContextMenus);

// ---- Init ----
loadQuotes();
renderQuotesList();
updateForm();
