const bcrypt = require("bcrypt");
const { db } = require("../../../utils/database");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "my_secret_key";

async function registerAgent(req, res) {
  const { name, email, passwords } = req.body;
  if (!email || !passwords) {
    return res
      .status(400)
      .json({ message: "email and passwords are required" });
  }

  //to hash the password
  const hashedPassword = await bcrypt.hash(passwords, 10);

  try {
    await db("agent").insert({
      name,
      passwords: hashedPassword,
      email,
      roles: "agent",
      agent_id: uuid.v4(),
    });
    res.json({ message: "user successfully created" });
  } catch (err) {
    console.log(err);
    res.status(500).json("an error occured");
  }
}

async function registerCustomer(req, res) {
  const { name, email, address, passwords } = req.body;
  if (!email || !passwords) {
    return res
      .status(400)
      .json({ message: "email and passwords are required" });
  }

  //to hash the password
  const hashedPassword = await bcrypt.hash(passwords, 10);

  try {
    await db("customers").insert({
      name,
      passwords: hashedPassword,
      email,
      roles: "customer",
      address,
      customer_id: uuid.v4(),
    });
    res.json("customer successfully created");
  } catch (err) {
    console.log(err);
    res.status(500).json("an error occured");
  }
}

function getRegisteredAgent(req, res) {
  db.select("*")
    .from("agent")
    .then((agent) => res.status(200).json(agent))
    .catch((err) => res.status(400).json(err));
}

function getRegisteredCustomer(req, res) {
  db.select("*")
    .from("customers")
    .then((customer) => res.status(200).json(customer))
    .catch((err) => res.status(400).json(err));
}

function certainCustomer(req, res) {
  const { customer_id } = req.params;
  db.select("*")
    .from("customers")
    .where({ customer_id })
    .then((customer) => {
      if (customer.length) {
        return res.json(customer[0]);
      } else {
        return res.staus(400).json("customer not found");
      }
    });
}

async function createAdmin(req, res) {
  const { name, email, passwords } = req.body;
  if (!email || !passwords) {
    return res
      .status(400)
      .json({ message: "email and passwords are required" });
  }

  //to hash the password
  const hashedPassword = await bcrypt.hash(passwords, 10);

  try {
    await db("admins").insert({
      name,
      passwords: hashedPassword,
      email,
      roles: "admin",
      admin_id: uuid.v4(),
    });
    res.json({ message: "admin successfully created" });
  } catch (err) {
    console.log(err);
    res.status(500).json("an error occured");
  }
}

module.exports = {
  registerAgent,
  getRegisteredAgent,
  getRegisteredCustomer,
  registerCustomer,
  certainCustomer,
  createAdmin,
};
