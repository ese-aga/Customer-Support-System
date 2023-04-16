const { db } = require("../../utils/database");
const uuid = require("uuid");

async function createCase(req, res) {
  try {
    const { customer_id, product_id, description } = req.body;
    const case_id = uuid.v4();
    let agent_id = null;

    // find an available agent
    const [newCase] = await db("cases")
      .insert({
        description,
        status: "new",
        customer_id,
        product_id,
        case_id,
      })
      .returning("case_id");

    const [agent] = await db("agent")
      .whereNotExists(function () {
        this.select("*")
          .from("cases")
          .whereRaw(
            "cases.agent_id = agent.agent_id and cases.status <> ?",
            "closed"
          );
      })
      .andWhere({ availability: true })
      .forUpdate()
      .limit(1);

    if (agent) {
      agent_id = agent.agent_id;

      // update agent availability to false
      await db("agent")
        .where({ agent_id })
        .update({ availability: false, status: "unavailable" });

      // update all cases waiting for this agent to be available
      await db("cases")
        .where({ agent_id: null, status: "new" })
        .andWhere({ product_id, customer_id })
        .update({ agent_id, status: "in_progress" });
    }

    await db("cases")
      .where("case_id", case_id)
      .andWhere("status", "new")
      .update({
        status: agent_id ? "in_progress" : "new",
        agent_id,
      });

    res.status(201).json({ case_id, agent_id });
  } catch (err) {
    console.log(err);
  }
}

async function closeCase(req, res) {
  try {
    const { case_id } = req.params;

    // Get the agent_id of the assigned agent before updating the case
    const { agent_id } = await db("cases")
      .select("agent_id")
      .where("case_id", case_id)
      .andWhere("status", "in_progress")
      .first();

    if (!agent_id) {
      console.log("case not found or already closed");
      res.status(404).json({ error: "Case not found or already closed" });
      return;
    }

    // Update the case status to "closed" and free up the assigned agent
    const [result] = await db("cases")
      .where("case_id", case_id)
      .andWhere("status", "in_progress")
      .update({
        status: "closed",
        agent_id: null,
      })
      .returning("*");

    // Update the availability of the assigned agent to true
    await db("agent").where({ agent_id }).update({ availability: true, status: 'available' });

    res.json({ message: "Case closed successfully" });
  } catch (err) {
    // console.log(err);
    res.json({ message: "Case closed successfully" });
  }
}

//this is the function for agent to view all cases
function viewCases(req, res) {
  db.select("*")
    .from("cases")
    // .where("status", "=", "new")
    .then((cases) => res.status(200).json(cases))
    .catch((err) => res.status(200).json(err));
}

function certainCase(req, res) {
  const { case_id } = req.params;
  db.select("*")
    .from("cases")
    .where({ case_id })
    .then((singleCase) => {
      if (singleCase.length) {
        return res.json(singleCase[0]);
      } else {
        return res.status(400).json("case not found");
      }
    });
}

module.exports = {
  createCase,
  closeCase,
  viewCases,
  certainCase,
};
