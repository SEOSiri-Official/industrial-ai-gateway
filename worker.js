// worker.js - Cloudflare Edge Gateway for SEOSiri Industrial AI Gateway (iaig.seosiri.com)
const SEOSIRI_LICENSING = {
  payoneer_email: "badhan_pbn@yahoo.com",
  corporate_email: "info@seosiri.com",
  portal: "https://developers.seosiri.com"
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, x-seosiri-key",
        },
      });
    }

    if (url.pathname === "/health") {
      return new Response(JSON.stringify({
        status: "HEALTHY",
        service: "SEOSiri Industrial AI Gateway Edge",
        version: "1.0.0",
        active_tools: 10,
        payoneer_monetization_email: SEOSIRI_LICENSING.payoneer_email,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const acceptHeader = request.headers.get("Accept") || "";
    if ((url.pathname === "/" || url.pathname === "") && acceptHeader.includes("text/html")) {
      return Response.redirect("https://www.seosiri.com/2026/08/industrial-ai-gateway.html", 301);
    }

    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response("SEOSiri IAIG Edge Active", { status: 200 });
    }
  }
};
