import { describe, it, expect, beforeAll, afterAll } from "vitest"
import supertest from "supertest"
import jwt from "jsonwebtoken"

import app from "../app"
import { connectDB, disconnectDB } from "../config/db"
import { User } from "../models/User.model"
import { env } from "../config/env"

const api = supertest(app)

describe("Auth API", () => {
  let authCookie: string[] | undefined

  const TEST_ADMIN_USERNAME = "vitest-admin"
  const TEST_ADMIN_EMAIL = "vitest-admin@alyasmin-nursery.local"
  const TEST_ADMIN_PASSWORD = "Vitest123!"

  // ============================================================
  // SETUP
  // ============================================================

  beforeAll(async () => {
    await connectDB()

    // Remove any leftover test user from a previous interrupted run.
    await User.findOneAndDelete({
      username: TEST_ADMIN_USERNAME,
    })

    // Create a dedicated admin account for automated tests.
    const passwordHash = await User.hashPassword(
      TEST_ADMIN_PASSWORD
    )

    await User.create({
      username: TEST_ADMIN_USERNAME,
      email: TEST_ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    })

    // Authenticate using the dedicated test admin account.
    const response = await api
      .post("/api/auth/login")
      .send({
        username: TEST_ADMIN_USERNAME,
        password: TEST_ADMIN_PASSWORD,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/)

    expect(response.body.success).toBe(true)

    authCookie = response.headers["set-cookie"]

    expect(authCookie).toBeDefined()
  })

  // ============================================================
  // CLEANUP
  // ============================================================

  afterAll(async () => {
    // Delete only the dedicated test account.
    await User.findOneAndDelete({
      username:TEST_ADMIN_USERNAME,
    })
   

    await disconnectDB()
  })

  // ============================================================
  // POST /api/auth/login
  // ============================================================

  describe("POST /api/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      const response = await api
        .post("/api/auth/login")
        .send({
          username: TEST_ADMIN_USERNAME,
          password: TEST_ADMIN_PASSWORD,
        })
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe(
        "Logged in successfully"
      )

      expect(response.body.data).toBeDefined()
      expect(response.body.data.id).toBeDefined()
      expect(response.body.data.username).toBe(
        TEST_ADMIN_USERNAME
      )
      expect(response.body.data.email).toBeDefined()
      expect(response.body.data.role).toBeDefined()
    })

    it("should return 401 for a non-existing username", async () => {
      const response = await api
        .post("/api/auth/login")
        .send({
          username: "definitely-not-existing-user",
          password: TEST_ADMIN_PASSWORD,
        })
        .expect(401)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe(
        "Invalid username or password"
      )
    })

    it("should return 401 for an incorrect password", async () => {
      const response = await api
        .post("/api/auth/login")
        .send({
          username: TEST_ADMIN_USERNAME,
          password: "DefinitelyWrongPassword123!",
        })
        .expect(401)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe(
        "Invalid username or password"
      )
    })

    it("should return 400 when username is missing", async () => {
      await api
        .post("/api/auth/login")
        .send({
          password: TEST_ADMIN_PASSWORD,
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)
    })

    it("should return 400 when password is missing", async () => {
      await api
        .post("/api/auth/login")
        .send({
          username: TEST_ADMIN_USERNAME,
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)
    })

    it("should return 400 when username is shorter than 3 characters", async () => {
      await api
        .post("/api/auth/login")
        .send({
          username: "ab",
          password: TEST_ADMIN_PASSWORD,
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)
    })

    it("should return 400 when username is longer than 40 characters", async () => {
      await api
        .post("/api/auth/login")
        .send({
          username: "a".repeat(41),
          password: TEST_ADMIN_PASSWORD,
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)
    })

    it("should return 400 when password is shorter than 6 characters", async () => {
      await api
        .post("/api/auth/login")
        .send({
          username: TEST_ADMIN_USERNAME,
          password: "12345",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/)
    })

    it("should not expose the JWT in the response body", async () => {
      const response = await api
        .post("/api/auth/login")
        .send({
          username: TEST_ADMIN_USERNAME,
          password: TEST_ADMIN_PASSWORD,
        })
        .expect(200)

      expect(response.body.data.token).toBeUndefined()
      expect(response.body.token).toBeUndefined()

      expect(JSON.stringify(response.body)).not.toMatch(
        /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/
      )
    })

    it("should set the authentication cookie after successful login", async () => {
      const response = await api
        .post("/api/auth/login")
        .send({
          username: TEST_ADMIN_USERNAME,
          password: TEST_ADMIN_PASSWORD,
        })
        .expect(200)

      expect(response.headers["set-cookie"]).toBeDefined()
      expect(response.headers["set-cookie"].length).toBeGreaterThan(
        0
      )
    })

    it("should accept username with surrounding whitespace", async () => {
      const response = await api
        .post("/api/auth/login")
        .send({
          username: `     ${TEST_ADMIN_USERNAME}  `,
          password: TEST_ADMIN_PASSWORD,
        })
        .expect(200)

      expect(response.body.success).toBe(true)
    })

    it("should accept uppercase username", async () => {
      const response = await api
        .post("/api/auth/login")
        .send({
          username: TEST_ADMIN_USERNAME.toUpperCase(),
          password: TEST_ADMIN_PASSWORD,
        })
        .expect(200)

      expect(response.body.success).toBe(true)
    })
  })

  // ============================================================
  // POST /api/auth/logout
  // ============================================================

  describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
      const response = await api
        .post("/api/auth/logout")
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe(
        "Logged out successfully"
      )
    })

    it("should clear the authentication cookie", async () => {
      const loginResponse = await api
        .post("/api/auth/login")
        .send({
          username: TEST_ADMIN_USERNAME,
          password: TEST_ADMIN_PASSWORD,
        })
        .expect(200)

      const cookie = loginResponse.headers["set-cookie"]

      expect(cookie).toBeDefined()

      const logoutResponse = await api
        .post("/api/auth/logout")
        .set("Cookie", cookie)
        .expect(200)

      expect(logoutResponse.headers["set-cookie"]).toBeDefined()

      const clearedCookie =
        logoutResponse.headers["set-cookie"].join(";")

      // Cookie clearing normally uses Max-Age=0
      // or an expired Expires date.
      expect(
        clearedCookie.includes("Max-Age=0") ||
          /Expires=.*1970/i.test(clearedCookie)
      ).toBe(true)
    })
  })

  // ============================================================
  // GET /api/auth/me
  // ============================================================

  describe("GET /api/auth/me", () => {
    it("should return the current admin when authenticated", async () => {
      const response = await api
        .get("/api/auth/me")
        .set("Cookie", authCookie!)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()

      expect(response.body.data.id).toBeDefined()
      expect(response.body.data.username).toBe(
        TEST_ADMIN_USERNAME
      )
      expect(response.body.data.email).toBe(
        TEST_ADMIN_EMAIL
      )
      expect(response.body.data.role).toBe("admin")
    })

    it("should return 401 when not authenticated", async () => {
      await api
        .get("/api/auth/me")
        .expect(401)
        .expect("Content-Type", /application\/json/)
    })

    it("should return 401 for an invalid authentication token", async () => {
      const loginResponse = await api
        .post("/api/auth/login")
        .send({
          username: TEST_ADMIN_USERNAME,
          password: TEST_ADMIN_PASSWORD,
        })
        .expect(200)

      const authCookie = loginResponse.headers["set-cookie"]

      expect(authCookie).toBeDefined()

      const cookieName = authCookie[0].split("=")[0]

      await api
        .get("/api/auth/me")
        .set(
          "Cookie",
          `${cookieName}=this-is-not-a-valid-jwt`
        )
        .expect(401)
        .expect("Content-Type", /application\/json/)
    })

    // ==========================================================
    // AUDIT-005 — JWT PAYLOAD RUNTIME VALIDATION
    // ==========================================================

    it("should return 401 when JWT payload is missing the user id", async () => {
      const token = jwt.sign(
        {
          role: "admin",
        },
        env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      )

      await api
        .get("/api/auth/me")
        .set(
          "Cookie",
          `${env.COOKIE_NAME}=${token}`
        )
        .expect(401)
        .expect("Content-Type", /application\/json/)
    })

    it("should return 401 when JWT payload contains an invalid user id", async () => {
      const token = jwt.sign(
        {
          id: "not-a-valid-object-id",
          role: "admin",
        },
        env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      )

      await api
        .get("/api/auth/me")
        .set(
          "Cookie",
          `${env.COOKIE_NAME}=${token}`
        )
        .expect(401)
        .expect("Content-Type", /application\/json/)
    })

    it("should return 401 when JWT payload contains an unsupported role", async () => {
      const token = jwt.sign(
        {
          id: "507f1f77bcf86cd799439011",
          role: "staff",
        },
        env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      )

      await api
        .get("/api/auth/me")
        .set(
          "Cookie",
          `${env.COOKIE_NAME}=${token}`
        )
        .expect(401)
        .expect("Content-Type", /application\/json/)
    })

    it("should return 401 when JWT payload is missing expiration", async () => {
      const token = jwt.sign(
        {
          id: "507f1f77bcf86cd799439011",
          role: "admin",
        },
        env.JWT_SECRET
      )

      await api
        .get("/api/auth/me")
        .set(
          "Cookie",
          `${env.COOKIE_NAME}=${token}`
        )
        .expect(401)
        .expect("Content-Type", /application\/json/)
    })

    it("should return 401 when JWT is expired", async () => {
      const token = jwt.sign(
        {
          id: "507f1f77bcf86cd799439011",
          role: "admin",
        },
        env.JWT_SECRET,
        {
          expiresIn: -1,
        }
      )

      await api
        .get("/api/auth/me")
        .set(
          "Cookie",
          `${env.COOKIE_NAME}=${token}`
        )
        .expect(401)
        .expect("Content-Type", /application\/json/)
    })

    it("should return 401 when the authenticated account no longer exists", async () => {
      const loginResponse = await api
        .post("/api/auth/login")
        .send({
          username: TEST_ADMIN_USERNAME,
          password: TEST_ADMIN_PASSWORD,
        })
        .expect(200)

      const cookie = loginResponse.headers["set-cookie"]

      expect(cookie).toBeDefined()

      const userId = loginResponse.body.data.id

      expect(userId).toBeDefined()

      // Make sure the user actually exists before deleting it.
      const user = await User.findById(userId)

      expect(user).not.toBeNull()

      // Delete the test account.
      await User.findByIdAndDelete(userId)

      // The JWT is still valid, but the account no longer exists.
      await api
        .get("/api/auth/me")
        .set("Cookie", cookie)
        .expect(401)
        .expect("Content-Type", /application\/json/)
    })
  })
})
