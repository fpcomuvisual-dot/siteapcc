# 🎨 APCC - Design System Documentation

## 📐 Layout Structure

### Homepage Layout:
```
┌─────────────────────────────────────┐
│         NAVIGATION BAR              │ ← Sticky, dark bg
├─────────────────────────────────────┤
│                                     │
│         HERO SECTION                │ ← Full height, parallax
│    (Background Image + Overlay)    │
│                                     │
├─────────────────────────────────────┤
│      REDES SOCIAIS (Grid 2x1)      │ ← Instagram + Facebook
├─────────────────────────────────────┤
│       NOTÍCIAS (Grid 3x1)          │ ← Cards com imagens
├─────────────────────────────────────┤
│    CALENDÁRIO EVENTOS (Grid 3x1)   │ ← Cards com datas
├─────────────────────────────────────┤
│    ESTATÍSTICAS (Grid 4x1)         │ ← Cards com números
├─────────────────────────────────────┤
│         CTA SECTION                 │ ← Gradient background
├─────────────────────────────────────┤
│           FOOTER                    │ ← 3 columns
└─────────────────────────────────────┘

[FLOATING BUTTON]                      ← Bottom right, sticky
```

---

## 🎨 Color Palette

### Primary Colors:
- **Rosa (Outubro Rosa):** `#ec4899` → `#db2777`
- **Azul (Novembro Azul):** `#3b82f6` → `#2563eb`

### Background:
- **Dark:** `#030712` (gray-950)
- **Card:** `#111827` (gray-900)
- **Input:** `#1f2937` (gray-800)

### Text:
- **Primary:** `#ffffff` (white)
- **Secondary:** `#d1d5db` (gray-300)
- **Muted:** `#9ca3af` (gray-400)

---

## 📝 Typography

### Font Family:
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Font Sizes:
- **Hero Title:** 5xl-8xl (3rem - 6rem)
- **Section Title:** 4xl-5xl (2.25rem - 3rem)
- **Card Title:** 2xl-3xl (1.5rem - 1.875rem)
- **Body:** base-lg (1rem - 1.125rem)
- **Caption:** sm-xs (0.875rem - 0.75rem)

### Font Weights:
- **Black (900):** Títulos principais
- **Bold (700):** Subtítulos e botões
- **Medium (500):** Texto de destaque
- **Regular (400):** Corpo de texto

---

## 🧩 Components

### 1. Button Primary
```
┌──────────────────────┐
│  ❤️  DOAR AGORA      │ ← Gradient Rosa→Azul
└──────────────────────┘
Padding: 0.75rem 2rem
Border Radius: 0.5rem
Font Weight: 700
Shadow: 0 0 20px rgba(236, 72, 153, 0.5)
```

### 2. Button Secondary
```
┌──────────────────────┐
│  Ver Transparência   │ ← Outline Azul
└──────────────────────┘
Border: 2px solid #2563eb
Color: #60a5fa
Background: transparent
```

### 3. Card (Dark)
```
┌─────────────────────────┐
│  [Icon]                 │
│                         │
│  1.247                  │ ← Gradient text
│  Pacientes Atendidos    │
└─────────────────────────┘
Background: #111827
Border: 1px solid rgba(236, 72, 153, 0.3)
Border Radius: 0.75rem
Hover: scale(1.05)
```

### 4. Navigation
```
┌─────────────────────────────────────┐
│ ❤️ APCC    Início  Transparência  [Doar] │
└─────────────────────────────────────┘
Background: rgba(3, 7, 18, 0.8)
Backdrop Filter: blur(12px)
Border Bottom: 1px solid #374151
```

---

## 🎭 Animations

### Framer Motion Variants:

**Fade In Up:**
```javascript
hidden: { opacity: 0, y: 60 }
visible: { opacity: 1, y: 0 }
```

**Stagger Children:**
```javascript
delay: 0.2s between items
```

**Hover Effects:**
```javascript
scale: 1.05
rotate: 360deg (icons)
```

**Parallax:**
```javascript
Hero background: scale(1 → 1.2)
```

---

## 📱 Responsive Breakpoints

```
Mobile:   < 640px   (sm)
Tablet:   640-1024px (md-lg)
Desktop:  > 1024px   (xl)
```

### Mobile Adjustments:
- Hero title: 3xl → 5xl
- Grid: 1 column
- Padding: 1rem → 2rem
- Font sizes: -20%

---

## 🌈 Gradients

### Primary Gradient (Rosa → Azul):
```css
background: linear-gradient(to right, #ec4899, #3b82f6);
```

### Hero Overlay:
```css
background: linear-gradient(to bottom right, 
  rgba(131, 24, 67, 0.85),
  rgba(17, 24, 39, 0.8),
  rgba(30, 58, 138, 0.85)
);
```

### Text Gradient:
```css
background: linear-gradient(to right, #f472b6, #60a5fa);
-webkit-background-clip: text;
color: transparent;
```

---

## 🎯 Spacing System

```
xs:  0.25rem (4px)
sm:  0.5rem  (8px)
md:  1rem    (16px)
lg:  1.5rem  (24px)
xl:  2rem    (32px)
2xl: 3rem    (48px)
```

---

## 🔲 Border Radius

```
sm:   0.125rem (2px)
md:   0.375rem (6px)
lg:   0.5rem   (8px)
xl:   0.75rem  (12px)
2xl:  1rem     (16px)
full: 9999px   (circle)
```

---

## 💫 Effects

### Shadows:
```css
/* Card Shadow */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

/* Glow Rosa */
box-shadow: 0 0 20px rgba(236, 72, 153, 0.5);

/* Glow Azul */
box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
```

### Backdrop Blur:
```css
backdrop-filter: blur(12px);
```

---

## 📦 Assets Needed for Figma

### Images:
1. `hero-background.jpg` (1920x1080px)
2. `og-image.jpg` (1200x630px)
3. `pix-qr.png` (512x512px)
4. `icon-192.png` (192x192px)
5. `icon-512.png` (512x512px)

### Icons (Lucide):
- Heart
- Users
- Building2
- TrendingUp
- Calendar
- Instagram
- Facebook
- Download
- Shield
- FileText

---

## 🎬 Interactions

### Hover States:
- Buttons: `scale(1.05)` + shadow increase
- Cards: `scale(1.03)` + border color change
- Icons: `rotate(360deg)`
- Links: color change

### Click States:
- Buttons: `scale(0.95)`
- Cards: subtle pulse

### Scroll Animations:
- Fade in from bottom
- Parallax background
- Stagger children

---

## 📋 Figma Layers Structure

```
📁 APCC Website
  📁 Pages
    📄 Homepage
    📄 Transparência
    📄 Doar
    📄 Admin
  📁 Components
    📁 Buttons
      🔘 Primary
      🔘 Secondary
      🔘 Outline
    📁 Cards
      🃏 Stat Card
      🃏 News Card
      🃏 Event Card
    📁 Navigation
      🧭 Navbar
      🦶 Footer
  📁 Styles
    🎨 Colors
    📝 Typography
    🌈 Gradients
    💫 Effects
```

---

Criado para: APCC - Associação Paraguaçuense de Combate ao Câncer
Versão: 1.0.0
Data: 2025-12-05
