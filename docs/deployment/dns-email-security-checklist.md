# DNS and Email Security Checklist

Status: Draft
Product: SpecBridge AI
Scope: Domain, DNS, and email readiness

## Domain ownership

Before connecting a public domain:

- Domain purchased under controlled account
- Renewal price accepted
- Auto-renew enabled if appropriate
- Registrar MFA enabled
- Registrar lock enabled
- Ownership/invoice details documented
- Recovery email secure

## DNS controls

Minimum DNS controls:

- DNS admin MFA enabled
- DNS change log maintained
- No unused records
- No wildcard records unless required
- No exposed origin IP if not required
- DNSSEC considered after stable setup
- CAA records considered if certificate policy is needed

## Website DNS

For public website:

- Root domain target defined
- `www` target defined
- Canonical domain decision documented
- HTTPS enforced
- Redirect behavior verified

## Email identity

Recommended aliases:

- hello@specbridge.ai
- demo@specbridge.ai
- pilot@specbridge.ai

Minimum controls before publishing email:

- SPF configured
- DKIM configured
- DMARC configured
- MFA enabled on mailbox/admin
- No shared passwords
- Auto-forwarding disabled or controlled
- Sensitive-file warning auto-reply prepared

## Email warning text

Public website should state:

Please do not send confidential tender documents, personal data, commercial secrets, or production files before a pilot agreement and data handling process are confirmed.

## Records to document

| Record type | Purpose | Status |
|---|---|---|
| A / CNAME | Website routing | TBD |
| TXT SPF | Sender policy | TBD |
| TXT DKIM | Email signing | TBD |
| TXT DMARC | Email policy | TBD |
| CAA | Certificate authority control | Optional |
| MX | Mail routing | TBD |

## Decision

Do not publish a contact email or connect production domain until email security and ownership controls are confirmed.