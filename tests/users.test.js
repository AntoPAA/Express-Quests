const request = require("supertest");
const crypto = require("node:crypto");
const app = require("../src/app");

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});

describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const response = await request(app).post("/api/users").send(newUser);

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    const getResponse = await request(app).get(
      `/api/users/${response.body.id}`
    );

    expect(getResponse.headers["content-type"]).toMatch(/json/);
    expect(getResponse.status).toEqual(200);

    expect(getResponse.body).toHaveProperty("id");

    expect(getResponse.body).toHaveProperty("firstname");
    expect(getResponse.body.firstname).toStrictEqual(newUser.firstname);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Harry" };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);

    expect(response.status).toEqual(500);
  });
});

describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUser = {
      firstname: "Jax",
      lastname: "Dorms",
      email: "jax.dorms@example.com",
      city: "Los Angeles",
      language: "English",
    };

    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );

    const id = result.insertId;

    const updatedUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);

    expect(response.status).toEqual(204);

    const [resultSelect] = await database.query(
      "SELECT * FROM users WHERE id=?",
      id
    );
    [userInDatabase] = resultSelect;
    const [userInDatabase] = result;

    expect(userInDatabase).toHaveProperty("id");
    expect(userInDatabase).toHaveProperty("firstname", updatedUser.firstname);
    expect(userInDatabase).toHaveProperty("lastname", updatedUser.lastname);
    expect(userInDatabase).toHaveProperty("email", updatedUser.email);
    expect(userInDatabase).toHaveProperty("city", updatedUser.city);
    expect(userInDatabase).toHaveProperty("language", updatedUser.language);
  });
  it("should return an error", async () => {
    const userWithMissingProps = { title: "Marie" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(500);
  });

  it("should return no user", async () => {
    const newUser = {
      firstname: "Jack",
      lastname: "Eron",
      email: "jack.eron@example.com",
      city: "Boston",
      language: "English",
    };

    const response = await request(app).put("/api/movies/0").send(newUser);

    expect(response.status).toEqual(404);
  });
});

describe("DELETE /api/users/:id", () => {
  it("should delete user", async () => {
    const newUser = {
      firstname: "David",
      lastname: "Hone",
      email: "david.hone@example.com",
      city: "Paris",
      language: "French",
    };

    const id = await request(app).post("/api/users").send(newUser);

    const responseDelete = await request(app).delete(`/api/users/${id}`);

    expect(responseDelete.status).toEqual(204);

    const responseGet = await request(app).get(`/api/users/${id}`);

    expect(responseGet.status).toEqual(404);
  });

  it("l'utilisateur n'existe pas", async () => {
    const response = await request(app).delete("/api/users/0");

    expect(response.status).toEqual(404);
  });
});
