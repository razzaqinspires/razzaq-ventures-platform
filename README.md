# Razzaq Ventures Platform

A private, modular Next.js foundation for the Razzaq Ventures public site and future integrations with internal applications and the Nexora WhatsApp bot.

## Stack
- Next.js App Router + React + TypeScript
- Zod request validation
- Versioned server API routes
- Responsive, custom CSS design; venture content separated from presentation

## Requirements
- Node.js 20.9+
- npm

## Run locally
```bash
cp .env.example .env.local
npm install
npm run dev
```
Open `http://localhost:3000`.

Before testing the integration endpoint, set a long random `INTEGRATION_API_TOKEN` in `.env.local`. Never commit `.env.local` or real credentials. The endpoint is deliberately validation-only and returns `accepted: false`; no bot actions, message forwarding, or persistence are enabled yet.

## Commands
```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm start
```

## Project map
```text
src/app/                 Pages, layout, global styles, API routes
src/app/api/v1/health/    Health endpoint
src/app/api/v1/integrations/ Authenticated integration contract scaffold
src/lib/ventures.ts       Central venture/product data
src/lib/http.ts           Shared API response helpers
docs/ARCHITECTURE.md      Integration principles and API contract
```

## GitHub private repository
Create a private repository under `razzaqinspires` (suggested name: `razzaq-ventures-platform`). Then push this folder:
```bash
git init
git add .
git commit -m "feat: initialize Razzaq Ventures Next.js platform"
git branch -M main
git remote add origin https://github.com/razzaqinspires/razzaq-ventures-platform.git
git push -u origin main
```
Confirm the repository visibility is **Private** in GitHub settings. These commands do not create the GitHub repository automatically.

## Before production
- Replace marketplace search links with verified official store URLs.
- Configure domain, environment variables, monitoring, rate limiting and deployment.
- Add automated tests and CI checks.
- Choose database/queue and identity strategy based on actual bot/platform source.
- Never expose API tokens in browser code or `NEXT_PUBLIC_*` variables.
- Review privacy, consent and data-retention requirements before moving WhatsApp content between services.
