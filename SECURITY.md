# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please DO NOT open a public issue.

Instead, please email: security@aoz.archi

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## Security Best Practices

AOZ Explorer implements:
- Content Security Policy headers
- HTTPS enforcement in production
- Wallet signature verification
- Input validation with Zod schemas
- No private key storage (all signing done in wallet)
- Secure environment variable handling

## Wallet Security

- Never share your private keys
- Always verify transaction details before signing
- Use official Phantom wallet extension
- Keep your wallet software updated
