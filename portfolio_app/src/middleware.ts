import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware to enforce security for Cloud Run services behind a global load balancer.
 *
 * This middleware checks for a specific secret header added by the Google Cloud Load Balancer.
 * Requests without this header (or with an incorrect value) are rejected with a 403 Forbidden status.
 * This prevents direct access to the Cloud Run service URL, ensuring all traffic
 * passes through the load balancer and its associated security policies (e.g., Cloud Armor).
 */
export function middleware(request: NextRequest) {
  // The secret header and its expected value, configured in the Google Cloud Load Balancer.
  // This value must match the 'X-Cloud-Run-Proxy' header set in network/main.tf.
  const proxyHeader = request.headers.get('x-cloud-run-proxy');
  const expectedValue = 'aBcDeFgHiJkLmNoPqRsTuVwXyZ123456';

  // Bypass the security check during local development.
  // This allows developers to run the application locally without needing the secret header.
  // In production (NODE_ENV !== 'development'), the check will be enforced.
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // If the secret header is missing or does not match the expected value,
  // reject the request to prevent unauthorized direct access.
  if (proxyHeader !== expectedValue) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // If the header is valid, allow the request to proceed to the application.
  return NextResponse.next();
}

/**
 * Configuration for the middleware.
 * The 'matcher' defines which paths the middleware should run on.
 * '/:path*' ensures the middleware runs for all incoming requests.
 */
export const config = {
  matcher: '/:path*',
};
