# Website Deployment Target Evaluation

Status: Draft
Scope: SpecBridge AI static launch site only

## Public website boundary

The first public website should be a static marketing and demo-readiness website. It should not process uploaded RFP files, customer documents, personal data-heavy forms, payments, accounts, or live AI requests.

## Options

| Option | Fit | Strength | Constraint | Launch view |
|---|---|---|---|---|
| GitHub Pages | Static website | Simple, low operational surface, custom domain and HTTPS support | Limited backend/form workflow | Good minimum viable deployment |
| Cloudflare Pages | Static website with stronger edge/DNS posture | Git integration, static HTML support, custom domain support, Cloudflare security/DNS ecosystem | Requires Cloudflare account and DNS decisions | Recommended first public launch target |
| Netlify | Static site plus forms | Strong static deployment and built-in form handling | Form submissions create KVKK/privacy handling obligations | Defer backend form usage |
| Vercel | Frontend/app platform | Strong if future site becomes Next.js/app-based | More than needed for a simple static site | Good later-stage option |

## Recommended first launch target

Recommended: Cloudflare Pages

Reasoning:

1. Static launch site is already repo-based.
2. Cloudflare Pages supports Git-based deployment.
3. Cloudflare Pages supports static HTML deployments.
4. Cloudflare custom domain and DNS ecosystem can support a cleaner security posture.
5. Contact form can remain disabled until KVKK and retention model are finalized.

## Minimal alternative

Alternative: GitHub Pages

Use GitHub Pages if the goal is the lowest possible operational footprint and the website remains fully static.

## Deferred options

Netlify and Vercel should remain valid alternatives but should not drive the first launch architecture unless a specific feature requires them.

## External source checkpoints

Official documentation checked during launch planning:

- GitHub Pages custom domain and HTTPS documentation
- Cloudflare Pages Git integration, static HTML deployment, and custom domain documentation
- Netlify domain and form documentation
- Vercel custom domain and deployment documentation

## Deployment decision

Initial decision proposal:

- Production website: Cloudflare Pages
- DNS: Cloudflare-managed if domain purchase and DNS transfer are acceptable
- Backend: None for launch
- Contact: Mailto or controlled business email alias
- File upload: Disabled
- Analytics: Defer or use privacy-conscious analytics only after cookie/privacy notice review