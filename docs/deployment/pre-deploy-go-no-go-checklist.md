# Pre-Deploy Go / No-Go Checklist

Status: Draft
Product: SpecBridge AI
Scope: Final check before public website deployment

## Go criteria

Public deployment may proceed only if all are true:

- Launch repository is clean
- Latest commit is pushed to remote
- Website has no customer confidential content
- Website has no vendor confidential pricing
- Website has no real tender document
- Website has no upload endpoint
- Website has no backend contact form
- Website has no login/payment claim
- Legal/KVKK links are present or clearly staged
- Product is described as demo/pilot-stage, not production SaaS
- Contact instructions warn users not to send confidential files
- Sample report is anonymized or not yet linked
- Domain and DNS ownership are controlled
- Admin accounts have MFA

## No-go triggers

Do not deploy publicly if any are true:

- Any real customer tender appears in the website
- Any real vendor discount/pricing appears in the website
- Any API key, token, secret, or credential appears in the repository
- Upload/contact backend is enabled without KVKK process
- Product is described as production SaaS
- Legal footer links are missing from public pages
- Domain is controlled through unsecured personal account
- Email SPF/DKIM/DMARC is not planned before publishing email alias

## Manual review checklist

Review these areas before go-live:

1. Homepage hero claims
2. Product capability claims
3. Demo CTA wording
4. Pilot CTA wording
5. Legal footer links
6. Contact section warning
7. Sample report download text
8. Mobile layout
9. External links
10. Browser title and metadata

## Decision record

Before public launch, record:

- Deployment platform
- Domain used
- Git commit deployed
- Reviewer
- Date/time
- Known limitations
- Rollback plan

## Current recommendation

Proceed first with private/preview deployment. Public domain connection should follow after domain, DNS, legal footer, and contact warning are confirmed.