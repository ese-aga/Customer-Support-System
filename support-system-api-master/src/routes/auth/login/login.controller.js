const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { db } = require("../../../utils/database");

async function agentLogin(req, res) {
  const { email, passwords } = req.body;

  if (!email || !passwords) {
    return res.status(400).json("email and passwords are required");
  }

  try {
    //find the agent in the database
    const agent = await db("agent").where({ email }).first();

    if (!agent) {
      return res.status(401).json("support agent not found");
    }

    //check if the password is correct
    const passwordMatch = await bcrypt.compare(passwords, agent.passwords);
    if (!passwordMatch) {
      return res.status(401).json("invalid email or password");
    }

    //generate a jwt token
    const token = jwt.sign(
      { agentId: agent.agent_id, roles: agent.roles },
      "your_secret_key"
    );

    //this is to decode the token to check if the id and roles are stored there
    //const decode = jwt.decode(token)
    //console.log(decode.agentId)

    //return the agent details with token
    const agentWithToken = { ...agent, token };
    return res.status(200).json(agentWithToken);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
}

async function adminLogin(req, res) {
  const { email, passwords } = req.body;

  if (!email || !passwords) {
    return res.status(400).json("email and passwords are required");
  }

  try {
    //find the agent in the database
    const admin = await db("admins").where({ email }).first();

    if (!admin) {
      return res.status(401).json("admin not found");
    }

    //check if the password is correct
    const passwordMatch = await bcrypt.compare(passwords, admin.passwords);
    if (!passwordMatch) {
      return res.status(401).json("invalid email or password");
    }

    //generate a jwt token
    const token = jwt.sign(
      { adminId: admin.admin_id, roles: admin.roles },
      "your_secret_key"
    );

    //this is to decode the token to check if the id and roles are stored there
    // const decode = jwt.decode(token);
    // console.log(decode.customerId);

    //return the agent details with token
    const adminWithToken = { ...admin, token };
    return res.status(200).json(adminWithToken);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
}

async function customerLogins(req, res) {
  const { email, passwords } = req.body;

  if (!email || !passwords) {
    return res.status(400).json("email and passwords are required");
  }

  try {
    //find the agent in the database
    const customer = await db("customers").where({ email }).first();

    if (!customer) {
      return res.status(401).json("support agent not found");
    }

    //check if the password is correct
    const passwordMatch = await bcrypt.compare(passwords, customer.passwords);
    if (!passwordMatch) {
      return res.status(401).json("invalid email or password");
    }

    //generate a jwt token
    const token = jwt.sign(
      { customerId: customer.customer_id, roles: customer.roles },
      "your_secret_key"
    );

    //this is to decode the token to check if the id and roles are stored there
    // const decode = jwt.decode(token);
    // console.log(decode.customerId);

    //return the agent details with token
    const customerWithToken = { ...customer, token };
    return res.status(200).json(customerWithToken);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occurred" });
  }
}

module.exports = {
  agentLogin,
  customerLogins,
  adminLogin,
};