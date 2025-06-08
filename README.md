# shadecn

**SVG Color Customizer with shadcn Theme Integration**

Transform your SVGs into theme-aware React components. Import SVGs, customize colors with shadcn themes, and export clean JSX components that adapt to your design system.

## Features

- **Theme Integration** - Import shadcn CSS theme configs and map colors directly
- **Smart Color Mapping** - Choose which theme colors replace which SVG colors
- **React Component Export** - Convert SVGs to JSX with proper theming
- **Code Transformation** - Remove IDs, classes, sizing, and format output
- **Live Preview** - See changes instantly with theme color previews
- **Modern Interface** - Built with shadcn/ui components

## How It Works

1. **Import** - Paste or upload your SVG
2. **Map Colors** - Import your shadcn theme and map SVG colors to theme colors
3. **Configure** - Set export options (React conversion, cleanup, formatting)
4. **Export** - Get theme-aware JSX that uses `hsl(var(--primary))` instead of hex colors

## Theme-Aware Output

Instead of hard-coded colors:
```jsx
<svg fill="#8b5cf6">
  <path d="..." />
</svg>
```

Get theme-integrated components:
```jsx
<svg fill="hsl(var(--primary))">
  <path d="..." />
</svg>
```

## Tech Stack

- React + TypeScript
- Tailwind CSS + shadcn/ui  
- Vite
- Culori (for OKLCH color conversion)

## Development

```bash
npm install
npm run dev
```

## Deployment

```bash
npm run build
```
