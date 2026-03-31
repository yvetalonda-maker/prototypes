/* ==========================================================================
   Scan Workflow — Split Branches — Interactions
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
  card.style.transition = 'opacity 0.2s';
  setTimeout(() => card.remove(), 200);
}

/* --- Add branch --- */

let branchCounter = 2; // A and B already exist
const branchLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function addBranch() {
  const container = document.getElementById('branch-container');
  const arms = document.getElementById('split-arms');

  branchCounter++;
  const letter = branchLetters[branchCounter - 1] || branchCounter;

  // Add connector arm
  const arm = document.createElement('div');
  arm.className = 'split-connector-arm';
  arms.appendChild(arm);

  // Update arms horizontal bar width
  updateConnectorArms();

  // Add lane
  const lane = document.createElement('div');
  lane.className = 'branch-lane';
  lane.innerHTML = `
    <div class="branch-lane-header">
      <span class="branch-lane-label">Branch ${letter}</span>
      <input class="input branch-lane-name" value="New branch" placeholder="Branch name">
      <button class="btn-remove-branch" title="Remove branch" onclick="removeBranch(this)"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="branch-phase"><span class="branch-phase-label">Process</span></div>
    <button class="add-step-btn add-step-btn-sm"><i class="fa-solid fa-plus add-step-icon"></i> Add step</button>
    <div class="branch-phase"><span class="branch-phase-label">Deliver</span></div>
    <button class="add-step-btn add-step-btn-sm"><i class="fa-solid fa-plus add-step-icon"></i> Add step</button>
  `;

  lane.style.opacity = '0';
  container.appendChild(lane);
  requestAnimationFrame(() => {
    lane.style.transition = 'opacity 0.25s';
    lane.style.opacity = '1';
  });
}

function removeBranch(btnEl) {
  const lane = btnEl.closest('.branch-lane');
  const container = lane.parentNode;
  const arms = document.getElementById('split-arms');

  if (container.children.length <= 2) return; // Minimum 2 branches

  lane.style.opacity = '0';
  lane.style.transition = 'opacity 0.2s';
  setTimeout(() => {
    lane.remove();
    // Remove one arm
    if (arms.lastElementChild) arms.lastElementChild.remove();
    updateConnectorArms();
  }, 200);
}

function updateConnectorArms() {
  const arms = document.getElementById('split-arms');
  if (!arms) return;
  const count = arms.children.length;
  const pct = 100 / (count * 2);
  arms.style.setProperty('--arm-offset', pct + '%');
}

/* --- Enable / Disable Split --- */

function enableSplit() {
  const defaultDelivery = document.getElementById('delivery-default');
  const splitNode = document.getElementById('split-node');

  defaultDelivery.classList.add('hidden');
  splitNode.classList.remove('hidden');
  splitNode.style.opacity = '0';
  requestAnimationFrame(() => {
    splitNode.style.transition = 'opacity 0.3s';
    splitNode.style.opacity = '1';
  });
}

function disableSplit() {
  const defaultDelivery = document.getElementById('delivery-default');
  const splitNode = document.getElementById('split-node');

  splitNode.classList.add('hidden');
  defaultDelivery.classList.remove('hidden');
  defaultDelivery.style.opacity = '0';
  requestAnimationFrame(() => {
    defaultDelivery.style.transition = 'opacity 0.3s';
    defaultDelivery.style.opacity = '1';
  });
}
