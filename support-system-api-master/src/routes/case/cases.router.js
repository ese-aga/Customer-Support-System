const express = require("express");
const caseRouter = express.Router();

const { agentAuth, adminAuth} = require("../../utils/requireAuth");
const {
  createCase,
  closeCase,
  viewCases,
  certainCase,
} = require("./cases.controller");

caseRouter.post("/case", createCase);
caseRouter.post("/case/complete/:case_id", closeCase);
caseRouter.get("/case", adminAuth, viewCases);
caseRouter.get("/case/:case_id", certainCase);
caseRouter.get("/agentCase", agentAuth, viewCases);

module.exports = {
  caseRouter,
};
