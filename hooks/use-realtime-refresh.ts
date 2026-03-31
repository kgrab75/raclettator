'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Hook to subscribe to real-time events for a specific event (publicToken).
 * When an 'update' is detected on the server, it triggers a router.refresh()
 * to re-fetch Server Component data.
 */
export function useRealtimeRefresh(publicToken: string) {
  const router = useRouter();

  useEffect(() => {
    if (!publicToken) return;

    // 1. Establish SSE connection
    const url = `/api/realtime/${publicToken}`;
    console.log(`[Realtime] Attempting connection to: ${url}`);
    const eventSource = new EventSource(url);

    // 2. Listen for 'refresh' events
    eventSource.onopen = () => {
      console.log(`[Realtime] SSE Connection established for token: ${publicToken}`);
    };

    eventSource.addEventListener('refresh', (event) => {
      console.log('[Realtime] Refresh signal received:', event.data);
      router.refresh();
    });

    eventSource.addEventListener('connected', (event) => {
      console.log('[Realtime] Initial handshake received:', event.data);
    });

    // 3. Handle errors (e.g. server restart)
    eventSource.onerror = (error) => {
      // EventSource.readyState 2 means closed. 0 means connecting. 1 means open.
      if (eventSource.readyState === 2) {
        console.error('[Realtime] Connection failed and closed.');
      } else {
        console.warn('[Realtime] Connection interrupted, brother will automatically reconnect.', error);
      }
    };

    // 4. Cleanup on unmount
    return () => {
      console.log('[Realtime] Unmounting hook, closing SSE.');
      eventSource.close();
    };
  }, [publicToken, router]);
}
