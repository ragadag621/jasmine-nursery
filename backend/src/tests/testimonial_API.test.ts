import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";

import app from "../app";
import { connectDB, disconnectDB } from "../config/db";
import { Testimonial } from "../models/Testimonial.model";

describe("Testimonial API", () => {
  let adminCookie: string[] | undefined;
  let testTestimonialId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await connectDB();

    const testimonial = await Testimonial.create({
      customerName: "Test Customer",
      rating: 5,
      text: {
        ar: "تقييم مخصص للاختبار",
        he: "ביקורת המיועדת לבדיקה",
      },
      isVisible: true,
    });

    testTestimonialId = testimonial._id;

    const username = (
      process.env.SEED_ADMIN_USERNAME || "admin"
    ).toLowerCase();

    const password =
      process.env.SEED_ADMIN_PASSWORD ;

    const response = await request(app)
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
    await Testimonial.findByIdAndDelete(testTestimonialId);
    await disconnectDB();
  });

  // ---------------------------------------------------------------------------
  // GET /api/testimonials
  // ---------------------------------------------------------------------------

  it("GET /api/testimonials - should return only visible testimonials publicly", async () => {
    const hiddenTestimonial = await Testimonial.create({
      customerName: "Hidden Test Customer",
      rating: 4,
      text: {
        ar: "تقييم مخفي للاختبار",
        he: "ביקורת מוסתרת לבדיקה",
      },
      isVisible: false,
    });

    try {
      const response = await request(app)
        .get("/api/testimonials")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      const returnedIds = response.body.data.map(
        (testimonial: { _id: string }) => testimonial._id
      );

      expect(returnedIds).toContain(testTestimonialId.toString());
      expect(returnedIds).not.toContain(hiddenTestimonial._id.toString());

      for (const testimonial of response.body.data) {
        expect(testimonial.isVisible).toBe(true);
      }
    } finally {
      await Testimonial.findByIdAndDelete(hiddenTestimonial._id);
    }
  });

  // ---------------------------------------------------------------------------
  // GET /api/testimonials/all
  // ---------------------------------------------------------------------------

  it("GET /api/testimonials/all - should return all testimonials for admin", async () => {
    const hiddenTestimonial = await Testimonial.create({
      customerName: "Hidden Admin Test",
      rating: 3,
      text: {
        ar: "تقييم مخفي للإدارة",
        he: "ביקורת מוסתרת למנהל",
      },
      isVisible: false,
    });

    try {
      const response = await request(app)
        .get("/api/testimonials/all")
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);

      const returnedIds = response.body.data.map(
        (testimonial: { _id: string }) => testimonial._id
      );

      expect(returnedIds).toContain(testTestimonialId.toString());
      expect(returnedIds).toContain(hiddenTestimonial._id.toString());
    } finally {
      await Testimonial.findByIdAndDelete(hiddenTestimonial._id);
    }
  });

  it("GET /api/testimonials/all - should reject unauthenticated requests", async () => {
    await request(app)
      .get("/api/testimonials/all")
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  // ---------------------------------------------------------------------------
  // POST /api/testimonials
  // ---------------------------------------------------------------------------

  it("POST /api/testimonials - should create a testimonial", async () => {
    let createdId: mongoose.Types.ObjectId | undefined;

    try {
      const response = await request(app)
        .post("/api/testimonials")
        .set("Cookie", adminCookie!)
        .send({
          customerName: "Created Test Customer",
          rating: 4,
          text: {
            ar: "تقييم جديد للاختبار",
            he: "ביקורת חדשה לבדיקה",
          },
          isVisible: true,
        })
        .expect(201)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Testimonial created successfully"
      );
      expect(response.body.data).toBeDefined();

      createdId = response.body.data._id;

      const createdTestimonial = await Testimonial.findById(createdId);

      expect(createdTestimonial).not.toBeNull();
      expect(createdTestimonial?.customerName).toBe(
        "Created Test Customer"
      );
      expect(createdTestimonial?.rating).toBe(4);
      expect(createdTestimonial?.text.ar).toBe(
        "تقييم جديد للاختبار"
      );
      expect(createdTestimonial?.text.he).toBe(
        "ביקורת חדשה לבדיקה"
      );
      expect(createdTestimonial?.isVisible).toBe(true);
    } finally {
      if (createdId) {
        await Testimonial.findByIdAndDelete(createdId);
      }
    }
  });

  it("POST /api/testimonials - should use isVisible=true by default", async () => {
    let createdId: mongoose.Types.ObjectId | undefined;

    try {
      const response = await request(app)
        .post("/api/testimonials")
        .set("Cookie", adminCookie!)
        .send({
          customerName: "Default Visibility Test",
          rating: 5,
          text: {
            ar: "اختبار القيمة الافتراضية",
            he: "בדיקת ערך ברירת מחדל",
          },
        })
        .expect(201)
        .expect("Content-Type", /application\/json/);

      createdId = response.body.data._id;

      expect(response.body.data.isVisible).toBe(true);

      const createdTestimonial = await Testimonial.findById(createdId);

      expect(createdTestimonial?.isVisible).toBe(true);
    } finally {
      if (createdId) {
        await Testimonial.findByIdAndDelete(createdId);
      }
    }
  });

  it("POST /api/testimonials - should reject unauthenticated requests", async () => {
    await request(app)
      .post("/api/testimonials")
      .send({
        customerName: "Unauthorized Test",
        rating: 5,
        text: {
          ar: "اختبار",
          he: "בדיקה",
        },
      })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  it("POST /api/testimonials - should reject rating below 1", async () => {
    await request(app)
      .post("/api/testimonials")
      .set("Cookie", adminCookie!)
      .send({
        customerName: "Invalid Rating Test",
        rating: 0,
        text: {
          ar: "تقييم غير صالح",
          he: "דירוג לא תקין",
        },
      })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  it("POST /api/testimonials - should reject rating above 5", async () => {
    await request(app)
      .post("/api/testimonials")
      .set("Cookie", adminCookie!)
      .send({
        customerName: "Invalid Rating Test",
        rating: 6,
        text: {
          ar: "تقييم غير صالح",
          he: "דירוג לא תקין",
        },
      })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  it("POST /api/testimonials - should reject non-integer rating", async () => {
    await request(app)
      .post("/api/testimonials")
      .set("Cookie", adminCookie!)
      .send({
        customerName: "Invalid Rating Test",
        rating: 4.5,
        text: {
          ar: "تقييم غير صحيح",
          he: "דירוג לא שלם",
        },
      })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  it("POST /api/testimonials - should reject missing customerName", async () => {
    await request(app)
      .post("/api/testimonials")
      .set("Cookie", adminCookie!)
      .send({
        rating: 5,
        text: {
          ar: "بدون اسم",
          he: "ללא שם",
        },
      })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  it("POST /api/testimonials - should reject invalid localized text", async () => {
    await request(app)
      .post("/api/testimonials")
      .set("Cookie", adminCookie!)
      .send({
        customerName: "Invalid Text Test",
        rating: 5,
        text: {
          ar: "",
          he: "טקסט תקין",
        },
      })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  // ---------------------------------------------------------------------------
  // PUT /api/testimonials/:id
  // ---------------------------------------------------------------------------

  it("PUT /api/testimonials/:id - should update testimonial", async () => {
    const response = await request(app)
      .put(`/api/testimonials/${testTestimonialId}`)
      .set("Cookie", adminCookie!)
      .send({
        customerName: "Updated Test Customer",
        rating: 4,
        isVisible: false,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Testimonial updated successfully"
    );

    const updatedTestimonial = await Testimonial.findById(
      testTestimonialId
    );

    expect(updatedTestimonial).not.toBeNull();
    expect(updatedTestimonial?.customerName).toBe(
      "Updated Test Customer"
    );
    expect(updatedTestimonial?.rating).toBe(4);
    expect(updatedTestimonial?.isVisible).toBe(false);

    // Restore fixture state for the remaining tests.
    await Testimonial.findByIdAndUpdate(testTestimonialId, {
      customerName: "Test Customer",
      rating: 5,
      isVisible: true,
    });
  });

  it("PUT /api/testimonials/:id - should update localized text", async () => {
    const response = await request(app)
      .put(`/api/testimonials/${testTestimonialId}`)
      .set("Cookie", adminCookie!)
      .send({
        text: {
          ar: "النص المحدث للاختبار",
          he: "הטקסט המעודכן לבדיקה",
        },
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.success).toBe(true);

    const updatedTestimonial = await Testimonial.findById(
      testTestimonialId
    );

    expect(updatedTestimonial?.text.ar).toBe(
      "النص المحدث للاختبار"
    );
    expect(updatedTestimonial?.text.he).toBe(
      "הטקסט המעודכן לבדיקה"
    );

    // Restore fixture state.
    await Testimonial.findByIdAndUpdate(testTestimonialId, {
      text: {
        ar: "تقييم مخصص للاختبار",
        he: "ביקורת המיועדת לבדיקה",
      },
    });
  });

  it("PUT /api/testimonials/:id - should reject unauthenticated requests", async () => {
    await request(app)
      .put(`/api/testimonials/${testTestimonialId}`)
      .send({
        rating: 3,
      })
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  it("PUT /api/testimonials/:id - should return 404 for nonexistent testimonial", async () => {
    const nonexistentId = new mongoose.Types.ObjectId();

    await request(app)
      .put(`/api/testimonials/${nonexistentId}`)
      .set("Cookie", adminCookie!)
      .send({
        rating: 3,
      })
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });

  it("PUT /api/testimonials/:id - should reject invalid ID", async () => {
    await request(app)
      .put("/api/testimonials/not-a-valid-id")
      .set("Cookie", adminCookie!)
      .send({
        rating: 3,
      })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  // ---------------------------------------------------------------------------
  // DELETE /api/testimonials/:id
  // ---------------------------------------------------------------------------

  it("DELETE /api/testimonials/:id - should delete testimonial", async () => {
    const testimonial = await Testimonial.create({
      customerName: "Delete Test Customer",
      rating: 3,
      text: {
        ar: "تقييم للحذف",
        he: "ביקורת למחיקה",
      },
      isVisible: true,
    });

    try {
      const response = await request(app)
        .delete(`/api/testimonials/${testimonial._id}`)
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Testimonial deleted successfully"
      );

      const deletedTestimonial = await Testimonial.findById(
        testimonial._id
      );

      expect(deletedTestimonial).toBeNull();
    } finally {
      await Testimonial.findByIdAndDelete(testimonial._id);
    }
  });

  it("DELETE /api/testimonials/:id - should reject unauthenticated requests", async () => {
    await request(app)
      .delete(`/api/testimonials/${testTestimonialId}`)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });

  it("DELETE /api/testimonials/:id - should return 404 for nonexistent testimonial", async () => {
    const nonexistentId = new mongoose.Types.ObjectId();

    await request(app)
      .delete(`/api/testimonials/${nonexistentId}`)
      .set("Cookie", adminCookie!)
      .expect(404)
      .expect("Content-Type", /application\/json/);
  });

  it("DELETE /api/testimonials/:id - should reject invalid ID", async () => {
    await request(app)
      .delete("/api/testimonials/not-a-valid-id")
      .set("Cookie", adminCookie!)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});