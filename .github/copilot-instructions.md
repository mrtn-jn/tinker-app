# sneaker-heart-simple Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-03

## Active Technologies
- TypeScript 5.9.3 + Next.js 15.5.4 (App Router, static export), React 19.1.1, Tailwind CSS 4.1.14
- Google Sheets API v4 (client-side, no backend) for email storage
- localStorage for session persistence (permanent flags)
- CSS animations (keyframes, transform-based for GPU acceleration)

## Project Structure
```
src/
  components/        # React components (EmailCollectionScreen, SplashScreen, etc.)
  hooks/            # Custom hooks (useEmailSubmission)
  lib/              # External API integrations (googleSheets.ts)
  types/            # TypeScript interfaces (email.ts, sneaker.ts)
  utils/            # Pure functions (emailValidation.ts)
  app/              # Next.js App Router pages
info/               # Static data (sneakers-data.json)
specs/              # Feature specifications
.env.local          # Environment variables (git-ignored)
```

## Commands
npm run dev; npm run build; npm start

## Code Style
TypeScript 5.9.3: Strict mode, explicit types, functional patterns

## Recent Changes
- 005-email-collection-login: ✅ IMPLEMENTED - Email collection screen with blind-lift animation (1200ms), Google Sheets API v4 integration, localStorage persistence, Spanish error messages
- 003-infobox-background-color: Added dynamic InfoBox background colors from sneakers-data.json
- 002-me-gustaria-agregar: Added sneaker completion screen tracking
- 001-sneaker-swipe-feature: Initial swipe gesture implementation

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
