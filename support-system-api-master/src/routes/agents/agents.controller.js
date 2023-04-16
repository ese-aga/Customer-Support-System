const { db } = require("../../utils/database");
function modifyAgents(req, res) {
  const { agent_id } = req.params;
  const { name, email, status, availability, roles } = req.body;
  db("agent")
    .where({ agent_id })
    .update({
      roles,
      name,
      email,
      status,
      availability,
    })
    .then((resp) => {
      if (resp) {
        res.json("success");
      } else {
        res.json("error");
      }
    })
    .catch((err) => res.json("error"));
}

async function deleteAgent(req, res) {
  const agentId = req.params.agent_id;
  let trx;
  try {
    trx = await db.transaction();
    await db.transaction(async (trx) => {
      // Check if the agent has any associated cases
      const cases = await trx("cases").where("agent_id", agentId);
      if (cases.length > 0) {
        throw new Error("Cannot delete agent with associated cases");
      }

      // Delete the agent
      await trx("agent").where("agent_id", agentId).delete();

      // Commit the transaction
      await trx.commit();

      res.sendStatus(204);
    });
  } catch (error) {
    // Roll back the transaction on error
    if (trx) {
      await trx.rollback();
    }

    console.error(error);
    res.status(400).send({ error: error.message });
  }
}

module.exports = {
  modifyAgents,
  deleteAgent,
};