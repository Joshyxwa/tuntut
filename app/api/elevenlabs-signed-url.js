/* Vercel function: exchange server-only credentials for a short-lived voice URL. */
module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  var apiKey = process.env.ELEVENLABS_API_KEY;
  var agentId = process.env.ELEVENLABS_AGENT_ID;
  if (!apiKey || !agentId) {
    return response.status(503).json({ error: "Voice guide is not configured" });
  }

  try {
    var upstream = await fetch(
      "https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=" + encodeURIComponent(agentId),
      { headers: { "xi-api-key": apiKey, Accept: "application/json" } }
    );

    if (!upstream.ok) {
      return response.status(502).json({ error: "Voice provider is unavailable" });
    }

    var result = await upstream.json();
    response.setHeader("Cache-Control", "no-store");
    return response.status(200).json({ signedUrl: result.signed_url });
  } catch (error) {
    return response.status(502).json({ error: "Voice provider is unavailable" });
  }
};
