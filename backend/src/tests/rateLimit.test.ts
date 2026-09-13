import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import rateLimit from "express-rate-limit";

describe("Rate Limiter", () => {
  it("should return 429 after exceeding the request limit", async () => {
    const app = express();

    const testRateLimiter = rateLimit({
      windowMs: 60 * 1000,
      limit: 3,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: {
        success: false,
        message: "Too many requests. Please try again later.",
      },
    });

    app.get("/test", testRateLimiter, (_req, res) => {
      res.status(200).json({
        success: true,
      });
    });

    // First request
    await request(app)
      .get("/test")
      .expect(200);

    // Second request
    await request(app)
      .get("/test")
      .expect(200);

    // Third request
    await request(app)
      .get("/test")
      .expect(200);

    // Fourth request should be blocked
    const response = await request(app)
      .get("/test")
      .expect(429)
      .expect("Content-Type", /application\/json/);

    expect(response.body.success).toBe(false);

    expect(response.body.message).toBe(
      "Too many requests. Please try again later."
    );
  });
});
