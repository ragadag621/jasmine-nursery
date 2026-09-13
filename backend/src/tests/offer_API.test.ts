import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";

import app from "../app";
import { connectDB, disconnectDB } from "../config/db";
import { Offer } from "../models";

describe("Offer API", () => {
  const api = request(app);

  let adminCookie: string | string[] | undefined;

  let testOfferId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await connectDB();

    const testOffer = await Offer.create({
      title: {
        ar: "عرض اختبار",
        he: "מבצע בדיקה",
      },
      description: {
        ar: "وصف عرض الاختبار",
        he: "תיאור מבצע הבדיקה",
      },
      isActive: true,
    });

    testOfferId = testOffer._id;

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
    await Offer.findByIdAndDelete(testOfferId);

    await disconnectDB();
  });

  describe("GET /api/offers", () => {
    it("should return offers publicly", async () => {
      const response = await api
        .get("/api/offers")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      const testOffer = response.body.data.find(
        (offer: { _id: string }) =>
          offer._id === testOfferId.toString()
      );

      expect(testOffer).toBeDefined();
      expect(testOffer.title).toEqual({
        ar: "عرض اختبار",
        he: "מבצע בדיקה",
      });
      expect(testOffer.description).toEqual({
        ar: "وصف عرض الاختبار",
        he: "תיאור מבצע הבדיקה",
      });
    });

    it("should filter offers by active=true", async () => {
      const response = await api
        .get("/api/offers")
        .query({ active: true })
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      expect(
        response.body.data.every(
          (offer: { isActive: boolean }) =>
            offer.isActive === true
        )
      ).toBe(true);

      const testOffer = response.body.data.find(
        (offer: { _id: string }) =>
          offer._id === testOfferId.toString()
      );

      expect(testOffer).toBeDefined();
    });

    it("should filter offers by active=false", async () => {
      const inactiveOffer = await Offer.create({
        title: {
          ar: "عرض غير فعال للاختبار",
          he: "מבצע לא פעיל לבדיקה",
        },
        description: {
          ar: "وصف عرض غير فعال للاختبار",
          he: "תיאור מבצע לא פעיל לבדיקה",
        },
        isActive: false,
      });

      try {
        const response = await api
          .get("/api/offers")
          .query({ active: false })
          .expect(200)
          .expect("Content-Type", /application\/json/);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);

        expect(
          response.body.data.every(
            (offer: { isActive: boolean }) =>
              offer.isActive === false
          )
        ).toBe(true);

        const returnedOffer = response.body.data.find(
          (offer: { _id: string }) =>
            offer._id === inactiveOffer._id.toString()
        );

        expect(returnedOffer).toBeDefined();
      } finally {
        await Offer.findByIdAndDelete(inactiveOffer._id);
      }
    });

    it("should reject an invalid active query value", async () => {
      const response = await api
        .get("/api/offers")
        .query({ active: "invalid" })
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/offers", () => {
    it("should create an offer without an image", async () => {
      let createdOfferId: mongoose.Types.ObjectId | undefined;

      try {
        const response = await api
          .post("/api/offers")
          .set("Cookie", adminCookie!)
          .field(
            "title",
            JSON.stringify({
              ar: "عرض جديد",
              he: "מבצע חדש",
            })
          )
          .field(
            "description",
            JSON.stringify({
              ar: "وصف العرض الجديد",
              he: "תיאור המבצע החדש",
            })
          )
          .field("isActive", "true")
          .expect(201)
          .expect("Content-Type", /application\/json/);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(
          "Offer created successfully"
        );
        expect(response.body.data).toBeDefined();

        createdOfferId = new mongoose.Types.ObjectId(
          response.body.data._id
        );

        expect(response.body.data.title).toEqual({
          ar: "عرض جديد",
          he: "מבצע חדש",
        });

        expect(response.body.data.description).toEqual({
          ar: "وصف العرض الجديد",
          he: "תיאור המבצע החדש",
        });

        expect(response.body.data.isActive).toBe(true);

        const createdOffer = await Offer.findById(createdOfferId);

        expect(createdOffer).not.toBeNull();
        expect(createdOffer!.title.toObject()).toEqual({
          ar: "عرض جديد",
          he: "מבצע חדש",
        });
        expect(createdOffer!.isActive).toBe(true);
      } finally {
        if (createdOfferId) {
          await Offer.findByIdAndDelete(createdOfferId);
        }
      }
    });

    it("should reject unauthenticated requests", async () => {
      const response = await api
        .post("/api/offers")
        .field(
          "title",
          JSON.stringify({
            ar: "عرض",
            he: "מבצע",
          })
        )
        .field(
          "description",
          JSON.stringify({
            ar: "وصف العرض",
            he: "תיאור המבצע",
          })
        )
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should reject an invalid title", async () => {
      const response = await api
        .post("/api/offers")
        .set("Cookie", adminCookie!)
        .field(
          "title",
          JSON.stringify({
            ar: "",
            he: "מבצע",
          })
        )
        .field(
          "description",
          JSON.stringify({
            ar: "وصف العرض",
            he: "תיאור המבצע",
          })
        )
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should reject an invalid description", async () => {
      const response = await api
        .post("/api/offers")
        .set("Cookie", adminCookie!)
        .field(
          "title",
          JSON.stringify({
            ar: "عرض",
            he: "מבצע",
          })
        )
        .field(
          "description",
          JSON.stringify({
            ar: "",
            he: "תיאור",
          })
        )
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should reject a missing title", async () => {
      const response = await api
        .post("/api/offers")
        .set("Cookie", adminCookie!)
        .field(
          "description",
          JSON.stringify({
            ar: "وصف العرض",
            he: "תיאור המבצע",
          })
        )
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should reject a missing description", async () => {
      const response = await api
        .post("/api/offers")
        .set("Cookie", adminCookie!)
        .field(
          "title",
          JSON.stringify({
            ar: "عرض",
            he: "מבצע",
          })
        )
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/offers/:id", () => {
    it("should update offer metadata", async () => {
      const newTitle = {
        ar: "عرض محدث",
        he: "מבצע מעודכן",
      };

      const response = await api
        .put(`/api/offers/${testOfferId}`)
        .set("Cookie", adminCookie!)
        .field("title", JSON.stringify(newTitle))
        .field("isActive", "false")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Offer updated successfully"
      );
      expect(response.body.data._id).toBe(
        testOfferId.toString()
      );
      expect(response.body.data.title).toEqual(newTitle);
      expect(response.body.data.isActive).toBe(false);

      const updatedOffer = await Offer.findById(testOfferId);

      expect(updatedOffer).not.toBeNull();
      expect(updatedOffer!.title).toEqual(newTitle);
      expect(updatedOffer!.isActive).toBe(false);
    });

    it("should update offer dates", async () => {
      const startDate = "2026-09-01T00:00:00.000Z";
      const endDate = "2026-09-30T23:59:59.000Z";

      const response = await api
        .put(`/api/offers/${testOfferId}`)
        .set("Cookie", adminCookie!)
        .field("startDate", startDate)
        .field("endDate", endDate)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);

      expect(
        new Date(response.body.data.startDate).toISOString()
      ).toBe(startDate);

      expect(
        new Date(response.body.data.endDate).toISOString()
      ).toBe(endDate);

      const updatedOffer = await Offer.findById(testOfferId);

      expect(updatedOffer).not.toBeNull();
      expect(updatedOffer!.startDate?.toISOString()).toBe(startDate);
      expect(updatedOffer!.endDate?.toISOString()).toBe(endDate);
    });

    it("should reject an unauthenticated update request", async () => {
      const response = await api
        .put(`/api/offers/${testOfferId}`)
        .field("isActive", "true")
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should return 404 for a nonexistent offer", async () => {
      const nonexistentId = new mongoose.Types.ObjectId();

      const response = await api
        .put(`/api/offers/${nonexistentId}`)
        .set("Cookie", adminCookie!)
        .field("isActive", "false")
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Offer not found");
    });

    it("should reject an invalid offer id", async () => {
      const response = await api
        .put("/api/offers/not-a-valid-id")
        .set("Cookie", adminCookie!)
        .field("isActive", "false")
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/offers/:id", () => {
    it("should delete an offer", async () => {
      const offerToDelete = await Offer.create({
        title: {
          ar: "عرض للحذف",
          he: "מבצע למחיקה",
        },
        description: {
          ar: "عرض مخصص لاختبار الحذف",
          he: "מבצע המיועד לבדיקת מחיקה",
        },
        isActive: true,
      });

      const response = await api
        .delete(`/api/offers/${offerToDelete._id}`)
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Offer deleted successfully"
      );

      const deletedOffer = await Offer.findById(offerToDelete._id);

      expect(deletedOffer).toBeNull();
    });

    it("should reject an unauthenticated delete request", async () => {
      const response = await api
        .delete(`/api/offers/${testOfferId}`)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });

    it("should return 404 for a nonexistent offer", async () => {
      const nonexistentId = new mongoose.Types.ObjectId();

      const response = await api
        .delete(`/api/offers/${nonexistentId}`)
        .set("Cookie", adminCookie!)
        .expect(404)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Offer not found");
    });

    it("should reject an invalid offer id", async () => {
      const response = await api
        .delete("/api/offers/not-a-valid-id")
        .set("Cookie", adminCookie!)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(false);
    });
  });
});