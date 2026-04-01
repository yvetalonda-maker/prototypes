// ==========================================================================
// Quote Form v2 — from screenshots
// ==========================================================================

const state = {
  step: 'form',
  advancedOpen: false,
  authEnabled: false,
  mobileAuthEnabled: false,
};

const readerDescs = {
  ultimate: 'Most <strong>universal</strong> reader on the market with future proof technology. Supporting majority of technologies incl. mobile, HID and Legic authentication.',
  mobile: 'Universal reader supporting also <strong>mobile</strong> and <strong>Legic</strong> technology.',
  reader: 'Universal reader supporting <strong>HID technologies.</strong>',
  lite: 'Universal reader without advanced Legic and HID technology.',
};

const readerTags = {
  ultimate: 'universal & future proof',
  mobile: 'mobile & legic',
  reader: 'HID focused',
  lite: 'affordable',
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

document.getElementById('dialogMask')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeDialog();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDialog(); });

// --- Contract ---

function selectContract(btn) {
  document.querySelectorAll('.qf-seg').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Update period dropdown based on contract type
  const period = document.getElementById('contractPeriod');
  const val = btn.dataset.value;
  if (val === 'fixed') {
    period.innerHTML = '<option>24 months</option><option>48 months</option>';
  } else {
    period.innerHTML = '<option>monthly</option><option>yearly</option>';
  }
  updatePricing();
}

// --- Auth ---

function toggleAuth() {
  state.authEnabled = document.getElementById('authToggle').checked;
  document.getElementById('vendorSelect').style.display = state.authEnabled ? 'block' : 'none';
  document.getElementById('readerRow').style.display = state.authEnabled ? 'grid' : 'none';
  updateReaderCountVisibility();
  // Title does NOT change on auth toggle
  updatePricing();
}

function updateReaderCountVisibility() {
  const show = state.authEnabled && state.advancedOpen;
  document.getElementById('readerCount').style.display = show ? 'block' : 'none';
}

// --- Reader custom dropdown ---

function toggleReaderDropdown() {
  const dd = document.getElementById('readerDropdown');
  dd.style.display = dd.style.display === 'block' ? 'none' : 'block';
}

function selectReader(value) {
  const trigger = document.getElementById('readerTrigger');
  const dd = document.getElementById('readerDropdown');
  const names = { ultimate: 'MFX4 Ultimate', mobile: 'MFX4 Mobile', reader: 'MFX4 Reader', lite: 'MFX4 Lite' };
  const prices = { ultimate: 10, mobile: 8, reader: 7, lite: 5 };

  trigger.querySelector('.qf-dd-name').textContent = names[value];
  trigger.dataset.value = value;
  trigger.dataset.price = prices[value];
  dd.style.display = 'none';

  document.getElementById('readerDesc').innerHTML = readerDescs[value] || '';
  updatePricing();
}

// Close dropdown on outside click
document.addEventListener('click', e => {
  const dd = document.getElementById('readerDropdown');
  const trigger = document.getElementById('readerTrigger');
  if (dd && trigger && !dd.contains(e.target) && !trigger.contains(e.target)) {
    dd.style.display = 'none';
  }
});

// --- Advanced ---

function toggleAdvanced() {
  state.advancedOpen = !state.advancedOpen;
  document.getElementById('advancedSection').style.display = state.advancedOpen ? 'block' : 'none';
  document.getElementById('showAdvBtn').style.display = state.advancedOpen ? 'none' : 'block';
  updateReaderCountVisibility();
}

// --- Custom date ---

function toggleCustomDate() {
  const isCustom = document.querySelector('input[name="startDate"][value="custom"]').checked;
  document.getElementById('customDateField').style.display = isCustom ? 'block' : 'none';
}

// --- Mobile auth ---

function toggleMobileAuth() {
  state.mobileAuthEnabled = document.getElementById('mobileAuthToggle').checked;
  document.getElementById('mobileAuthStepper').style.display = state.mobileAuthEnabled ? 'flex' : 'none';
  updatePricing();
}

// --- Stepper (+5 / -5) ---

function stepValue(inputId, delta) {
  const input = document.getElementById(inputId);
  const val = parseInt(input.value) || 0;
  const newVal = Math.max(0, val + delta);
  input.value = newVal;
  updatePricing();
}

// --- Title ---

function updateTitle() {
  const el = document.getElementById('dialogTitle');
  if (state.step === 'shipping') el.textContent = 'FINISH ORDER';
  else el.textContent = 'CREATE QUOTE';
}

// --- Pricing ---

function updatePricing() {
  const tbody = document.getElementById('pricingBody');
  const printCount = parseInt(document.getElementById('printCount').value) || 0;
  const mfpCount = parseInt(document.getElementById('mfpCount').value) || 0;
  const contractType = document.querySelector('.qf-seg.active')?.dataset.value || 'subscription';
  const productType = document.querySelector('input[name="productType"]:checked')?.value || 'pro';
  const productName = productType === 'pro' ? 'SAFEQ Cloud Pro' : 'SAFEQ Cloud Breeze';
  const contractLabel = contractType === 'subscription' ? 'Subscription' : 'Fixed term';

  const rows = [];
  let totalPurchase = 0;
  let totalSelling = 0;

  if (printCount > 0) {
    const pp = printCount * 60;
    const sp = printCount * 70;
    rows.push({ code: 'YSQLP-000-1P02-A', name: `YSoft ${productName} - Print (1-49)`, detail: `24 months (${contractLabel})`, qty: printCount, purchase: pp, selling: sp });
    totalPurchase += pp;
    totalSelling += sp;
  }

  if (mfpCount > 0) {
    const pp = mfpCount * 60;
    const sp = mfpCount * 70;
    rows.push({ code: 'YSQLP-000-1P02-A', name: `YSoft ${productName} - MFP (1-49)`, detail: `24 months (${contractLabel})`, qty: mfpCount, purchase: pp, selling: sp });
    totalPurchase += pp;
    totalSelling += sp;
  }

  if (state.authEnabled) {
    const readerCount = parseInt(document.getElementById('readerCount').value) || 20;
    const trigger = document.getElementById('readerTrigger');
    const readerPrice = parseInt(trigger?.dataset.price) || 10;

    const pp = readerCount * readerPrice;
    const sp = readerCount * 15;
    rows.push({ code: '', name: 'Card readers', detail: '', qty: readerCount, purchase: pp, selling: sp });
    totalPurchase += pp;
    totalSelling += sp;

    rows.push({ code: '', name: 'Delivery fee', detail: '', qty: 1, purchase: 5, selling: 5 });
    totalPurchase += 5;
    totalSelling += 5;
  }

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>
        ${r.name}
        ${r.code || r.detail ? `<span class="qf-item-meta">${[r.code, r.detail].filter(Boolean).join(' · ')}</span>` : ''}
      </td>
      <td class="r">${r.qty}</td>
      <td class="r">${r.purchase} EUR</td>
      <td class="r"><input type="number" class="input qf-sell-input" value="${r.selling}"> EUR</td>
    </tr>
  `).join('');

  document.getElementById('totalPurchase').textContent = totalPurchase + ' EUR';
  document.getElementById('totalSelling').textContent = totalSelling + ' EUR';
  updateButtons();
}

// --- Buttons ---

function updateButtons() {
  const back = document.getElementById('btnBack');
  const sec = document.getElementById('btnSecondary');
  const pri = document.getElementById('btnPrimary');
  if (state.step === 'shipping') {
    back.style.display = 'inline-flex';
    sec.textContent = 'FILL LATER';
    pri.textContent = 'FINISH ORDER';
  } else {
    back.style.display = 'none';
    sec.textContent = 'CREATE ORDER';
    pri.textContent = 'SAVE QUOTE';
  }
}

function handleBack() {
  state.step = 'form';
  document.getElementById('stepForm').style.display = 'flex';
  document.getElementById('stepShipping').style.display = 'none';
  updateTitle();
  updateButtons();
}

function handlePrimary() {
  if (state.step === 'shipping') {
    closeDialog(); showToast('Order finished successfully');
  } else {
    closeDialog(); showToast('Quote saved successfully');
  }
}

function handleSecondary() {
  if (state.step === 'shipping') {
    closeDialog(); showToast('Order created — shipping details pending');
  } else if (state.authEnabled) {
    state.step = 'shipping';
    document.getElementById('stepForm').style.display = 'none';
    document.getElementById('stepShipping').style.display = 'flex';
    updateTitle();
    updateButtons();
  } else {
    closeDialog(); showToast('Order created successfully');
  }
}

// --- Toast ---

function showToast(msg) {
  document.querySelector('.toast-container')?.remove();
  const c = document.createElement('div');
  c.className = 'toast-container';
  c.innerHTML = `<div class="toast toast-success"><i class="pi pi-check-circle toast-icon"></i><div class="toast-content"><div class="toast-summary">Success</div><div class="toast-detail">${msg}</div></div><button class="toast-close" onclick="this.closest('.toast-container').remove()"><i class="pi pi-times"></i></button></div>`;
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 4000);
  resetState();
}

function resetState() {
  state.step = 'form';
  state.advancedOpen = false;
  document.getElementById('stepForm').style.display = 'flex';
  document.getElementById('stepShipping').style.display = 'none';
  document.getElementById('advancedSection').style.display = 'none';
  document.getElementById('showAdvBtn').style.display = 'block';
  updateReaderCountVisibility();
  updateTitle();
  updateButtons();
}
