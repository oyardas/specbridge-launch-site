# Post-Deploy Verification Checklist

Status: Draft
Product: SpecBridge AI
Scope: Checks after website deployment

## Technical checks

After deployment, verify:

- Homepage loads
- CSS loads
- No broken internal links
- No broken legal links
- Mobile rendering acceptable
- HTTPS active
- Canonical domain works
- `www` behavior works if configured
- No browser mixed-content warning
- No unexpected platform banner

## Content checks

Verify:

- Website says SpecBridge AI
- Product positioned as tender intelligence and presales decision support
- Public SaaS claim is absent
- Upload capability is absent
- Login/payment link is absent
- Contact warning is visible
- Demo/pilot stage boundary is clear
- Legal/KVKK draft status is not misleading

## Security checks

Verify:

- No secrets visible in page source
- No customer files in public assets
- No real tender documents in public assets
- No form endpoint active
- No analytics script added without review
- No public AI endpoint visible
- Security headers reviewed if hosting supports them

## Repository checks

After deployment:

- Local HEAD equals remote HEAD
- Working tree clean
- Deployment commit documented
- Rollback commit known
- Production branch unchanged except approved commits

## Launch record template

| Field | Value |
|---|---|
| Deployment platform | TBD |
| Domain / URL | TBD |
| Commit deployed | TBD |
| Date/time | TBD |
| Reviewer | TBD |
| Known limitations | TBD |
| Rollback action | TBD |

## Decision

A deployment is not considered launch-ready until both technical and content checks pass.