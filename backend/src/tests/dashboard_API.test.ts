import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";

import app from "../app";
import { connectDB, disconnectDB } from "../config/db";
import { Plant, Category, Gallery, Contact } from "../models";

describe("Dashboard API", () => {
  const api = request(app);

  let adminCookie: string | string[] | undefined;

  beforeAll(async () => {
    await connectDB();

    const username = (
      process.env.SEED_ADMIN_USERNAME || "admin"
    ).toLowerCase();

    const password =
      process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

    const response = await api
      .post("/api/auth/login")
      .send({
        username,
        password,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.success).toBe(true);

    adminCookie = response.headers["set-cookie"];

    expect(adminCookie).toBeDefined();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe("GET /api/dashboard/stats", () => {
    it("should return dashboard statistics for an authenticated admin", async () => {
      const [
        plantCount,
        categoryCount,
        galleryItems,
        newMessageCount,
        totalMessageCount,
      ] = await Promise.all([
        Plant.countDocuments({}),
        Category.countDocuments({}),
        Gallery.find({}, "images"),
        Contact.countDocuments({ status: "new" }),
        Contact.countDocuments({}),
      ]);

      const expectedGalleryImageCount = galleryItems.reduce(
        (sum, item) => sum + item.images.length,
        0
      );

      const response = await api
        .get("/api/dashboard/stats")
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();

      expect(response.body.data).toEqual({
        plants: plantCount,
        categories: categoryCount,
        galleryImages: expectedGalleryImageCount,
        newMessages: newMessageCount,
        totalMessages: totalMessageCount,
      });
    });

    it("should return all expected statistic fields", async () => {
      const response = await api
        .get("/api/dashboard/stats")
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toHaveProperty("plants");
      expect(response.body.data).toHaveProperty("categories");
      expect(response.body.data).toHaveProperty("galleryImages");
      expect(response.body.data).toHaveProperty("newMessages");
      expect(response.body.data).toHaveProperty("totalMessages");
    });

    it("should return numeric values for all statistics", async () => {
      const response = await api
        .get("/api/dashboard/stats")
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const { plants, categories, galleryImages, newMessages, totalMessages } =
        response.body.data;

      expect(typeof plants).toBe("number");
      expect(typeof categories).toBe("number");
      expect(typeof galleryImages).toBe("number");
      expect(typeof newMessages).toBe("number");
      expect(typeof totalMessages).toBe("number");
    });

    it("should return non-negative statistics", async () => {
      const response = await api
        .get("/api/dashboard/stats")
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const {
        plants,
        categories,
        galleryImages,
        newMessages,
        totalMessages,
      } = response.body.data;

      expect(plants).toBeGreaterThanOrEqual(0);
      expect(categories).toBeGreaterThanOrEqual(0);
      expect(galleryImages).toBeGreaterThanOrEqual(0);
      expect(newMessages).toBeGreaterThanOrEqual(0);
      expect(totalMessages).toBeGreaterThanOrEqual(0);
    });

    it("should have newMessages less than or equal to totalMessages", async () => {
      const response = await api
        .get("/api/dashboard/stats")
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const { newMessages, totalMessages } = response.body.data;

      expect(newMessages).toBeLessThanOrEqual(totalMessages);
    });

    it("should reject unauthenticated requests", async () => {
      const response = await api
        .get("/api/dashboard/stats")
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });
  });
});