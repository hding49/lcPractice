const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

//load configuration and initialize rate limit buckets
const configPath = path.join(__dirname, "config.json");

function normalizeEndpoint(s) {
  //normalize endpoints strings using trim spaces and uppercase
  return String(s || "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

//load rate limits from config.json into a in-memory Map
function loadBuckets() {
  const raw = fs.readFileSync(configPath, "utf8");
  const cfg = JSON.parse(raw);
  const map = new Map();

  for (const rl of cfg.rateLimitsPerEndpoint || []) {
    const key = normalizeEndpoint(rl.endpoint);
    map.set(key, {
      burst: Number(rl.burst), // Max capacity of the bucket
      sustained: Number(rl.sustained), // Refill rate (tokens per min)
      tokens: Number(rl.burst), // Current available tokens
      lastRefill: Date.now(), // Timestamp of last refill
    });
  }

  return map;
}

let buckets = loadBuckets();

//token bucket core logic --- lazy refill approach
function takeToken(endpointKey) {
  const key = normalizeEndpoint(endpointKey);
  const bucket = buckets.get(key);
  if (!bucket) return { exists: false, accepted: false, remaining: 0 };

  const now = Date.now();
  const ratePerMs = bucket.sustained / 60000; // token per millisecond

  const elapsed = now - bucket.lastRefill;

  //refill based on time passed since last refill
  if (elapsed > 0 && ratePerMs > 0) {
    const refill = elapsed * ratePerMs;
    bucket.tokens = Math.min(bucket.burst, bucket.tokens + refill);
    bucket.lastRefill = now;
  }

  //consume one token if available
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return {
      exists: true,
      accepted: true,
      remaining: Math.floor(bucket.tokens),
    };
  }

  //no tokens available
  return {
    exists: true,
    accepted: false,
    remaining: Math.floor(bucket.tokens),
  };
}

//API routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Post /take
// request body : {endpoint: "GET /user/:id"}
// response: {accepted: boolean, remaining: number}
app.post("/take", (req, res) => {
  const endpoint = req.body && req.body.endpoint;
  if (!endpoint) {
    return res
      .status(400)
      .json({ error: "endpoint is required", accepted: false, remaining: 0 });
  }

  const result = takeToken(endpoint);

  //if endpoint not found, treat it as rejection but valid, not 404
  if (!result.exists) {
    return res.status(200).json({ accepted: false, remaining: 0 });
  }

  //Accepted (token consumed)
  if (result.accepted) {
    return res
      .status(200)
      .json({ accepted: true, remaining: result.remaining });
  }

  //Rejection ( No token left)
  return res.status(200).json({ accepted: false, remaining: 0 });
});

module.exports = app;
