# blockcell.ai

The official website for Blockcell, built with React, Vite, Tailwind CSS, and Framer Motion.

## Project Overview

This project implements the official website for Blockcell, translating the documentation from `blockcell/docs/site_copy` into a modern, interactive web experience.

### Key Features
- **Modern Tech Stack**: React, Vite, TypeScript, Tailwind CSS
- **Animations**: Powered by Framer Motion
- **Responsive Design**: Mobile-friendly navigation and layout
- **Brand Identity**: Consistent use of Rust (Orange) and Cyber (Green) brand colors

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

- `src/components/layout`: Shared layout components (Navbar, Footer)
- `src/components/ui`: UI components (Logo, etc.)
- `src/pages`: Individual pages content
  - `home.tsx`: Landing page with hero section and value props
  - `features.tsx`: detailed feature grid
  - `architecture.tsx`: System architecture explanation
  - `innovation.tsx`: Key differentiators
  - `docs.tsx`: Getting started guide
- `src/lib`: Utilities (tailwind-merge, clsx)

## Design References

- **Colors**: Derived from `blockcell/webui` (Rust #ea580c, Cyber #00ff9d, Slate background)
- **Logo**: Reimplemented as a pure SVG/CSS component in `src/components/ui/blockcell-logo.tsx` with identical animation to the WebUI.
