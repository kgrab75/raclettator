import { RealtimeEmitter } from "@/lib/realtime/emitter";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ publicToken: string }> }
) {
  const { publicToken } = await params;

  const stream = new ReadableStream({
    start(controller) {
      console.log(`[SSE] Opening connection for token: ${publicToken}`);
      const encoder = new TextEncoder();

      // Functon to send an event in SSE format:
      // event: <name>\n
      // data: <JSON string>\n\n
      const sendEvent = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      // 1. Initial connection success
      const emitterId = RealtimeEmitter.getInstanceId?.() || "unknown";
      sendEvent("connected", { publicToken, emitterId });

      // 2. Subscribe to the real-time emitter
      const unsubscribe = RealtimeEmitter.subscribe(publicToken, () => {
        sendEvent("refresh", { timestamp: Date.now() });
      });

      // 3. Keep-alive heartbeat every 30 seconds
      const heartbeat = setInterval(() => {
        sendEvent("ping", { time: new Date().toISOString() });
      }, 30000);

      // 4. Cleanup when the connection is closed
      req.signal.onabort = () => {
        console.log(`[SSE] Closing connection for token: ${publicToken}`);
        clearInterval(heartbeat);
        unsubscribe();
        controller.close();
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
