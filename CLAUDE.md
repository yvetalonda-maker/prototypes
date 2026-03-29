# Prototypes — Design System & Workflow

Tento projekt slouží k rychlému vytváření interaktivních HTML/CSS/JS prototypů z PrimeOne UI kitu.

## Technologie
- **Vanilla HTML/CSS/JS** — žádný build, žádný npm
- **Font Awesome 6 Free** — ikony via CDN (pokud není řečeno jinak)
- **Y Soft** — font pro headings (`font-family: var(--font-heading)`)
- **Lab Grotesque** — font pro body/UI text (`font-family: var(--font-body)`)
- **PrimeOne Library 4.0.0** — design tokeny a komponenty extrahované do CSS

## Figma zdroj
- UI Kit: `figma.com/design/BfxSaEkycaAsBgedcs8e6i/PrimeOne-Library--4.0.0`
- Pokud potřebuješ detail konkrétní komponenty, použij Figma MCP `get_design_context`

## Struktura projektu

```
~/prototypes/
├── _shared/              ← NEOPRAVUJ bez výslovného pokynu
│   ├── fonts/            ← Y Soft + Lab Grotesque (lokální soubory)
│   ├── css/
│   │   ├── base.css      ← reset, @font-face, CSS custom properties (tokeny)
│   │   ├── components.css ← PrimeOne komponenty jako čisté CSS třídy
│   │   └── utilities.css ← layout, spacing, text utility třídy
│   ├── template.html     ← startovací šablona pro nové prototypy
│   └── design-system.md  ← referenční dokument tokenů a pravidel
│
├── live/                 ← dlouhodobé prototypy (zrcadlí produkci)
│   ├── safeq-cloud-admin/
│   ├── ne-hub/
│   └── terminal-app/
│
└── mocks/                ← jednorázové prototypy
    └── YYYY-MM-DD-nazev/
```

## Pravidla pro prototypování

### Vždy
- Použij CSS custom properties z `base.css` — nikdy hardcodované barvy/spacing
- Headings = Y Soft (`var(--font-heading)`), body/UI = Lab Grotesque (`var(--font-body)`)
- Y Soft font se NIKDY nepoužívá kurzívou (`font-style: italic` je zakázaný pro `--font-heading`)
- Ikony — záleží na projektu:
  - **SAFEQ Cloud admin web** = Font Awesome 6 Free (`<i class="fa-solid fa-name"></i>`)
  - **ne.Hub** = PrimeIcons z PrimeVue kitu (`<i class="pi pi-name"></i>`)
  - **terminal app** = dle zadání, default FA
  - **mocks** = FA, pokud není řečeno jinak
- Komponenty = CSS třídy z `components.css` (`.btn`, `.btn-primary`, `.input`, `.card`, `.table` atd.)
- Interaktivita = vanilla JS (přepínání tříd, zobrazování/skrývání elementů)

### Vytváření nového prototypu
1. Zkopíruj `_shared/template.html` jako základ
2. Uprav `<title>` a cesty k CSS (live = `../../_shared/css/`, mock = `../../_shared/css/`)
3. Vytvoř lokální `styles.css` pro specifické styly dané stránky
4. Vytvoř `script.js` pro interaktivitu (pokud je potřeba)

### Live prototypy (live/)
- Postupně rostou — nové obrazovky přidávej jako další HTML soubory
- Sdílí lokální CSS a JS v rámci své složky
- Zachovávej konzistentní navigaci mezi stránkami
- Zrcadlí reálný produkt — pokud je k dispozici Figma link, drž se ho

### Jednorázové mocks (mocks/)
- Pojmenování složky: `YYYY-MM-DD-nazev` (např. `2026-03-29-login-redesign`)
- Samostatné — mohou mít vlastní styly nad rámec shared
- Po validaci se mohou archivovat nebo smazat

## Dostupné CSS třídy (components.css)

### Buttons
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-outlined btn-primary">Outlined</button>
<button class="btn btn-text btn-primary">Text</button>
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary btn-rounded">Rounded</button>
<button class="btn btn-primary btn-icon"><i class="fa-solid fa-plus"></i></button>
```

### Form Inputs
```html
<input class="input" placeholder="Text input">
<input class="input input-sm" placeholder="Small">
<input class="input input-lg" placeholder="Large">
<input class="input invalid" placeholder="Invalid">
<select class="select"><option>Option</option></select>
<textarea class="textarea" placeholder="Textarea"></textarea>

<!-- With icon -->
<div class="input-icon-wrapper">
  <i class="fa-solid fa-search"></i>
  <input class="input" placeholder="Search...">
</div>

<!-- Form group -->
<div class="form-group">
  <label class="form-label">Label</label>
  <input class="input">
  <span class="form-helper">Helper text</span>
</div>
```

### Checkbox, Radio, Toggle
```html
<label class="checkbox-wrapper">
  <input type="checkbox"> <span>Label</span>
</label>

<label class="radio-wrapper">
  <input type="radio" name="group"> <span>Label</span>
</label>

<label class="toggle">
  <input type="checkbox">
  <span class="toggle-slider"></span>
</label>
```

### Card
```html
<div class="card">
  <div class="card-header"><h4>Title</h4></div>
  <div class="card-subheader">Subtitle</div>
  <div class="card-body">Content</div>
  <div class="card-footer">
    <button class="btn btn-text btn-secondary">Cancel</button>
    <button class="btn btn-primary">Save</button>
  </div>
</div>
```

### Table
```html
<div class="table-wrapper">
  <table class="table">
    <thead>
      <tr><th>Name</th><th>Status</th><th>Actions</th></tr>
    </thead>
    <tbody>
      <tr><td>Item</td><td><span class="tag tag-success">Active</span></td><td>...</td></tr>
    </tbody>
  </table>
</div>
```

### Dialog
```html
<div class="dialog-mask">
  <div class="dialog">
    <div class="dialog-header">
      <h3>Title</h3>
      <button class="dialog-close"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="dialog-body">Content</div>
    <div class="dialog-footer">
      <button class="btn btn-text btn-secondary">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Toast
```html
<div class="toast-container">
  <div class="toast toast-success">
    <i class="fa-solid fa-circle-check toast-icon"></i>
    <div class="toast-content">
      <div class="toast-summary">Success</div>
      <div class="toast-detail">Operation completed.</div>
    </div>
    <button class="toast-close"><i class="fa-solid fa-xmark"></i></button>
  </div>
</div>
```

### Message (inline)
```html
<div class="message message-info"><i class="fa-solid fa-circle-info"></i> Info message</div>
<div class="message message-warn"><i class="fa-solid fa-triangle-exclamation"></i> Warning</div>
```

### Navigation
```html
<!-- Menubar -->
<nav class="menubar">
  <div class="menubar-start">
    <a class="menubar-item active"><i class="fa-solid fa-house"></i> Home</a>
    <a class="menubar-item"><i class="fa-solid fa-gear"></i> Settings</a>
  </div>
  <div class="menubar-end">
    <div class="avatar">YA</div>
  </div>
</nav>

<!-- Sidebar -->
<aside class="sidebar">
  <div class="sidebar-header"><h4>App Name</h4></div>
  <ul class="sidebar-menu">
    <li class="sidebar-group-label">Main</li>
    <li><a class="sidebar-item active"><i class="fa-solid fa-house"></i> Dashboard</a></li>
    <li><a class="sidebar-item"><i class="fa-solid fa-users"></i> Users</a></li>
  </ul>
</aside>
```

### Other Components
```html
<!-- Badge -->
<span class="badge">5</span>
<span class="badge badge-danger">!</span>

<!-- Tag -->
<span class="tag tag-success">Active</span>
<span class="tag tag-danger tag-rounded">Expired</span>

<!-- Tabs -->
<div class="tabs">
  <button class="tab active">General</button>
  <button class="tab">Settings</button>
</div>

<!-- Breadcrumb -->
<nav class="breadcrumb">
  <a href="#">Home</a> <span class="breadcrumb-separator">/</span>
  <a href="#">Users</a> <span class="breadcrumb-separator">/</span>
  <span class="breadcrumb-current">Detail</span>
</nav>

<!-- Avatar -->
<div class="avatar">YA</div>
<div class="avatar avatar-lg">YA</div>

<!-- Progress -->
<div class="progressbar"><div class="progressbar-fill" style="width: 60%"></div></div>

<!-- Tooltip -->
<span data-tooltip="Tooltip text">Hover me</span>

<!-- Chip -->
<span class="chip">Tag <button class="chip-remove"><i class="fa-solid fa-xmark"></i></button></span>

<!-- Skeleton loading -->
<div class="skeleton skeleton-text" style="width: 200px"></div>

<!-- Empty state -->
<div class="empty-state">
  <i class="fa-solid fa-inbox empty-state-icon"></i>
  <h3>No data</h3>
  <p>There are no items to display.</p>
</div>

<!-- Divider -->
<hr class="divider">
```
