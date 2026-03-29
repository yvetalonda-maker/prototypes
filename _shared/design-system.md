# PrimeOne Design System — Reference

Extracted from PrimeOne Library 4.0.0 (Figma fileKey: `BfxSaEkycaAsBgedcs8e6i`)

## Fonts
- **Headings**: Y Soft (Bold 700, Regular 400)
- **Body / UI**: Lab Grotesque (Light 300, Regular 400, Medium 500, Bold 700)
- **Icons**: Font Awesome 6 Free (CDN)

## Color Palette

### Primary (Teal)
| Token | Value |
|-------|-------|
| primary-50 | #e6f4f7 |
| primary-100 | #cdeaf0 |
| primary-200 | #9fd5df |
| primary-300 | #6fbfcc |
| primary-400 | #3fa8b8 |
| **primary-500** | **#1a7282** |
| primary-600 | #155e6b |
| primary-700 | #104a54 |
| primary-800 | #0b353d |
| primary-900 | #072227 |

### Severity
| Severity | Base (500) | Light (50) | Dark (700) |
|----------|-----------|------------|------------|
| Success | #00b677 | #e6f7f1 | #007851 |
| Info | #4a9fc4 | #eef6fa | #326d86 |
| Warning | #ff6600 | #fff7f2 | #aa4400 |
| Danger | #e84645 | #fdecec | #a2302f |
| Help | #8b5fbf | #f3effa | #5d3f81 |

### Surface (Light = Slate, Dark = Zinc)
| Token | Value |
|-------|-------|
| surface-0 | #ffffff |
| surface-50 | #f8fafc |
| surface-100 | #f1f5f9 |
| surface-200 | #e2e8f0 |
| surface-300 | #cbd5e1 |
| surface-400 | #94a3b8 |
| surface-500 | #64748b |
| surface-600 | #475569 |
| surface-700 | #30394a |
| surface-800 | #1e293b |
| surface-900 | #0f172a |

## Typography Scale (base 14px)
| Token | Size |
|-------|------|
| text-xs | 10.5px |
| text-sm | 12.25px |
| text-base | 14px |
| text-lg | 15.75px |
| text-xl | 17.5px |
| text-2xl | 21px |
| text-3xl | 28px |
| text-4xl | 35px |

## Spacing (base 14px)
| Token | Value | Multiplier |
|-------|-------|------------|
| space-1 | 1.75px | 0.125x |
| space-2 | 3.5px | 0.25x |
| space-3 | 5.25px | 0.375x |
| space-4 | 7px | 0.5x |
| space-5 | 8.75px | 0.625x |
| space-6 | 10.5px | 0.75x |
| space-7 | 12.25px | 0.875x |
| space-8 | 14px | 1x |
| space-10 | 17.5px | 1.25x |
| space-11 | 21px | 1.5x |
| space-13 | 28px | 2x |
| space-14 | 35px | 2.5x |
| space-15 | 42px | 3x |
| space-16 | 56px | 4x |

## Border Radius
| Token | Value |
|-------|-------|
| radius-xs | 2px |
| radius-sm | 4px |
| radius-md | 6px (default) |
| radius-lg | 8px |
| radius-xl | 12px (cards, modals) |

## Shadows
| Name | Use |
|------|-----|
| shadow-field | Input, select, textarea |
| shadow-card | Cards |
| shadow-overlay | Dropdowns, menus, popovers |
| shadow-raised | Raised buttons |
| shadow-dialog | Dialogs, drawers |
| shadow-toast | Toasts, messages |

## Component Sizing (3 tiers)

| | Small | Normal | Large |
|--|-------|--------|-------|
| Height | 27.5px | 33px | 38.5px |
| Padding X | 8.75px | 10.5px | 12.25px |
| Padding Y | 5.25px | 7px | 8.75px |
| Font | 12.25px | 14px | 15.75px |

Applies to: Button, Input, Select, Textarea

## Semantic Color Usage
| Purpose | Token |
|---------|-------|
| Body text | surface-700 |
| Muted text | surface-500 |
| Headings | surface-900 |
| Borders | surface-200 |
| Hover borders | surface-400 |
| Background | surface-0 |
| Hover background | surface-100 |
| Highlight bg | primary-50 |
| Highlight text | primary-700 |

## Key Semantic Assignments
- Content border-radius: 6px (md)
- Form field border-radius: 6px (md)
- Modal border-radius: 12px (xl)
- Nav item border-radius: 4px (sm)
- Icon size: 14px
- Focus ring: 1px solid primary, 2px offset
- Disabled opacity: 60%
