import { EventEmitter } from "events";

// Singleton EventEmitter to bridge Server Actions and SSE Streams.
// We store it in `global` to ensure it's a true singleton across all entry points,
// even if Next.js/Turbopack bundles things into separate chunks in production.
interface GlobalWithEmitter {
  realtimeEmitter?: EventEmitter & { id?: string };
}

const globalForRealtime = global as unknown as GlobalWithEmitter;

// Initialize the emitter with a unique identifier for server-side diagnostics
if (!globalForRealtime.realtimeEmitter) {
  const newEmitter = new EventEmitter() as EventEmitter & { id: string };
  newEmitter.id = Math.random().toString(36).substring(7);
  globalForRealtime.realtimeEmitter = newEmitter;
  console.log(`[Realtime] Initialized Emitter instance: ID=${newEmitter.id}`);
}

const emitter = globalForRealtime.realtimeEmitter!;

export const RealtimeEmitter = {
  // Return the current instance for diagnostic identification
  getInstanceId: () => emitter.id,

  // Emit a refresh signal for a specific publicToken
  notify: (publicToken: string) => {
    console.log(`[Realtime][ID=${emitter.id}] Notify refresh for: ${publicToken}`);
    emitter.emit(`refresh:${publicToken}`);
  },

  // Subscribe to refresh signals for a specific publicToken
  subscribe: (publicToken: string, callback: () => void) => {
    const eventName = `refresh:${publicToken}`;
    console.log(`[Realtime][ID=${emitter.id}] Subscribing to: ${publicToken}`);
    emitter.on(eventName, callback);
    return () => {
      console.log(`[Realtime][ID=${emitter.id}] Unsubscribing from: ${publicToken}`);
      emitter.off(eventName, callback);
    };
  },
};
