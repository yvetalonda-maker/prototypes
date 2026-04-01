// ==========================================================================
// Quote Form Prototype — Interactivity
// ==========================================================================

let state = {
  step: 'form',
  advancedOpen: false,
  authEnabled: false,
  mobileAuthEnabled: false,
};

// --- Dialog ---
function openDialog() {
  document.getElementById('dialogMask').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  updatePricing();
}

function closeDialog() {
  document.getElementById('dialogMask').style.display = 'none';
  document.body.style.overflow = '';
}

document.getElementById('dialogMask')?.addEventListener('click', function(e) {
  if (e.target === this) closeDialog();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeDialog();
});

// --- Contract select buttons ---
function selectContract(btn) {
  document.querySelectorAll('.select-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updatePricing();
}

// --- Authentication toggle ---
function toggleAuth() {
  state.authEnabled = document.getElementById('authToggle').checked;
  document.getElementById('authVendorRow').style.display = state.authEnabled ? 'grid' : 'none';
  document.getElementById('authReaderRow').style.display = state.authEnabled ? 'grid' : 'none';
  updateDialogTitle();
  updatePricing();
}

// --- Advanced toggle ---
function toggleAdvanced() {
  state.advancedOpen = !state.advancedOpen;
  const section = document.getElementById('advancedSection');
  const toggleRow = document.getElementById('advancedToggleRow');

  if (state.advancedOpen) {
    section.style.display = 'block';
    toggleRow.style.display = 'none';
  } else {
    section.style.display = 'none';
    toggleRow.style.display = 'block';
  }
}

// --- Custom date toggle ---
function toggleCustomDate() {
  const isCustom = document.querySelector('input[name="startDate"][value="custom"]').checked;
  document.getElementById('customDateField').style.display = isCustom ? 'block' : 'none';
}

// --- Mobile auth toggle ---
function toggleMobileAuth() {
  state.mobileAuthEnabled = document.getElementById('mobileAuthToggle').checked;
  document.getElementById('mobileAuthCount').style.display = state.mobileAuthEnabled ? 'block' : 'none';
  updatePricing();
}

// --- Reader description ---
function updateReaderDescription() {
  const sel = document.getElementById('readerType');
  const opt = sel.options[sel.selectedIndex];
  const descEl = document.getElementById('readerDescription');
  // Bold the key word
  const desc = opt.dataset.desc;
  const keyword = {
    'ultimate': 'universal',
    'mobile': 'Mobile',
    'reader': 'HID',
    'lite': 'Affordable'
  }[sel.value] || '';
  descEl.innerHTML = desc.replace(keyword, `<strong>${keyword}</strong>`);
  updatePricing();
}

// --- Dialog title ---
function updateDialogTitle() {
  const title = document.getElementById('dialogTitle');
  if (state.step === 'shipping') {
    title.textContent = 'Finish Order';
  } else if (state.authEnabled) {
    title.textContent = 'Create Order';
  } else {
    title.textContent = 'Create Quote';
  }
}

// --- Pricing ---
function updatePricing() {
  const tbody = document.getElementById('pricingBody');
  const printCount = parseInt(document.querySelectorAll('.device-count')[0]?.value) || 0;
  const mfpCount = parseInt(document.querySelectorAll('.device-count')[1]?.value) || 0;
  const contractType = document.querySelector('.select-btn.active')?.dataset.value || 'subscription';
  const productType = document.querySelector('input[name="productType"]:checked')?.value || 'pro';
  const contractLabel = contractType === 'subscription' ? 'Subscription' : 'Fixed term';
  const periodLabel = document.getElementById('contractPeriod')?.value || 'monthly';

  const productName = productType === 'pro' ? 'SAFEQ Cloud Pro' : 'SAFEQ Cloud Breeze';
  const rows = [];
  let totalPurchase = 0;
  let totalSelling = 0;

  // PRINT license
  if (printCount > 0) {
    const pp = printCount * 60;
    const sp = printCount * 70;
    rows.push({
      code: `YSQLP-000-1P02-A`,
      name: `YSoft ${productName} - Print (1-49)`,
      detail: `24 months (${contractLabel})`,
      qty: printCount,
      purchase: pp,
      selling: sp
    });
    totalPurchase += pp;
    totalSelling += sp;
  }

  // MFP license
  if (mfpCount > 0) {
    const pp = mfpCount * 60;
    const sp = mfpCount * 70;
    rows.push({
      code: `YSQLP-000-1P02-A`,
      name: `YSoft ${productName} - MFP (1-49)`,
      detail: `24 months (${contractLabel})`,
      qty: mfpCount,
      purchase: pp,
      selling: sp
    });
    totalPurchase += pp;
    totalSelling += sp;
  }

  // Card readers
  if (state.authEnabled) {
    const readerCount = parseInt(document.getElementById('readerCount')?.value) || 0;
    const readerSel = document.getElementById('readerType');
    const readerPrice = parseInt(readerSel?.options[readerSel.selectedIndex]?.dataset.price) || 10;

    if (readerCount > 0) {
      const pp = readerCount * readerPrice;
      const sp = readerCount * 15;
      rows.push({
        code: '',
        name: 'Card readers',
        detail: '',
        qty: readerCount,
        purchase: pp,
        selling: sp
      });
      totalPurchase += pp;
      totalSelling += sp;

      // Delivery fee
      rows.push({
        code: '',
        name: 'Delivery fee',
        detail: '',
        qty: 1,
        purchase: 5,
        selling: 5
      });
      totalPurchase += 5;
      totalSelling += 5;
    }
  }

  // Render
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>
        ${r.code ? `<span class="item-code">${r.code}</span>` : ''}
        ${r.name}
        ${r.detail ? `<br><span class="item-code">${r.detail}</span>` : ''}
      </td>
      <td class="text-right">${r.qty}</td>
      <td class="text-right">${r.purchase} EUR</td>
      <td class="text-right">
        <input type="number" class="input selling-input" value="${r.selling}"> EUR
      </td>
    </tr>
  `).join('');

  document.getElementById('totalPurchase').textContent = totalPurchase + ' EUR';
  document.getElementById('totalSelling').textContent = totalSelling + ' EUR';

  updateFooterButtons();
}

// --- Footer ---
function updateFooterButtons() {
  const btnSecondary = document.getElementById('btnSecondary');
  const btnPrimary = document.getElementById('btnPrimary');

  if (state.step === 'shipping') {
    btnSecondary.textContent = 'FILL LATER';
    btnPrimary.textContent = 'FINISH ORDER';
  } else {
    btnSecondary.textContent = 'CREATE ORDER';
    btnPrimary.textContent = 'SAVE QUOTE';
  }
}

// --- Actions ---
function handlePrimary() {
  if (state.step === 'shipping') {
    closeDialog();
    showToast('Order finished successfully');
  } else {
    closeDialog();
    showToast('Quote saved successfully');
  }
}

function handleSecondary() {
  if (state.step === 'shipping') {
    closeDialog();
    showToast('Order created — shipping details pending');
  } else if (state.authEnabled) {
    state.step = 'shipping';
    document.getElementById('stepForm').style.display = 'none';
    document.getElementById('stepShipping').style.display = 'block';
    updateDialogTitle();
    updateFooterButtons();
  } else {
    closeDialog();
    showToast('Order created successfully');
  }
}

// --- Toast ---
function showToast(message) {
  document.querySelector('.toast-container')?.remove();

  const container = document.createElement('div');
  container.className = 'toast-container';
  container.innerHTML = `
    <div class="toast toast-success">
      <i class="pi pi-check-circle toast-icon"></i>
      <div class="toast-content">
        <div class="toast-summary">Success</div>
        <div class="toast-detail">${message}</div>
      </div>
      <button class="toast-close" onclick="this.closest('.toast-container').remove()">
        <i class="pi pi-times"></i>
      </button>
    </div>
  `;
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 4000);
  resetState();
}

function resetState() {
  state.step = 'form';
  state.advancedOpen = false;
  document.getElementById('stepForm').style.display = 'block';
  document.getElementById('stepShipping').style.display = 'none';
  document.getElementById('advancedToggleRow').style.display = 'block';
  document.getElementById('advancedSection').style.display = 'none';
  updateDialogTitle();
  updateFooterButtons();
}
