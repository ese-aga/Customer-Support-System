const express = require("express");
const agentLoginRouter = express.Router();

const {
  agentLogin,
  customerLogins,
  adminLogin,
} = require("./login.controller");

agentLoginRouter.post("/agent/login", agentLogin);
agentLoginRouter.post("/customer/login", customerLogins);
agentLoginRouter.post("/admin/login", adminLogin);

module.exports = {
  agentLoginRouter,
};