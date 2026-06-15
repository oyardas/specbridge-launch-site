# Live Deployment Baseline

Status: Live deployment verified
Repository: specbridge-launch-site
Branch: main
Commit: fd201ad
Commit subject: Add public downloadable sample package
Deployment provider: GitHub Pages
Deployment source: main / root
Core technical repo touched: No

## Live URLs

- Homepage: https://oyardas.github.io/specbridge-launch-site/
- HTML sample package: https://oyardas.github.io/specbridge-launch-site/samples/downloads/specbridge-ai-anonymized-sample-report-package/
- ZIP sample package: https://oyardas.github.io/specbridge-launch-site/assets/downloads/specbridge-ai-anonymized-sample-report-package.zip

## Verified markers

- Download Sample Package
- View HTML Sample
- Not a production SaaS service yet
- Public file upload is not enabled
- Anonymized Sample Report Package

## Public boundary

SpecBridge AI is currently a controlled demo and pilot preparation website. It is not a production SaaS service yet.

The public website does not enable public tender upload, backend processing, account login, payment flow, external AI processing, database read, or live customer document handling.

## Sample package boundary

The public downloadable sample package uses synthetic / anonymized content only. It does not include real customer data, real tender documents, personal data, commercial secrets, or confidential vendor pricing.

## Next deployment tasks

1. Domain decision and purchase.
2. Custom domain configuration.
3. DNS and HTTPS verification.
4. Email alias setup.
5. Privacy/KVKK/legal review before real pilot documents.

<!-- R-LAUNCH.5-C-CUSTOM-DOMAIN-HTTPS-BASELINE:START -->
## R-LAUNCH.5-C Custom Domain HTTPS Verification

Status: Closed

The GitHub Pages custom domain migration is verified and active.

Current public baseline:

- Canonical URL: https://specbridge.co/
- Alias: https://www.specbridge.co/ redirects to https://specbridge.co/
- GitHub Pages custom domain: specbridge.co
- Enforce HTTPS: enabled
- CNAME file: specbridge.co
- Local and remote branch: main
- Local and remote HEAD at verification time: 972554307faa929f0d7186cf0917078d570b917a

Verification outcome:

- HTTPS core: PASS
- Plain HTTP redirect to HTTPS: PASS
- Cache-bypass HTTP redirect to HTTPS: PASS
- Sample HTML over HTTPS: PASS
- Sample ZIP over HTTPS: PASS

No application code, product repo code, database integration, external AI integration, or live evidence lookup was changed during this milestone.
<!-- R-LAUNCH.5-C-CUSTOM-DOMAIN-HTTPS-BASELINE:END -->
