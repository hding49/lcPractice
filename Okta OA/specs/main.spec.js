const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../main");

chai.use(chaiHttp);

const { request, expect } = chai;

describe("GET /", () => {
  it("responds with hello world", async () => {
    const response = await request(app).get("/");

    expect(response.status).to.equal(200);
    expect(response.text).to.equal("Hello World!");
  });
});

describe("POST /take", () => {
  it("accepts when token are available (happy path)", async () => {
    const key = "GET /user/:id"; //must exist in config.json with burst = 10
    const res = await request(app).post("/take").send({ endpoint: key });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("accepted", true);
    expect(res.body).to.have.property("remaining").that.is.a("number");
  });

  it("rejects once the bucket is exhausted ()", async () => {
    const key = "GET /user/:id"; //must exist in config.json with burst = 10

    for (let i = 0; i < 10; i++) {
      await request(app).post("/take").send({ endpoint: key });
    }

    //next call should be rejected with accepted = false and remaining=0
    const rejected = await request(app).post("/take").send({ endpoint: key });
    expect(rejected.status).to.equal(200);
    expect(rejected.body).to.deep.equal({ accepted: false, remaining: 0 });
  });

  it("return 400 when endpoint is missing in request body", async () => {
    const res = await request(app).post("/take").send({});
    expect(res.status).to.equal(400);
    expect(res.body.accepted).to.equal(false);
    expect(res.body.remaining).to.equal(0);
  });

  it("treats unknown endpoints as rejected (200 with accepted: false)", async () => {
    const res = await request(app)
      .post("/take")
      .send({ endpoint: "GET /nope" });
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ accepted: false, remaining: 0 });
  });
});
