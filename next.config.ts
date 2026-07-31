import type { NextConfig } from "next";

// Content-Security-Policy
// NOTE: script-src requires 'unsafe-inline' and 'unsafe-eval' because Next.js App Router
// injects inline scripts for RSC streaming / hydration. A nonce-based CSP would be stricter
// but requires middleware changes — worth doing when scaling to production.
// All other directives (connect-src, frame-src, img-src, object-src) provide meaningful
// protection against data exfiltration and clickjacking even with script relaxations.
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.plaid.com https://js.stripe.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // Plaid API calls + Stripe API + Resend (for any client-side calls, though most are server-side)
  "connect-src 'self' https://*.plaid.com https://api.stripe.com https://m.stripe.com https://r.stripe.com https://*.stripe.network",
  // Stripe Elements and Plaid Link each render in an iframe
  "frame-src https://js.stripe.com https://hooks.stripe.com https://*.plaid.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Disallow embedding in iframes (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Force HTTPS for 1 year, include subdomains
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // Limit referrer info sent to third parties
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features not used by this app
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Basic XSS protection for older browsers
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Content Security Policy
  { key: 'Content-Security-Policy', value: cspDirectives },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
