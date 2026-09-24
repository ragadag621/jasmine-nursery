import { describe, it, expect, beforeAll, afterAll } from "vitest"
import supertest from "supertest"
import mongoose from "mongoose"

import app from "../app"
import { connectDB, disconnectDB } from "../config/db"
import { Plant } from "../models/Plant.model"

import {
  createTestCategory,
  createTestPlant,
  cleanupTestPlant,
  cleanupTestCategory,
} from "./helpers/testData"

const api = supertest(app)

describe("Plant API", () => {
  let adminCookie: string[] | undefined

  // Test data
  let testPlantId: string
  let testPlantSlug: string
  let testCategoryId: string

  // ============================================================
  // SETUP
  // ============================================================

  beforeAll(async () => {
    await connectDB()

    // ----------------------------------------------------------
    // Create dedicated TEST CATEGORY
    //
    // This category belongs only to the automated tests.
    // It is safe to delete during cleanup.
    // ----------------------------------------------------------

    const testCategory = await createTestCategory()

    testCategoryId = testCategory._id.toString()

    // ----------------------------------------------------------
    // Create dedicated TEST PLANT
    //
    // This is the plant that PUT / PATCH / DELETE will operate on.
    // It is created through the test helper, not from existing data.
    // ----------------------------------------------------------

    const testPlant = await createTestPlant(testCategory._id)

    testPlantId = testPlant._id.toString()
    testPlantSlug = testPlant.slug

    // ----------------------------------------------------------
    // Authenticate admin
    // ----------------------------------------------------------

    const username = (
      process.env.SEED_ADMIN_USERNAME || "admin"
    ).toLowerCase()

    const password =
      process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!"

    const response = await api
      .post("/api/auth/login")
      .send({
        username,
        password,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(response.body.success).toBe(true)

    adminCookie = response.headers["set-cookie"]

    expect(adminCookie).toBeDefined()
  })

  // ============================================================
  // CLEANUP
  // ============================================================

  afterAll(async () => {
    // ----------------------------------------------------------
    // Delete the dedicated TEST PLANT
    // ----------------------------------------------------------

    if (testPlantId) {
      await cleanupTestPlant(
        new mongoose.Types.ObjectId(testPlantId)
      )
    }

    // ----------------------------------------------------------
    // Delete the dedicated TEST CATEGORY
    // ----------------------------------------------------------

    if (testCategoryId) {
      await cleanupTestCategory(
        new mongoose.Types.ObjectId(testCategoryId)
      )
    }

    await disconnectDB()
  })

  // ============================================================
  // PUBLIC GET /api/plants
  // ============================================================

  describe("GET /api/plants", () => {
    it("should return all public plants", async () => {
      const response = await api
        .get("/api/plants")
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(Array.isArray(response.body.data)).toBe(true)

      expect(response.body.meta).toBeDefined()
      expect(response.body.meta.total).toBeTypeOf("number")
      expect(response.body.meta.page).toBeTypeOf("number")
      expect(response.body.meta.pages).toBeTypeOf("number")
    })
  })

  // ============================================================
  // PUBLIC GET /api/plants/:slug
  // ============================================================

  describe("GET /api/plants/:slug", () => {
    it("should return the test plant by slug", async () => {
      const response = await api
        .get(`/api/plants/${testPlantSlug}`)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()

      expect(response.body.data._id).toBe(testPlantId)
      expect(response.body.data.slug).toBe(testPlantSlug)
      expect(response.body.data.name).toBeDefined()
      expect(response.body.data.description).toBeDefined()
    })
  })

  // ============================================================
  // ADMIN GET /api/plants/admin/all
  // ============================================================

  describe("GET /api/plants/admin/all", () => {
    it("should return all plants for an authenticated admin", async () => {
      const response = await api
        .get("/api/plants/admin/all")
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(Array.isArray(response.body.data)).toBe(true)

      const testPlant = response.body.data.find(
        (plant: { _id: string }) => plant._id === testPlantId
      )

      expect(testPlant).toBeDefined()
    })
  })

  // ============================================================
  // ADMIN GET /api/plants/admin/:id
  // ============================================================

  describe("GET /api/plants/admin/:id", () => {
    it("should return the test plant by ID", async () => {
      const response = await api
        .get(`/api/plants/admin/${testPlantId}`)
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()

      expect(response.body.data._id).toBe(testPlantId)
      expect(response.body.data.slug).toBe(testPlantSlug)
    })
  })

  // ============================================================
  // POST /api/plants
  // ============================================================

  describe("POST /api/plants", () => {
    let createdPlantId: string

    it("should create a new plant for an authenticated admin", async () => {
      const slug = `vitest-created-plant-${Date.now()}`

      const response = await api
        .post("/api/plants")
        .set("Cookie", adminCookie!)
        .field(
          "name",
          JSON.stringify({
            ar: "نبتة تم إنشاؤها للاختبار",
            he: "צמח שנוצר לבדיקה",
          })
        )
        .field(
          "description",
          JSON.stringify({
            ar: "وصف نبتة الاختبار",
            he: "תיאור צמח הבדיקה",
          })
        )
        .field("scientificName", "Vitest Created Plant")
        .field("slug", slug)
        .field("category", testCategoryId)
        .field("price", "75")
        .field("availability", "in_stock")
        .field(
          "care",
          JSON.stringify({
            water: "medium",
            sunlight: "partial_shade",
          })
        )
        .field(
          "offer",
          JSON.stringify({
            enabled: true,
            price: 55,
            startDate: "2030-01-01",
            endDate: "2030-12-31",
          })
        )
        .field("featured", "false")
        .field("isHidden", "false")
        .expect(201)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()

      expect(response.body.data.slug).toBe(slug)
      expect(response.body.data.name.ar).toBe(
        "نبتة تم إنشاؤها للاختبار"
      )
      expect(response.body.data.offer).toBeDefined()
      expect(response.body.data.offer.enabled).toBe(true)
      expect(response.body.data.offer.price).toBe(55)

      createdPlantId = response.body.data._id

      expect(createdPlantId).toBeDefined()

      // Verify it really exists in MongoDB.
      const createdPlant = await Plant.findById(createdPlantId)

      expect(createdPlant).not.toBeNull()
      expect(createdPlant?.slug).toBe(slug)

      // Cleanup this POST-specific plant.
      await Plant.findByIdAndDelete(createdPlantId)
    })
  })

  // ============================================================
  // PUT /api/plants/:id
  // ============================================================

  describe("PUT /api/plants/:id", () => {
    it("should update the test plant", async () => {
      const newSlug = `vitest-updated-plant-${Date.now()}`

      const response = await api
        .put(`/api/plants/${testPlantId}`)
        .set("Cookie", adminCookie!)
        .field(
          "name",
          JSON.stringify({
            ar: "نبتة اختبار معدلة",
            he: "צמח בדיקה מעודכן",
          })
        )
        .field(
          "description",
          JSON.stringify({
            ar: "وصف محدث للنبتة",
            he: "תיאור מעודכן לצמח",
          })
        )
        .field("scientificName", "Vitest Updated Plant")
        .field("slug", newSlug)
        .field("category", testCategoryId)
        .field("price", "120")
        .field("availability", "low_stock")
        .field(
          "care",
          JSON.stringify({
            water: "high",
            sunlight: "full_sun",
          })
        )
        .field(
          "offer",
          JSON.stringify({
            enabled: true,
            price: 90,
            startDate: "2031-01-01",
            endDate: "2031-12-31",
          })
        )
        .field("featured", "true")
        .field("isHidden", "false")
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()

      expect(response.body.data._id).toBe(testPlantId)
      expect(response.body.data.slug).toBe(newSlug)
      expect(response.body.data.price).toBe(120)
      expect(response.body.data.availability).toBe("low_stock")
      expect(response.body.data.featured).toBe(true)
      expect(response.body.data.offer).toBeDefined()
      expect(response.body.data.offer.enabled).toBe(true)
      expect(response.body.data.offer.price).toBe(90)

      // Update our reference because slug changed.
      testPlantSlug = newSlug

      // Verify persistence in MongoDB.
      const updatedPlant = await Plant.findById(testPlantId)

      expect(updatedPlant).not.toBeNull()
      expect(updatedPlant?.slug).toBe(newSlug)
      expect(updatedPlant?.price).toBe(120)
      expect(updatedPlant?.availability).toBe("low_stock")
      expect(updatedPlant?.featured).toBe(true)
    })
  })

  // ============================================================
  // PATCH /api/plants/:id/hide
  // ============================================================

  describe("PATCH /api/plants/:id/hide", () => {
    it("should hide the test plant", async () => {
      const response = await api
        .patch(`/api/plants/${testPlantId}/hide`)
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()

      expect(response.body.data._id).toBe(testPlantId)
      expect(response.body.data.isHidden).toBe(true)

      // Hidden plant should not be publicly accessible.
      await api
        .get(`/api/plants/${testPlantSlug}`)
        .expect(404)
    })

    it("should make the test plant visible again", async () => {
      const response = await api
        .patch(`/api/plants/${testPlantId}/hide`)
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)
      expect(response.body.data.isHidden).toBe(false)

      // It should be publicly accessible again.
      const publicResponse = await api
        .get(`/api/plants/${testPlantSlug}`)
        .expect(200)

      expect(publicResponse.body.success).toBe(true)
      expect(publicResponse.body.data._id).toBe(testPlantId)
    })
  })

  // ============================================================
  // DELETE /api/plants/:id/images/:imageId
  // ============================================================

  describe("DELETE /api/plants/:id/images/:imageId", () => {
    it("should return 404 when the image does not exist on the test plant", async () => {
      const fakeImageId = new mongoose.Types.ObjectId().toString()

      const response = await api
        .delete(
          `/api/plants/${testPlantId}/images/${fakeImageId}`
        )
        .set("Cookie", adminCookie!)
        .expect(404)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)
    })
  })

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  describe("Authentication", () => {
    it("should reject admin endpoint without authentication", async () => {
      await api
        .get("/api/plants/admin/all")
        .expect(401)
        .expect("Content-Type", /application\/json/)
    })

    it("should reject admin GET by ID without authentication", async () => {
      await api
        .get(`/api/plants/admin/${testPlantId}`)
        .expect(401)
    })

    it("should reject PUT without authentication", async () => {
      await api
        .put(`/api/plants/${testPlantId}`)
        .expect(401)
    })

    it("should reject PATCH without authentication", async () => {
      await api
        .patch(`/api/plants/${testPlantId}/hide`)
        .expect(401)
    })

    it("should reject DELETE without authentication", async () => {
      await api
        .delete(`/api/plants/${testPlantId}`)
        .expect(401)
    })

    it("should reject POST without authentication", async () => {
      await api
        .post("/api/plants")
        .expect(401)
    })
  })

  // ============================================================
  // NOT FOUND
  // ============================================================

  describe("Not Found", () => {
    it("should return 404 for a non-existing plant slug", async () => {
      await api
        .get("/api/plants/this-plant-definitely-does-not-exist")
        .expect(404)
    })

    it("should return 404 for a non-existing plant ID", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString()

      await api
        .get(`/api/plants/admin/${fakeId}`)
        .set("Cookie", adminCookie!)
        .expect(404)
    })

    it("should return 404 when deleting a non-existing plant", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString()

      await api
        .delete(`/api/plants/${fakeId}`)
        .set("Cookie", adminCookie!)
        .expect(404)
    })

    it("should return 404 when hiding a non-existing plant", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString()

      await api
        .patch(`/api/plants/${fakeId}/hide`)
        .set("Cookie", adminCookie!)
        .expect(404)
    })
  })

  // ============================================================
  // VALIDATION
  // ============================================================

  describe("Validation", () => {
    it("should reject an invalid plant ID", async () => {
      await api
        .get("/api/plants/admin/not-a-valid-id")
        .set("Cookie", adminCookie!)
        .expect(400)
    })

    it("should reject an invalid plant slug", async () => {
      await api
        .get("/api/plants/INVALID%20SLUG")
        .expect(400)
    })

    it("should reject a negative price when creating a plant", async () => {
      await api
        .post("/api/plants")
        .set("Cookie", adminCookie!)
        .field(
          "name",
          JSON.stringify({
            ar: "نبتة",
            he: "צמח",
          })
        )
        .field(
          "description",
          JSON.stringify({
            ar: "وصف",
            he: "תיאור",
          })
        )
        .field(
          "slug",
          `vitest-invalid-price-${Date.now()}`
        )
        .field("category", testCategoryId)
        .field("price", "-100")
        .field("availability", "in_stock")
        .field(
          "care",
          JSON.stringify({
            water: "medium",
            sunlight: "full_sun",
          })
        )
        .expect(400)
    })
  })

  // ============================================================
  // DELETE /api/plants/:id
  //
  // This is intentionally LAST because it permanently deletes
  // the dedicated test plant.
  // ============================================================

  describe("DELETE /api/plants/:id", () => {
    it("should delete the test plant", async () => {
      const response = await api
        .delete(`/api/plants/${testPlantId}`)
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)

      // Verify it no longer exists in MongoDB.
      const deletedPlant = await Plant.findById(testPlantId)

      expect(deletedPlant).toBeNull()

      // Verify public endpoint also returns 404.
      await api
        .get(`/api/plants/${testPlantSlug}`)
        .expect(404)

      // Prevent afterAll from trying to delete it again.
      testPlantId = ""
    })
  })
})