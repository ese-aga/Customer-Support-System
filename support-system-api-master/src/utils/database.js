const { knex } = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    user: "eseagadagba",
    port: 5432,
    password: "",
    database: "supportsystem",
  },
});

module.exports = {
  db,
};
