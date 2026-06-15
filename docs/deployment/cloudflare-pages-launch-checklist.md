# Cloudflare Pages Launch Checklist

Status: Draft
Product: SpecBridge AI
Scope: Primary static website deployment path

## Recommended use

Cloudflare Pages is the recommended first public deployment target for SpecBridge AI launch site.

## Pre-account checklist

- Cloudflare account available
- MFA enabled
- Recovery email controlled
- Admin access not shared through a common password
- Domain ownership plan defined
- GitHub repository access confirmed

## Repository settings

Repository:

- GitHub: https://github.com/oyardas/specbridge-launch-site
- Branch: main
- Static source: repository root or defined static output folder
- Build command: none unless a build step is later introduced
- Output directory: repository root or selected static directory

## Deployment settings

Initial recommended settings:

| Setting | Value |
|---|---|
| Framework preset | None / Static |
| Build command | Empty |
| Output directory | / |
| Production branch | main |
| Preview deployments | Enabled for review only |
| Environment variables | None |

## Domain connection

Do not connect a production custom domain until:

1. Domain purchase is complete
2. Registrar account MFA is enabled
3. DNS ownership is clear
4. Email plan is defined
5. SPF/DKIM/DMARC plan is defined
6. Legal footer links are live
7. No backend/contact form is enabled

## Security posture

Required before public launch:

- No secrets in repository
- No customer files in repository
- No production API keys
- No upload endpoint
- No form backend
- No analytics requiring cookie notice unless reviewed
- No public product login link
- No public SaaS claims

## Deployment steps

1. Connect GitHub repository to Cloudflare Pages
2. Select `main` as production branch
3. Set framework to static/no framework
4. Keep build command empty
5. Set output directory to root or confirmed static directory
6. Deploy preview
7. Review homepage
8. Review all internal links
9. Review legal/footer links
10. Review mobile view
11. Review security wording
12. Only then publish/route domain

## Rollback plan

If public content is incorrect:

1. Disable custom domain route or pause project
2. Revert latest website commit
3. Push corrected commit
4. Confirm deployment output
5. Re-enable route

## Launch decision

Use Cloudflare Pages only for static website hosting at this stage. Do not enable Cloudflare Workers, serverless functions, backend forms, customer uploads, or AI endpoints in the first public launch.