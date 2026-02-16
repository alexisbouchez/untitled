# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hyperbulletin is an open source newsletter platform built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4.

## Development Commands

This project uses **Bun** as the package manager.

- `bun dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

## Architecture

### UI Component System

The project uses shadcn/ui components built on **@base-ui/react** primitives (not Radix UI). Components follow this pattern:

- UI components in `src/components/ui/` use Base UI primitives
- Styled with `class-variance-authority` for variant management
- All client components must have `"use client"` directive
- Use the `cn()` utility from `@/lib/utils` for conditional class merging

### Styling

- **Tailwind CSS v4** with inline `@theme` configuration in `globals.css`
- Custom CSS variables defined for theming (supports dark mode via `.dark` class)
- No standalone `tailwind.config.js` - configuration is in `@import "shadcn/tailwind.css"` and `globals.css`
- Color palette uses OKLCH color space for better perceptual uniformity

### Icons

- Uses **HugeIcons** (`@hugeicons/react`) as the icon library
- Configured in `components.json` as the default icon library

### Path Aliases

TypeScript path alias `@/*` maps to `./src/*`:
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/app` → `src/app`

### Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # React components
│   └── ui/          # shadcn/ui components (Base UI based)
└── lib/             # Utility functions
```

## Key Configuration Files

- `components.json` - shadcn/ui configuration (style: "base-nova")
- `eslint.config.mjs` - ESLint flat config with Next.js presets
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration with strict mode enabled
