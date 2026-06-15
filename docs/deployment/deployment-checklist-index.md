# SpecBridge AI Deployment Checklist Index

Status: Draft
Product: SpecBridge AI
Scope: Launch website deployment only
Core repo contact: None

## Purpose

This checklist pack converts the launch deployment decision into executable website deployment preparation.

## Recommended deployment route

Primary route:

- Cloudflare Pages
- Static website
- GitHub repository integration
- No backend
- No upload
- No login
- No payment
- No production AI endpoint

Fallback route:

- GitHub Pages
- Static website
- Custom domain later
- No backend

## Files

1. cloudflare-pages-launch-checklist.md
2. github-pages-fallback-checklist.md
3. dns-email-security-checklist.md
4. pre-deploy-go-no-go-checklist.md
5. post-deploy-verification-checklist.md

## Deployment boundary

The website deployment must not create the impression that SpecBridge AI is already a production SaaS. Public communication should remain within controlled demo and pilot readiness.

## Immediate next decision

Before public deploy, select one of the following:

- Deploy now without custom domain using platform preview URL
- Buy domain first, then deploy with custom domain
- Deploy private preview first, then connect custom domain