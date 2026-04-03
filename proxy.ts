import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // Générer un nonce unique à chaque requête
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // En mode développement, on a temporairement besoin d'unsafe-eval pour le Fast Refresh de Next.js
  // En production, il sera automatiquement supprimé pour une sécurité maximale.
  const isDev = process.env.NODE_ENV !== 'production';
  const scriptSrc = isDev
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  // Nettoyer les sauts de ligne pour un header propre
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  // Ajouter le nonce et la CSP dans la requête pour que Next.js puisse le lire
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Ajouter le header sur la réponse finale
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
