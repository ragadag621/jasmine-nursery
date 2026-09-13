import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";

import app from "../app";
import { connectDB, disconnectDB } from "../config/db";
import { Gallery } from "../models";

describe("Gallery API", () => {
  const api = request(app);

  let adminCookie: string | string[] | undefined;

  let testGalleryId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await connectDB();

    const testGallery = await Gallery.create({
      title: {
        ar: "معرض اختبار",
        he: "גלריית בדיקה",
      },
      category: "test",
      images: [],
    });

    testGalleryId = testGallery._id;

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
    await Gallery.findByIdAndDelete(testGalleryId);

    await disconnectDB();
  });

  describe("GET /api/gallery", () => {
    it("should return gallery items publicly", async () => {
      const response = await api
        .get("/api/gallery")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      const testItem = response.body.data.find(
        (item: { _id: string }) =>
          item._id === testGalleryId.toString()
      );

      expect(testItem).toBeDefined();
      expect(testItem.title).toEqual({
        ar: "معرض اختبار",
        he: "גלריית בדיקה",
      });
      expect(testItem.category).toBe("test");
      expect(testItem.images).toEqual([]);
    });

    it("should filter gallery items by category", async () => {
      const response = await api
        .get("/api/gallery")
        .query({ category: "test" })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      expect(
        response.body.data.every(
          (item: { category: string }) =>
            item.category === "test"
        )
      ).toBe(true);

      const testItem = response.body.data.find(
        (item: { _id: string }) =>
          item._id === testGalleryId.toString()
      );

      expect(testItem).toBeDefined();
    });

    it("should treat category filter as case-insensitive", async () => {
      const response = await api
        .get("/api/gallery")
        .query({ category: "TEST" })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);

      const testItem = response.body.data.find(
        (item: { _id: string }) =>
          item._id === testGalleryId.toString()
      );

      expect(testItem).toBeDefined();
    });
  });

  describe("POST /api/gallery", () => {
    it("should reject unauthenticated requests", async () => {
      const response = await api
        .post("/api/gallery")
        .field(
          "title",
          JSON.stringify({
            ar: "معرض جديد",
            he: "גלריה חדשה",
          })
        )
        .field("category", "test")
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should reject a gallery item without images", async () => {
      const response = await api
        .post("/api/gallery")
        .set("Cookie", adminCookie!)
        .field(
          "title",
          JSON.stringify({
            ar: "معرض جديد",
            he: "גלריה جديدة",
          })
        )
        .field("category", "test")
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "At least one image is required"
      );
    });

    it("should reject an invalid gallery title", async () => {
      const response = await api
        .post("/api/gallery")
        .set("Cookie", adminCookie!)
        .field(
          "title",
          JSON.stringify({
            ar: "",
            he: "גלריה חדשה",
          })
        )
        .field("category", "test")
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should reject a missing category", async () => {
      const response = await api
        .post("/api/gallery")
        .set("Cookie", adminCookie!)
        .field(
          "title",
          JSON.stringify({
            ar: "معرض جديد",
            he: "גלריה חדשה",
          })
        )
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/gallery/:id", () => {
    it("should update gallery metadata without uploading new images", async () => {
      const newCategory = "updated-test";

      const response = await api
        .put(`/api/gallery/${testGalleryId}`)
        .set("Cookie", adminCookie!)
        .field("category", newCategory)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Gallery item updated successfully"
      );
      expect(response.body.data._id).toBe(
        testGalleryId.toString()
      );
      expect(response.body.data.category).toBe(newCategory);

      const updatedGallery = await Gallery.findById(testGalleryId);

      expect(updatedGallery).not.toBeNull();
      expect(updatedGallery!.category).toBe(newCategory);
    });

    it("should update localized title", async () => {
      const newTitle = {
        ar: "معرض محدث",
        he: "גלריה מעודכנת",
      };

      const response = await api
        .put(`/api/gallery/${testGalleryId}`)
        .set("Cookie", adminCookie!)
        .field("title", JSON.stringify(newTitle))
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toEqual(newTitle);

      const updatedGallery = await Gallery.findById(testGalleryId);

      expect(updatedGallery).not.toBeNull();
      expect(updatedGallery!.title.toObject()).toEqual(newTitle);
    });

    it("should reject an unauthenticated update request", async () => {
      const response = await api
        .put(`/api/gallery/${testGalleryId}`)
        .field("category", "unauthorized-test")
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should return 404 for a nonexistent gallery item", async () => {
      const nonexistentId = new mongoose.Types.ObjectId();

      const response = await api
        .put(`/api/gallery/${nonexistentId}`)
        .set("Cookie", adminCookie!)
        .field("category", "test")
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should reject an invalid gallery id", async () => {
      const response = await api
        .put("/api/gallery/not-a-valid-id")
        .set("Cookie", adminCookie!)
        .field("category", "test")
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/gallery/:id", () => {
    it("should reject an unauthenticated delete request", async () => {
      const response = await api
        .delete(`/api/gallery/${testGalleryId}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should return 404 for a nonexistent gallery item", async () => {
      const nonexistentId = new mongoose.Types.ObjectId();

      const response = await api
        .delete(`/api/gallery/${nonexistentId}`)
        .set("Cookie", adminCookie!)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Gallery item not found"
      );
    });
  });

  describe("DELETE /api/gallery/:id/images/:imageId", () => {
    it("should return 404 when the gallery item does not exist", async () => {
      const nonexistentGalleryId = new mongoose.Types.ObjectId();
      const imageId = new mongoose.Types.ObjectId();

      const response = await api
        .delete(
          `/api/gallery/${nonexistentGalleryId}/images/${imageId}`
        )
        .set("Cookie", adminCookie!)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Gallery item not found"
      );
    });

    it("should return 404 when the image does not exist on the gallery item", async () => {
      const nonexistentImageId = new mongoose.Types.ObjectId();

      const response = await api
        .delete(
          `/api/gallery/${testGalleryId}/images/${nonexistentImageId}`
        )
        .set("Cookie", adminCookie!)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Image not found on this gallery item"
      );
    });

    it("should reject an unauthenticated image delete request", async () => {
      const imageId = new mongoose.Types.ObjectId();

      const response = await api
        .delete(
          `/api/gallery/${testGalleryId}/images/${imageId}`
        )
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });
  });
});