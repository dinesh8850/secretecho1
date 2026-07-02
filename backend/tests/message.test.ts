import request from "supertest";
import createApp from "../src/app";

const app = createApp();

jest.mock("../src/services/aiService", () => ({
  generateReply: jest.fn().mockResolvedValue("This is a mock AI reply"),
}));

const getAuthToken = async (): Promise<string> => {
  const res = await request(app)
    .post("/api/auth/signup")
    .send({ email: "test@example.com", password: "password123" });
  return res.body.token;
};

describe("GET /api/messages", () => {
  it("should return empty array for new user", async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.messages).toEqual([]);
  });

  it("should reject unauthenticated request", async () => {
    const res = await request(app).get("/api/messages");
    expect(res.status).toBe(401);
  });

  it("should reject invalid token", async () => {
    const res = await request(app)
      .get("/api/messages")
      .set("Authorization", "Bearer faketoken123");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/messages", () => {
  it("should save message and return AI reply", async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "Hello there" });
    expect(res.status).toBe(201);
    expect(res.body.userMessage.text).toBe("Hello there");
    expect(res.body.userMessage.sender).toBe("user");
    expect(res.body.aiMessage.sender).toBe("ai");
    expect(res.body.aiMessage.text).toBe("This is a mock AI reply");
  });

  it("should reject empty message", async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "" });
    expect(res.status).toBe(400);
  });

  it("should reject whitespace-only message", async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "   " });
    expect(res.status).toBe(400);
  });

  it("should reject unauthenticated request", async () => {
    const res = await request(app)
      .post("/api/messages")
      .send({ text: "Hello" });
    expect(res.status).toBe(401);
  });

  it("should persist messages in chat history", async () => {
    const token = await getAuthToken();
    await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "First message" });
    const res = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${token}`);
    expect(res.body.messages.length).toBe(2);
    expect(res.body.messages[0].text).toBe("First message");
    expect(res.body.messages[0].sender).toBe("user");
    expect(res.body.messages[1].sender).toBe("ai");
  });

  it("should only return messages for the authenticated user", async () => {
    const token1 = await getAuthToken();
    const res2 = await request(app)
      .post("/api/auth/signup")
      .send({ email: "other@example.com", password: "password123" });
    const token2 = res2.body.token;
    await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${token1}`)
      .send({ text: "User 1 private message" });
    const historyRes = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${token2}`);
    expect(historyRes.body.messages.length).toBe(0);
  });
});
