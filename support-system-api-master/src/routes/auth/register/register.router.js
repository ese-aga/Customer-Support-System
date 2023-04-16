const express = require("express");
const registeredAgents = express.Router();

const { verifyCertainToken, adminAuth, agentAuth } = require("../../../utils/requireAuth");

const {
  registerAgent,
  getRegisteredAgent,
  registerCustomer,
  getRegisteredCustomer,
  certainCustomer,
  createAdmin,
} = require("./register.controller");

registeredAgents.post("/agent/register", adminAuth, registerAgent);
registeredAgents.get("/agents", adminAuth, getRegisteredAgent);
registeredAgents.post("/customer/register", registerCustomer);
registeredAgents.get("/customer", agentAuth, getRegisteredCustomer);
registeredAgents.get("/AdminGetCustomer", adminAuth, getRegisteredCustomer);
registeredAgents.get(
  "/customer/:customer_id",
  verifyCertainToken,
  certainCustomer
);
registeredAgents.post("/admin/register", createAdmin);

module.exports = {
  registeredAgents,
};
