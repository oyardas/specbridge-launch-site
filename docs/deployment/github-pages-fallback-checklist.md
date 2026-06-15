# GitHub Pages Fallback Checklist

Status: Draft
Product: SpecBridge AI
Scope: Fallback static website deployment path

## Recommended use

GitHub Pages is the fallback option if Cloudflare Pages setup is deferred.

## Fit

GitHub Pages is acceptable when:

- Website is fully static
- No backend is needed
- No form processing is needed
- No upload is needed
- The goal is fast public preview with minimal operational surface

## Pre-check

- Repository is public or Pages-compatible under current GitHub plan
- Branch is `main`
- Source folder is known
- No secrets exist in repository
- No confidential files exist in repository
- Legal/footer links are ready
- Contact model is email-only

## Deployment settings

Recommended:

| Setting | Value |
|---|---|
| Source | Deploy from branch |
| Branch | main |
| Folder | /root or /docs if site is moved |
| Custom domain | Defer until domain decision |
| Enforce HTTPS | Enable when custom domain is connected |

## Limitations

GitHub Pages should not be used as a backend platform. It should not process contact forms, file uploads, account login, payments, or customer tender documents.

## Go-live steps

1. Enable GitHub Pages for `main`
2. Select correct source folder
3. Wait for deployment
4. Open generated Pages URL
5. Verify homepage
6. Verify legal links
7. Verify CTA behavior
8. Verify there is no upload/contact backend
9. Verify mobile rendering
10. Document generated URL

## Rollback

Rollback options:

1. Disable Pages
2. Revert the website commit
3. Change source folder
4. Remove custom domain if already attached

## Decision

Use GitHub Pages only as a simple static fallback. Cloudflare Pages remains the preferred first public target.