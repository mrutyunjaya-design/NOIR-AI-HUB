# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in NOIR AI HUB, please email security@noir-ai-hub.dev with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

Please do not open public issues for security vulnerabilities.

## Security Practices

NOIR AI HUB follows these security principles:

### Authentication & Authorization
- JWT with short-lived access tokens (15 minutes)
- Rotating refresh tokens with secure cookies
- Argon2id password hashing
- Email verification for new accounts
- Account lockout after failed attempts
- Password reset tokens with expiration

### Data Protection
- HTTPS/TLS for all communications
- Encrypted provider credentials in database
- Server-side encryption keys (never in frontend)
- Secure session management
- Input validation with Zod
- SQL injection prevention (Prisma ORM)

### API Security
- Rate limiting per user/IP
- Request size limits
- CORS restrictions
- CSRF protection
- Security headers (CSP, X-Frame-Options, etc.)
- XSS protection
- Provider API key isolation
- Audit logging of sensitive operations

### Infrastructure
- WAF/DDoS protection (Cloudflare)
- Nginx reverse proxy
- Database connection pooling
- Redis access restrictions
- Secret management via environment variables
- No secrets in version control

### Provider Integration
- Provider timeouts
- Retry limits
- Error sanitization
- No logging of provider responses
- Credential encryption
- Access token isolation

### File Handling
- File type validation
- File size limits
- Virus/malware scanning
- Secure storage with signed URLs
- User isolation (no cross-account access)

### Compliance
- GDPR-ready (data export, deletion)
- Privacy-by-design
- Minimal data collection
- Transparent data handling
- User consent for tracking

## Dependencies

We use:
- Dependabot for automated dependency updates
- npm audit for vulnerability scanning
- Security-focused libraries (Argon2, Helmet, etc.)

## Support

For security questions or concerns, please contact: security@noir-ai-hub.dev

## Updates

Security updates will be released as patch versions and announced promptly.
