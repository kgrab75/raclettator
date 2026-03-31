import { EventEmitter } from "events";

// Singleton EventEmitter to bridge Server Actions and SSE Streams.
// We store it in `global` to survive hot-reloads during development.
const globalForRealtime = global as unknown as {
  emitter: EventEmitter;
};

const emitter = globalForRealtime.emitter || new EventEmitter();

if (process.env.NODE_ENV !== "production") {
  globalForRealtime.emitter = emitter;
}

export const RealtimeEmitter = {
  // Emit a refresh signal for a specific publicToken
  notify: (publicToken: string) => {
    emitter.emit(`refresh:${publicToken}`);
  },

  // Subscribe to refresh signals for a specific publicToken
  subscribe: (publicToken: string, callback: () => void) => {
    const eventName = `refresh:${publicToken}`;
    emitter.on(eventName, callback);
    return () => {
      emitter.off(eventName, callback);
    };
  },
};
