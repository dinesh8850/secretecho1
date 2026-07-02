import request from "supertest";
import createApp from "../src/app";

const app = createApp();

describe("POST /api/auth/signup", () => {
  it("should create a new user and return a token", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "test@example.com", password: "password123" });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it("should reject duplicate email", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({ email: "test@example.com", password: "password123" });
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "test@example.com", password: "password123" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("A user with this email already exists");
  });

  it("should reject missing email", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ password: "password123" });
    expect(res.status).toBe(400);
  });

  it("should reject missing password", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "test@example.com" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({ email: "test@example.com", password: "password123" });
  });

  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("should reject wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should reject non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "password123" });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });
});
