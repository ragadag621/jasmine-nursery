import { describe, it, expect, beforeAll, afterAll } from "vitest"
import supertest from "supertest"
import mongoose from "mongoose"

import app from "../app"
import { connectDB, disconnectDB } from "../config/db"
import { Contact } from "../models"

import {
  createTestContact,
  cleanupTestContact,
} from "./helpers/testData"

const api = supertest(app)

describe("Contact API", () => {
  let adminCookie: string[] | undefined

  let testContactId: string
  let testReadContactId: string

  beforeAll(async () => {
    await connectDB()

    const testContact = await createTestContact("new")
    const testReadContact = await createTestContact("read")

    testContactId = testContact._id.toString()
    testReadContactId = testReadContact._id.toString()

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

  afterAll(async () => {
    if (testContactId) {
      await cleanupTestContact(
        new mongoose.Types.ObjectId(testContactId)
      )
    }

    if (testReadContactId) {
      await cleanupTestContact(
        new mongoose.Types.ObjectId(testReadContactId)
      )
    }

    await disconnectDB()
  })

  describe("POST /api/contact", () => {
    it("should submit a new contact message successfully", async () => {
      const email = `test-${Date.now()}@example.com`

      let createdContactId: string | undefined

      try {
        const response = await api
          .post("/api/contact")
          .send({
            name: "Test User",
            phone: "0501234567",
            email,
            message: "This is a valid test contact message.",
          })
          .expect(201)
          .expect("Content-Type", /application\/json/)

        expect(response.body.success).toBe(true)

        expect(response.body.message).toBe(
          "Message sent successfully"
        )

        expect(response.body.data).toBeDefined()
        expect(response.body.data.id).toBeDefined()
        expect(response.body.data.createdAt).toBeDefined()

        createdContactId = response.body.data.id

        const createdContact = await Contact.findById(
          createdContactId
        )

        expect(createdContact).not.toBeNull()

        expect(createdContact?.name).toBe("Test User")
        expect(createdContact?.phone).toBe("0501234567")
        expect(createdContact?.email).toBe(email.toLowerCase())
        expect(createdContact?.message).toBe(
          "This is a valid test contact message."
        )
        expect(createdContact?.status).toBe("new")
      } finally {
        if (createdContactId) {
          await cleanupTestContact(
            new mongoose.Types.ObjectId(createdContactId)
          )
        }
      }
    })

    it("should submit a contact message without an email", async () => {
      let createdContactId: string | undefined

      try {
        const response = await api
          .post("/api/contact")
          .send({
            name: "Test User",
            phone: "0501234567",
            message: "A message without an email address.",
          })
          .expect(201)
          .expect("Content-Type", /application\/json/)

        expect(response.body.success).toBe(true)
        expect(response.body.data.id).toBeDefined()

        createdContactId = response.body.data.id

        const createdContact = await Contact.findById(
          createdContactId
        )

        expect(createdContact).not.toBeNull()
        expect(createdContact?.email).toBeUndefined()
        expect(createdContact?.status).toBe("new")
      } finally {
        if (createdContactId) {
          await cleanupTestContact(
            new mongoose.Types.ObjectId(createdContactId)
          )
        }
      }
    })

    it("should return 400 if required fields are missing", async () => {
      const beforeCount = await Contact.countDocuments()

      const response = await api
        .post("/api/contact")
        .send({})
        .expect(400)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()

      const afterCount = await Contact.countDocuments()

      expect(afterCount).toBe(beforeCount)
    })

    it("should return 400 if the name is missing", async () => {
      const beforeCount = await Contact.countDocuments()

      const response = await api
        .post("/api/contact")
        .send({
          phone: "0501234567",
          email: "test@example.com",
          message: "This is a valid test message.",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)

      const afterCount = await Contact.countDocuments()

      expect(afterCount).toBe(beforeCount)
    })

    it("should return 400 if the phone is missing", async () => {
      const beforeCount = await Contact.countDocuments()

      const response = await api
        .post("/api/contact")
        .send({
          name: "Test User",
          email: "test@example.com",
          message: "This is a valid test message.",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)

      const afterCount = await Contact.countDocuments()

      expect(afterCount).toBe(beforeCount)
    })

    it("should return 400 if the message is missing", async () => {
      const beforeCount = await Contact.countDocuments()

      const response = await api
        .post("/api/contact")
        .send({
          name: "Test User",
          phone: "0501234567",
          email: "test@example.com",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)

      const afterCount = await Contact.countDocuments()

      expect(afterCount).toBe(beforeCount)
    })

    it("should return 400 if the name is too short", async () => {
      const beforeCount = await Contact.countDocuments()

      const response = await api
        .post("/api/contact")
        .send({
          name: "A",
          phone: "0501234567",
          email: "test@example.com",
          message: "This is a valid test message.",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)

      const afterCount = await Contact.countDocuments()

      expect(afterCount).toBe(beforeCount)
    })

    it("should return 400 for an invalid email address", async () => {
      const beforeCount = await Contact.countDocuments()

      const response = await api
        .post("/api/contact")
        .send({
          name: "Test User",
          phone: "0501234567",
          email: "invalid-email",
          message: "This is a valid test message.",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)

      const afterCount = await Contact.countDocuments()

      expect(afterCount).toBe(beforeCount)
    })

    it("should return 400 if the phone number is invalid", async () => {
      const beforeCount = await Contact.countDocuments()

      const response = await api
        .post("/api/contact")
        .send({
          name: "Test User",
          phone: "invalid-phone",
          email: "test@example.com",
          message: "This is a valid test message.",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)

      const afterCount = await Contact.countDocuments()

      expect(afterCount).toBe(beforeCount)
    })

    it("should return 400 if the message is too short", async () => {
      const beforeCount = await Contact.countDocuments()

      const response = await api
        .post("/api/contact")
        .send({
          name: "Test User",
          phone: "0501234567",
          email: "test@example.com",
          message: "Hi",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)

      const afterCount = await Contact.countDocuments()

      expect(afterCount).toBe(beforeCount)
    })

    it("should return 400 for whitespace-only contact fields", async () => {
      const beforeCount = await Contact.countDocuments()

      const response = await api
        .post("/api/contact")
        .send({
          name: "   ",
          phone: "   ",
          email: "   ",
          message: "   ",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)

      const afterCount = await Contact.countDocuments()

      expect(afterCount).toBe(beforeCount)
    })

    it("should not create a database record for invalid input", async () => {
      const beforeCount = await Contact.countDocuments()

      await api
        .post("/api/contact")
        .send({
          name: "A",
          phone: "invalid",
          email: "invalid-email",
          message: "Hi",
        })
        .expect(400)

      const afterCount = await Contact.countDocuments()

      expect(afterCount).toBe(beforeCount)
    })

    it("should return 413 for an oversized request body", async () => {
      const beforeCount = await Contact.countDocuments()

      // Express JSON body limit is 2MB.
      // Generate a payload larger than the configured limit.
      const oversizedMessage = "A".repeat(3 * 1024 * 1024)

      const response = await api
        .post("/api/contact")
        .send({
          name: "Test User",
          phone: "0501234567",
          email: "test@example.com",
          message: oversizedMessage,
        })
        .expect(413)

      expect(response.body.success).toBe(false)

      const afterCount = await Contact.countDocuments()

      expect(afterCount).toBe(beforeCount)
    })

    it("should not expose internal error details for invalid input", async () => {
      const response = await api
        .post("/api/contact")
        .send({
          name: "A",
          phone: "invalid",
          email: "invalid",
          message: "Hi",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)

      const responseText = JSON.stringify(response.body)

      expect(responseText).not.toMatch(/stack/i)
      expect(responseText).not.toMatch(/mongoose/i)
      expect(responseText).not.toMatch(/mongodb/i)
      expect(responseText).not.toMatch(/node_modules/i)
      expect(responseText).not.toMatch(/CastError/i)
    })
  })

  describe("GET /api/contact", () => {
    it("should return paginated contact messages for an authenticated admin", async () => {
      const response = await api
        .get("/api/contact")
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)

      expect(Array.isArray(response.body.data)).toBe(true)

      expect(response.body.meta).toBeDefined()
      expect(typeof response.body.meta.total).toBe("number")
      expect(response.body.meta.page).toBe(1)
      expect(response.body.meta.pages).toBeGreaterThanOrEqual(1)

      expect(response.body.meta.total).toBeGreaterThanOrEqual(2)
    })

    it("should filter contact messages by status", async () => {
      const response = await api
        .get("/api/contact")
        .query({
          status: "read",
        })
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)

      expect(Array.isArray(response.body.data)).toBe(true)

      expect(response.body.data.length).toBeGreaterThanOrEqual(1)

      for (const contact of response.body.data) {
        expect(contact.status).toBe("read")
      }

      expect(response.body.meta).toBeDefined()
      expect(response.body.meta.total).toBeGreaterThanOrEqual(1)
    })

    it("should return 400 for an invalid status filter", async () => {
      const response = await api
        .get("/api/contact")
        .query({
          status: "invalid",
        })
        .set("Cookie", adminCookie!)
        .expect(400)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)
    })

    it("should return 401 if the request is not authenticated", async () => {
      const response = await api
        .get("/api/contact")
        .expect(401)

      expect(response.body.success).toBe(false)
    })
  })

  describe("PATCH /api/contact/:id/status", () => {
    it("should update the contact message status for an authenticated admin", async () => {
      const response = await api
        .patch(`/api/contact/${testContactId}/status`)
        .set("Cookie", adminCookie!)
        .send({
          status: "resolved",
        })
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)

      expect(response.body.message).toBe(
        "Status updated"
      )

      expect(response.body.data).toBeDefined()
      expect(response.body.data._id).toBe(testContactId)
      expect(response.body.data.status).toBe("resolved")

      const updatedContact = await Contact.findById(
        testContactId
      )

      expect(updatedContact).not.toBeNull()
      expect(updatedContact?.status).toBe("resolved")
    })

    it("should return 400 for an invalid status", async () => {
      const response = await api
        .patch(`/api/contact/${testContactId}/status`)
        .set("Cookie", adminCookie!)
        .send({
          status: "invalid",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)
    })

    it("should return 404 if the contact message does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString()

      const response = await api
        .patch(`/api/contact/${fakeId}/status`)
        .set("Cookie", adminCookie!)
        .send({
          status: "read",
        })
        .expect(404)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)

      expect(response.body.message).toBe(
        "Message not found"
      )
    })

    it("should return 401 if the request is not authenticated", async () => {
      const response = await api
        .patch(`/api/contact/${testContactId}/status`)
        .send({
          status: "read",
        })
        .expect(401)

      expect(response.body.success).toBe(false)
    })
  })

  describe("DELETE /api/contact/:id", () => {
    it("should delete an existing contact message for an authenticated admin", async () => {
      const contactToDelete = await createTestContact("new")

      const response = await api
        .delete(`/api/contact/${contactToDelete._id}`)
        .set("Cookie", adminCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)

      expect(response.body.message).toBe(
        "Message deleted successfully"
      )

      const deletedContact = await Contact.findById(
        contactToDelete._id
      )

      expect(deletedContact).toBeNull()
    })

    it("should return 404 if the contact message does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString()

      const response = await api
        .delete(`/api/contact/${fakeId}`)
        .set("Cookie", adminCookie!)
        .expect(404)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)

      expect(response.body.message).toBe(
        "Message not found"
      )
    })

    it("should return 401 if the request is not authenticated", async () => {
      const response = await api
        .delete(`/api/contact/${testContactId}`)
        .expect(401)

      expect(response.body.success).toBe(false)
    })
  })
})