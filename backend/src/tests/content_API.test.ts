import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";

import app from "../app";
import { connectDB, disconnectDB } from "../config/db";
import { SiteContent } from "../models";

describe("Content API", () => {
  const api = request(app);

  let adminCookie: string | string[] | undefined;

  let originalPhone: string | undefined;
  let originalAddress: string | undefined;

  beforeAll(async () => {
    await connectDB();

    const content = await SiteContent.getSingleton();

    originalPhone = content.phone;
    originalAddress = content.address;

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
    try {
      const content = await SiteContent.getSingleton();

      if (originalPhone !== undefined) {
        content.phone = originalPhone;
      }

      if (originalAddress !== undefined) {
        content.address = originalAddress;
      }

      await content.save();
    } finally {
      await disconnectDB();
    }
  });

  describe("GET /api/content", () => {
    it("should return site content publicly", async () => {
      const response = await api
        .get("/api/content")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();

      expect(response.body.data).toHaveProperty("phone");
      expect(response.body.data).toHaveProperty("whatsapp");
      expect(response.body.data).toHaveProperty("address");
    });
  });

  describe("PUT /api/content", () => {
    it("should update site content for an authenticated admin", async () => {
      const newPhone = "0509999999";
      const newAddress = "Test Address";

      const response = await api
        .put("/api/content")
        .set("Cookie", adminCookie!)
        .send({
          phone: newPhone,
          address: newAddress,
        })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Site content updated successfully"
      );

      expect(response.body.data.phone).toBe(newPhone);
      expect(response.body.data.address).toBe(newAddress);

      const updatedContent = await SiteContent.getSingleton();

      expect(updatedContent.phone).toBe(newPhone);
      expect(updatedContent.address).toBe(newAddress);
    });

    it("should reject unauthenticated update requests", async () => {
      const response = await api
        .put("/api/content")
        .send({
          phone: "0501111111",
        })
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should reject an invalid googleRating", async () => {
      const response = await api
        .put("/api/content")
        .set("Cookie", adminCookie!)
        .send({
          googleRating: 6,
        })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should reject a negative googleRating", async () => {
      const response = await api
        .put("/api/content")
        .set("Cookie", adminCookie!)
        .send({
          googleRating: -1,
        })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should reject an invalid googleReviewCount", async () => {
      const response = await api
        .put("/api/content")
        .set("Cookie", adminCookie!)
        .send({
          googleReviewCount: -1,
        })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should reject an invalid localized heroTitle", async () => {
      const response = await api
        .put("/api/content")
        .set("Cookie", adminCookie!)
        .send({
          heroTitle: {
            he: "",
            ar: "عنوان الاختبار",
          },
        })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should reject an invalid openingHours item", async () => {
      const response = await api
        .put("/api/content")
        .set("Cookie", adminCookie!)
        .send({
          openingHours: [
            {
              day: "",
              open: "08:00",
              close: "17:00",
            },
          ],
        })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should accept valid optional social links", async () => {
      const response = await api
        .put("/api/content")
        .set("Cookie", adminCookie!)
        .send({
          socialLinks: {
            instagram: "https://instagram.com/test",
            facebook: "https://facebook.com/test",
            tiktok: "https://tiktok.com/@test",
          },
        })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.data.socialLinks).toBeDefined();
      expect(response.body.data.socialLinks.instagram).toBe(
        "https://instagram.com/test"
      );
    });

    it("should accept a valid google rating and review count", async () => {
      const response = await api
        .put("/api/content")
        .set("Cookie", adminCookie!)
        .send({
          googleRating: 4.8,
          googleReviewCount: 125,
        })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.data.googleRating).toBe(4.8);
      expect(response.body.data.googleReviewCount).toBe(125);
    });

    it("should accept a valid map embed URL", async () => {
      const response = await api
        .put("/api/content")
        .set("Cookie", adminCookie!)
        .send({
          mapEmbedUrl: "https://www.google.com/maps/embed?pb=test",
        })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.data.mapEmbedUrl).toBe(
        "https://www.google.com/maps/embed?pb=test"
      );
    });

    it("should accept valid localized content", async () => {
      const response = await api
        .put("/api/content")
        .set("Cookie", adminCookie!)
        .send({
          heroTitle: {
            he: "כותרת בדיקה",
            ar: "عنوان اختبار",
          },
          heroSubtitle: {
            he: "כתובית בדיקה",
            ar: "وصف اختبار",
          },
          aboutText: {
            he: "טקסט אודות לבדיקה",
            ar: "نص عن المشتل للاختبار",
          },
        })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);

      expect(response.body.data.heroTitle).toEqual({
        he: "כותרת בדיקה",
        ar: "عنوان اختبار",
      });

      expect(response.body.data.heroSubtitle).toEqual({
        he: "כתובית בדיקה",
        ar: "وصف اختبار",
      });

      expect(response.body.data.aboutText).toEqual({
        he: "טקסט אודות לבדיקה",
        ar: "نص عن المشتل للاختبار",
      });
    });

    it("should trim string values before saving", async () => {
      const response = await api
        .put("/api/content")
        .set("Cookie", adminCookie!)
        .send({
          phone: "  0501234567  ",
          address: "  Test Address  ",
        })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);

      expect(response.body.data.phone).toBe("0501234567");
      expect(response.body.data.address).toBe("Test Address");
    });
  });
});