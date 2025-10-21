import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/", async (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing ?url=");

  try {
    console.log("Proxying:", target);
    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PanguProxy/1.0)",
        "Referer": target
      }
    });

    // Copy response headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "*");
    res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
    res.set("Content-Type", response.headers.get("content-type") || "application/octet-stream");

    res.status(response.status);
    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Proxy Error: " + err.message);
  }
});

app.listen(10000, () => console.log("✅ HLS Proxy running on port 10000"));
