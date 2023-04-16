const express = require("express");
const agentDetails = express.Router();

const { adminAuth } = require("../../utils/requireAuth");
const { modifyAgents, deleteAgent } = require("./agents.controller");

agentDetails.put("/agent/:agent_id", adminAuth, modifyAgents);
agentDetails.delete("/agent/:agent_id", adminAuth, deleteAgent);

module.exports = {
  agentDetails,
};