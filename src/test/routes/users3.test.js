const request = require("supertest");
const buildApp = require("../../app");
const UserRepo = require("../../repos/user-repo");
const pool = require("../../pool");
const { randomBytes } = require("crypto");
const { default: migrate } = require("node-pg-migrate");
const format = require("pg-format");

beforeAll(async () => {
  // generate a random string
  const roleName = "a" + randomBytes(4).toString("hex");
  // connect to pg as normal to create the user and the schema
  await pool.connect({
    host: "localhost",
    port: 5432,
    database: "socialnetwork",
    user: "postgres",
    password: "password",
  });
  // create the new user
  await pool.query(`CREATE ROLE ${roleName} WITH LOGIN PASSWORD '${roleName}'`);
  // create the new schema
  await pool.query(`CREATE SCHEMA ${roleName} AUTHORIZATION ${roleName}`);
  // disconnect from pg
  await pool.close();
  // run our migrations
  await migrate({
    schema: roleName,
    direction: "up",
    log: () => {},
    // don't lock the db while we are excuting that migration
    noLock: true,
    dir: "migrations",
    databaseUrl: {
      host: "localhost",
      port: 5432,
      database: "socialnetwork",
      user: roleName,
      password: roleName,
    },
  });
  // reconnect with the generated user
  await pool.connect({
    host: "localhost",
    port: 5432,
    database: "socialnetwork",
    user: roleName,
    password: roleName,
  });
  //
});

afterAll(() => {
  pool.close();
});

it("create a user", async () => {
  const startingCount = await UserRepo.count();

  await request(buildApp())
    .post("/users")
    .send({ username: "testuser", bio: "test bio" })
    .expect(200);

  const finishingCount = await UserRepo.count();
  expect(finishingCount - startingCount).toEqual(1);
});
