"use strict";

var assert = require("node:assert/strict");
var handler = require("./elevenlabs-signed-url");

function response() {
  return {
    headers: {},
    setHeader: function (key, value) { this.headers[key] = value; },
    status: function (code) { this.statusCode = code; return this; },
    json: function (body) { this.body = body; return this; }
  };
}

async function request(method, ip) {
  var result = response();
  await handler({ method: method, headers: { "x-forwarded-for": ip }, socket: {} }, result);
  return result;
}

(async function () {
  delete process.env.ELEVENLABS_API_KEY;
  delete process.env.ELEVENLABS_AGENT_ID;
  assert.equal((await request("POST", "method-test")).statusCode, 405);
  assert.equal((await request("GET", "config-test")).statusCode, 503);

  process.env.ELEVENLABS_API_KEY = "test-key";
  process.env.ELEVENLABS_AGENT_ID = "agent_test";
  global.fetch = async function () { return { ok: true, json: async function () { return { signed_url: "wss://api.elevenlabs.io/test" }; } }; };
  assert.equal((await request("GET", "success-test")).statusCode, 200);

  var limited;
  for (var index = 0; index <= RATE_LIMIT_FOR_TEST(); index += 1) limited = await request("GET", "limit-test");
  assert.equal(limited.statusCode, 429);
  console.log("signed URL endpoint checks passed");
})().catch(function (error) { console.error(error); process.exitCode = 1; });

function RATE_LIMIT_FOR_TEST() { return 10; }
