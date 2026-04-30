# Node.js CLI for Vite React

## Description

Creates a **Vite + React + TypeScript** project and applies a custom setup on top of the default Vite template.

---

## What it does

- Creates a new Vite React TypeScript project
- Installs dependencies
- Applies a project structure
- Replaces default Vite boilerplate
- Opens project in VS Code

## Core modifications

### Project structure changes

- Removes default Vite boilerplate files
- Adds folders for organization:
  - `components/`
  - `routes/`
  - `lib/`
  - `styles/`
  - `assets/`

### Path resolve to @

- Path is resolved using `@` as an alias for the `src` directory
- Allows cleaner import instead of relative paths (similar to NextJS)

### Installed dependencies

#### Dependencies

- `react-router-dom` (For routing)
- `tailwind-merge` (Enables overriding for component styles)

#### Dev dependencies

- `tailwindcss`
- `prettier`
- `prettier-plugin-tailwindcss`
- `vite-plugin-svgr` (SVG as React components)
- `@vitejs/plugin-react`

---

## Notes

- Written for personal use and quick setup
