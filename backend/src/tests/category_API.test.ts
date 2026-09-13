import { describe, it, expect, beforeAll, afterAll } from "vitest"
import supertest from "supertest"
import mongoose from "mongoose"

import app from "../app"
import { connectDB, disconnectDB } from "../config/db"
import { Category } from "../models"

import {
  createTestCategory,
  cleanupTestCategory,
} from "./helpers/testData"

const api = supertest(app)

describe("Category API", () => {
  let adminCookie: string[] | undefined

  let testCategorySlug: string
  let testCategoryId: string

  beforeAll(async () => {
    await connectDB()

    const testCategory = await createTestCategory()

    testCategoryId = testCategory._id.toString()
    testCategorySlug = testCategory.slug

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

  // CLEANUP
  afterAll(async () => {
    if (testCategoryId) {
      await cleanupTestCategory(
        new mongoose.Types.ObjectId(testCategoryId)
      )
    }

    await disconnectDB()
  })

  // =========================================================
  // GET /api/categories
  // =========================================================

  describe("GET /api/categories", () => {
    it("should return all public categories", async () => {
      const response = await api
        .get("/api/categories")
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  // =========================================================
  // POST /api/categories
  // =========================================================

  describe("POST /api/categories", () => {
    it("should create a new category for an authenticated admin", async () => {
      const slug = `vitest-created-category-${Date.now()}`
      let createdCategoryId: string | undefined

      try {
        const response = await api
          .post("/api/categories")
          .set("Cookie", adminCookie!)
          .field(
            "name",
            JSON.stringify({
              ar: "فئة اختبار",
              he: "קטגוריית בדיקה",
            })
          )
          .field("slug", slug)
          .field(
            "description",
            JSON.stringify({
              ar: "فئة مخصصة للاختبارات",
              he: "קטגוריה המخصصة לבדיקות",
            })
          )
          .expect(201)
          .expect("Content-Type", /application\/json/)

        expect(response.body.success).toBe(true)
        expect(response.body.data).toBeDefined()

        expect(response.body.data.name.ar).toBe("فئة اختبار")
        expect(response.body.data.name.he).toBe("קטגוריית בדיקה")

        expect(response.body.message).toBe(
          "Category created successfully"
        )

        createdCategoryId = response.body.data._id

        expect(createdCategoryId).toBeDefined()

        const createdCategory = await Category.findById(
          createdCategoryId
        )

        expect(createdCategory).not.toBeNull()
        expect(createdCategory?.slug).toBe(slug)
      } finally {
        if (createdCategoryId) {
          await cleanupTestCategory(
            new mongoose.Types.ObjectId(createdCategoryId)
          )
        }
      }
    })

    it("should return 409 Conflict if a category with the same slug already exists", async () => {
      const response = await api
        .post("/api/categories")
        .set("Cookie", adminCookie!)
        .field(
          "name",
          JSON.stringify({
            ar: "فئة اختبار",
            he: "קטגוריית בדיקה",
          })
        )
        .field("slug", testCategorySlug)
        .field(
          "description",
          JSON.stringify({
            ar: "فئة مخصصة للاختبارات",
            he: "קטגוריה המخصصة לבדיקות",
          })
        )
        .expect(409)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)

      expect(response.body.message).toBe(
        `A category with slug "${testCategorySlug}" already exists`
      )
    })

    it("should return 401 if the request is not authenticated", async () => {
      const response = await api
        .post("/api/categories")
        .field(
          "name",
          JSON.stringify({
            ar: "فئة اختبار",
            he: "קטגוריית בדיקה",
          })
        )
        .field("slug", `unauthorized-category-${Date.now()}`)
        .field(
          "description",
          JSON.stringify({
            ar: "فئة مخصصة للاختبارات",
            he: "קטגוריה המخصصة לבדיקات",
          })
        )
        .expect(401)

      expect(response.body.success).toBe(false)
    })

    it("should return 400 for an invalid slug", async () => {
      const response = await api
        .post("/api/categories")
        .set("Cookie", adminCookie!)
        .field(
          "name",
          JSON.stringify({
            ar: "فئة اختبار",
            he: "קטגוריית בדיקה",
          })
        )
        .field("slug", "Invalid Category")
        .field(
          "description",
          JSON.stringify({
            ar: "فئة مخصصة للاختبارات",
            he: "קטגוריה המخصصة לבדיקات",
          })
        )
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it("should return 400 if the required name is missing", async () => {
      const response = await api
        .post("/api/categories")
        .set("Cookie", adminCookie!)
        .field("slug", `missing-name-${Date.now()}`)
        .field(
          "description",
          JSON.stringify({
            ar: "فئة مخصصة للاختبارات",
            he: "קטגוריה המخصصة לבדיקات",
          })
        )
        .expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  // =========================================================
  // PUT /api/categories/:id
  // =========================================================

  describe("PUT /api/categories/:id", () => {
    it("should update an existing category for an authenticated admin", async () => {
      const response = await api
        .put(`/api/categories/${testCategoryId}`)
        .set("Cookie", adminCookie!)
        .field(
          "name",
          JSON.stringify({
            ar: "فئة محدثة",
            he: "קטגוריה מעודכנת",
          })
        )
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)

      expect(response.body.message).toBe(
        "Category updated successfully"
      )

      expect(response.body.data).toBeDefined()

      expect(response.body.data.name.ar).toBe("فئة محدثة")
      expect(response.body.data.name.he).toBe("קטגוריה מעודכנת")

      const updatedCategory = await Category.findById(
        testCategoryId
      )

      expect(updatedCategory).not.toBeNull()
      expect(updatedCategory?.name.ar).toBe("فئة محدثة")
      expect(updatedCategory?.name.he).toBe("קטגוריה מעודכנת")
    })

    it("should return 404 if the category does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString()

      const response = await api
        .put(`/api/categories/${fakeId}`)
        .set("Cookie", adminCookie!)
        .field(
          "name",
          JSON.stringify({
            ar: "فئة جديدة",
            he: "קטגוריה חדשה",
          })
        )
        .expect(404)

      expect(response.body.success).toBe(false)

      expect(response.body.message).toBe(
        "Category not found"
      )
    })

    it("should return 409 if the new slug is already used by another category", async () => {
      const anotherCategory = await createTestCategory()

      try {
        const response = await api
          .put(`/api/categories/${testCategoryId}`)
          .set("Cookie", adminCookie!)
          .field("slug", anotherCategory.slug)
          .expect(409)

        expect(response.body.success).toBe(false)

        expect(response.body.message).toBe(
          `A category with slug "${anotherCategory.slug}" already exists`
        )
      } finally {
        await cleanupTestCategory(anotherCategory._id)
      }
    })

    it("should return 401 if the request is not authenticated", async () => {
      const response = await api
        .put(`/api/categories/${testCategoryId}`)
        .field(
          "name",
          JSON.stringify({
            ar: "فئة محدثة",
            he: "קטגוריה מעודכנת",
          })
        )
        .expect(401)

      expect(response.body.success).toBe(false)
    })
  })

  // =========================================================
  // DELETE /api/categories/:id
  // =========================================================

  describe("DELETE /api/categories/:id", () => {
    it("should delete an existing category for an authenticated admin", async () => {
      const categoryToDelete = await createTestCategory()

      const response = await api
        .delete(`/api/categories/${categoryToDelete._id}`)
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)

      expect(response.body.message).toBe(
        "Category deleted successfully"
      )

      const deletedCategory = await Category.findById(
        categoryToDelete._id
      )

      expect(deletedCategory).toBeNull()
    })

    it("should return 404 if the category does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString()

      const response = await api
        .delete(`/api/categories/${fakeId}`)
        .set("Cookie", adminCookie!)
        .expect(404)

      expect(response.body.success).toBe(false)

      expect(response.body.message).toBe(
        "Category not found"
      )
    })

    it("should return 401 if the request is not authenticated", async () => {
      const response = await api
        .delete(`/api/categories/${testCategoryId}`)
        .expect(401)

      expect(response.body.success).toBe(false)
    })
  })
})