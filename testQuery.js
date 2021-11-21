const pg = require("pg");
const Pool = pg.Pool;

const pool = new Pool({
  user: "postgres",
  password: "password",
  host: "localhost",
  port: 5432,
  database: "socialnetwork",
});

const excuteQuery = async () => {
  await pool.query("create table test (id serial primary key);");
  const { rows } = await pool.query("select * from test;");
  console.table(rows);
};

excuteQuery();
