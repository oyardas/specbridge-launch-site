# Security, IP Protection, Hosting, and Data Retention Decisions

Status: Draft
Product: SpecBridge AI
Scope: Launch readiness

## Security posture for website launch

The website should be static-first and low-data.

Launch posture:

- No public file upload
- No login
- No payment
- No customer document processing
- No API key in frontend
- No backend database
- No embedded AI endpoint
- No production RFP processing through website

## Hosting controls

Minimum controls:

1. GitHub account MFA
2. GitHub repository branch protection before production deploy
3. Cloudflare or hosting account MFA
4. DNS registrar MFA
5. Least privilege for collaborators
6. No secrets in repository
7. No private keys in repository
8. No customer files in repository
9. Deployment logs reviewed for secret leakage
10. Security headers evaluated before public launch

## Domain and DNS controls

Before public launch:

1. Use company-owned account where possible
2. Enable registrar lock
3. Enable MFA
4. Configure SPF, DKIM, and DMARC if email is enabled
5. Keep DNS change log
6. Avoid personal mailbox ownership for critical admin functions

## IP protection controls

For current stage:

1. Keep technical core repository separate from launch website repository.
2. Do not publish source implementation details on the website.
3. Publish only anonymized outputs and marketing-level diagrams.
4. Do not expose prompt internals.
5. Do not expose product mapping logic.
6. Do not publish real customer tender documents.
7. Do not publish real vendor pricing.
8. Keep sample reports synthetic or fully anonymized.
9. Separate demo credentials from production credentials.
10. Keep product roadmap public statements high-level.

## Data retention decision

For public website launch:

- Website data retention: none, except hosting logs
- Contact email retention: mailbox policy to be defined
- Uploaded files: not accepted
- Customer tender files: not accepted via public website
- Pilot files: only under written pilot process
- Sample report downloads: anonymous and non-confidential

## Pilot data model

Pilot engagement must define:

1. Who sends documents
2. Where documents are stored
3. Who can access documents
4. Whether documents are anonymized
5. Whether files are deleted after pilot
6. Deletion confirmation process
7. Whether outputs can be used as samples
8. Whether AI providers are used
9. Whether external lookup is used
10. Whether logs contain document text

## Immediate decision

Do not enable backend forms, uploads, analytics cookies, or AI endpoints before the above controls are finalized.