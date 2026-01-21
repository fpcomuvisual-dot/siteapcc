# 📸 GUIA: Como Capturar o Design do Site APCC

## Método 1: Screenshots Manuais (Mais Simples)

### Ferramentas Recomendadas:
1. **GoFullPage** (Chrome Extension) - Captura página inteira
2. **Awesome Screenshot** - Captura com anotações
3. **Windows Snipping Tool** - Nativo do Windows

### Páginas para Capturar:
1. **Homepage** (`http://localhost:3000/`)
   - Hero section com foto
   - Redes sociais
   - Notícias
   - Calendário
   - Estatísticas
   - CTA
   - Footer

2. **Transparência** (`http://localhost:3000/transparencia`)
   - Tabela de documentos
   - Layout completo

3. **Doar** (`http://localhost:3000/doar`)
   - QR Code PIX
   - Formulário de doação

4. **Admin** (`http://localhost:3000/admin`)
   - Dashboard completo

### Resoluções para Capturar:
- Desktop: 1920x1080px
- Tablet: 768x1024px
- Mobile: 375x812px (iPhone)

---

## Método 2: Figma Plugin "html.to.design"

### Passo a Passo:
1. Abra o Figma
2. Instale o plugin "html.to.design"
3. Cole a URL: `http://localhost:3000`
4. O plugin converte HTML → Figma automaticamente

**IMPORTANTE:** Precisa do site rodando (`npm run dev`)

---

## Método 3: Exportar Design System

### Cores da Paleta APCC:
```
Rosa (Outubro Rosa):
- rosa-50: #fdf2f8
- rosa-100: #fce7f3
- rosa-200: #fbcfe8
- rosa-300: #f9a8d4
- rosa-400: #f472b6
- rosa-500: #ec4899
- rosa-600: #db2777
- rosa-700: #be185d
- rosa-800: #9d174d
- rosa-900: #831843
- rosa-950: #500724

Azul (Novembro Azul):
- azul-50: #eff6ff
- azul-100: #dbeafe
- azul-200: #bfdbfe
- azul-300: #93c5fd
- azul-400: #60a5fa
- azul-500: #3b82f6
- azul-600: #2563eb
- azul-700: #1d4ed8
- azul-800: #1e40af
- azul-900: #1e3a8a
- azul-950: #172554

Dark Mode:
- gray-950: #030712
- gray-900: #111827
- gray-800: #1f2937
```

### Tipografia:
- Font Family: Inter (Google Fonts)
- Headings: 700-900 (Bold/Black)
- Body: 400-600 (Regular/Medium)

### Componentes:
- Buttons: Gradient Rosa → Azul
- Cards: Dark bg-gray-900 com bordas
- Inputs: Dark bg-gray-800
- Shadows: Rosa/Azul glow effects

---

## Método 4: Criar Mockup no Figma do Zero

### Template Pronto:
1. Crie um frame 1920x1080px
2. Importe as cores acima
3. Use componentes do Shadcn/UI como referência
4. Recrie o layout baseado nas screenshots

---

## 🎨 ASSETS NECESSÁRIOS:

### Imagens:
- `public/hero-background.jpg` - Foto da paciente
- `public/pix-qr.png` - QR Code
- `public/og-image.jpg` - (criar) Open Graph

### Ícones:
- Lucide React (use ícones SVG do lucide.dev)

---

## 📦 EXPORTAR PARA FIGMA:

### Opção A: Figma Community
Procure por "Tailwind CSS Design System" e adapte as cores

### Opção B: Figma Tokens
Use o plugin "Figma Tokens" para importar as cores do Tailwind

### Opção C: Manual
Recrie baseado nas screenshots + este guia de cores

---

## 🚀 DICA PRO:

Use o **Figma Dev Mode** para inspecionar o código CSS diretamente
e copiar espaçamentos, cores e tipografia exatas!

---

Criado para: APCC - Associação Paraguaçuense de Combate ao Câncer
Data: 2025-12-05
