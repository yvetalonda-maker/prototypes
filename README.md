# Prototypes

Systém pro rychlé vytváření interaktivních HTML prototypů z PrimeOne UI kitu.

## Jak to funguje

Řekni Claude co potřebuješ — buď dej link na Figma frame, nebo popiš textově. Claude přečte `CLAUDE.md`, použije předpřipravené komponenty a tokeny, a složí prototyp.

### Příklady

```
"Udělej login stránku pro SAFEQ Cloud admin"
→ live/safeq-cloud-admin/login.html

"Potřebuju mock dashboardu s tabulkou uživatelů a sidebar navigací"
→ mocks/2026-03-29-user-dashboard/

"Tady je frame z Figma: [link] — přelož to do HTML"
→ Claude načte frame přes Figma MCP a složí z komponent
```

## Struktura

| Složka | Účel |
|--------|------|
| `_shared/` | Fonty, CSS (tokeny + komponenty), šablona |
| `live/` | Dlouhodobé prototypy (SAFEQ Cloud admin, ne.Hub, terminal app) |
| `mocks/` | Jednorázové prototypy (`YYYY-MM-DD-nazev`) |

## Otevření prototypu

Stačí otevřít HTML soubor v prohlížeči:

```bash
open live/safeq-cloud-admin/index.html
# nebo
open mocks/2026-03-29-login-redesign/index.html
```

## Design System

- **Fonty**: Y Soft (headings), Lab Grotesque (body)
- **Ikony**: Font Awesome 6 Free
- **UI Kit**: PrimeOne Library 4.0.0
- **Detaily**: viz `_shared/design-system.md`
- **Komponenty**: viz `CLAUDE.md` (HTML snippety)
