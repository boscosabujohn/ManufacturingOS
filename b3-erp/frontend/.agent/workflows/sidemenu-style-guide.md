# Side Menu Style Guide

Styling specifications for the OptiForge ERP sidebar navigation.

---

## Brand Colors

```javascript
// tailwind.config.js
brand: {
  red: "#E31E24",        // Selected/active states
  darkBlue: "#001529",   // Sidebar background
  blue: "#0074D9",       // Menu title accents
  lightBlue: "#60A5FA",  // Hover states
  white: "#FFFFFF",      // Text on dark background
}
```

---

## Sidebar Container

| Property | Value |
|----------|-------|
| Width (open) | `280px` |
| Width (collapsed) | `64px` |
| Background | `bg-gradient-to-br from-brand-darkBlue via-[#001a33] to-brand-blue/30` |
| Border | `border-r border-white/10` |
| Shadow | `shadow-2xl` |

---

## Typography

| Element | Size | Weight | Other |
|---------|------|--------|-------|
| Module Title | `14px` | `font-semibold` | - |
| Sub-menu Item | `13px` | normal | `font-medium` when active |
| Search Placeholder | `text-sm` | `font-bold` | `tracking-wider` |

---

## Menu Item States

### Default State
```
Background:  transparent
Text:        text-white
Icon:        text-white (h-5 w-5)
Chevron:     text-brand-blue (h-3 w-3)
```

### Hover State
```
Background:  bg-brand-blue/10
Text:        text-brand-lightBlue
Border:      border-brand-lightBlue (left border on links)
Icon:        scale-110 transform
```

### Selected/Active State (RED)
```
Background:  bg-brand-red
Text:        text-white
Shadow:      shadow-lg shadow-brand-red/20
Chevron:     text-white
```

### Sub-item Active State
```
Background:  bg-brand-red/10
Text:        text-brand-lightBlue
Weight:      font-semibold
```

### Disabled State
```
Opacity:     opacity-50
Cursor:      cursor-not-allowed
```

---

## Spacing

| Element | Padding |
|---------|---------|
| Menu Item | `px-3 py-2` |
| Sub-menu Item | `py-1.5`, left padding increases per level: `(level + 1) * 0.75rem` |
| Container padding | `px-2` |
| Item margin | `mb-0.5` |

---

## Borders & Dividers

| Element | Style |
|---------|-------|
| Sub-menu container | `border-l border-brand-lightBlue/30 ml-3` |
| Search section | `border-b border-brand-blue/20` |
| Footer | `border-t border-brand-blue/20` |
| Header | `border-b border-gray-100` |

---

## Animations

```css
/* Sub-menu slide animation */
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Standard transition */
transition-all duration-200
```

---

## Quick Reference

```
┌─────────────────────────────────────────┐
│  COLOR SCHEME                           │
├─────────────────────────────────────────┤
│  Background:    #001529 (darkBlue)      │
│  Default Text:  #FFFFFF (white)         │
│  Title Accent:  #0074D9 (blue)          │
│  Hover:         #60A5FA (lightBlue)     │
│  Selected:      #E31E24 (red)           │
│  Active Sub:    rgba(227,30,36,0.1)     │
└─────────────────────────────────────────┘
```

---

## File References

- [Sidebar.tsx](../../src/components/Sidebar.tsx)
- [tailwind.config.js](../../tailwind.config.js)
