/* Vercel function: exchange server-only credentials for a short-lived voice URL. */
var requestWindows = new Map();
var RATE_LIMIT = 10;
var RATE_WINDOW_MS = 60000;

module.exports = async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.setHeader("X-Content-Type-Options", "nosniff");
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  var headers = request.headers || {};
  var clientIp = String(headers["x-forwarded-for"] || request.socket && request.socket.remoteAddress || "unknown").split(",")[0].trim();
  var now = Date.now();
  if (requestWindows.size > 1000) requestWindows.forEach(function (value, key) { if (now - value.startedAt >= RATE_WINDOW_MS) requestWindows.delete(key); });
  var window = requestWindows.get(clientIp);
  if (!window || now - window.startedAt >= RATE_WINDOW_MS) {
    window = { startedAt: now, count: 0 };
    requestWindows.set(clientIp, window);
  }
  window.count += 1;
  if (window.count > RATE_LIMIT) {
    response.setHeader("Retry-After", String(Math.ceil((RATE_WINDOW_MS - (now - window.startedAt)) / 1000)));
    return response.status(429).json({ error: "Too many voice-guide requests" });
  }

  var apiKey = process.env.ELEVENLABS_API_KEY;
  var agentId = process.env.ELEVENLABS_AGENT_ID;
  if (!apiKey || !agentId) {
    return response.status(503).json({ error: "Voice guide is not configured" });
  }

  try {
    var upstream = await fetch(
      "https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=" + encodeURIComponent(agentId),
      { headers: { "xi-api-key": apiKey, Accept: "application/json" }, signal: AbortSignal.timeout(8000) }
    );

    if (!upstream.ok) {
      return response.status(502).json({ error: "Voice provider is unavailable" });
    }

    var result = await upstream.json();
    if (!result.signed_url || !/^wss:\/\//.test(result.signed_url)) {
      return response.status(502).json({ error: "Voice provider returned an invalid response" });
    }
    return response.status(200).json({ signedUrl: result.signed_url });
  } catch (error) {
    return response.status(502).json({ error: "Voice provider is unavailable" });
  }
};
