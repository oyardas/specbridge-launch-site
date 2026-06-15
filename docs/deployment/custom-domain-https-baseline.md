# Custom Domain HTTPS Baseline

Milestone: R-LAUNCH.5-C / Custom Domain TLS & HTTPS Verification

Status: Closed

Canonical production launch URL:

- https://specbridge.co/

Alias:

- https://www.specbridge.co/ redirects to https://specbridge.co/

GitHub Pages configuration:

- Repository: https://github.com/oyardas/specbridge-launch-site.git
- Branch: main
- Source: / (root)
- Custom domain: specbridge.co
- CNAME file: specbridge.co
- Enforce HTTPS: Enabled

DNS baseline:

- specbridge.co A records:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153
- www.specbridge.co CNAME:
  - oyardas.github.io

Verification result:

- HTTPS core check: PASS
- HTTP to HTTPS redirect: PASS
- www to apex redirect: PASS
- Sample HTML over HTTPS: PASS
- Sample ZIP over HTTPS: PASS

Verified public URLs:

- https://specbridge.co/
- https://www.specbridge.co/
- https://specbridge.co/samples/downloads/specbridge-ai-anonymized-sample-report-package/
- https://specbridge.co/assets/downloads/specbridge-ai-anonymized-sample-report-package.zip

Operational boundary:

- Public upload remains closed.
- Controlled demo / pilot boundary remains active.
- Anonymous sample package is public.
- The launch website is public marketing/demo material only.
- The core SpecBridge AI product remains separate from this launch website repository.
