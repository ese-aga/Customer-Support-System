const jwt = require("jsonwebtoken");

//this is the middleware that is used to make request through the parameter or view your details to make sure that you're the one making the request to allow only you do it for your account.
function verifyCertainToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.customerId = decoded.customerId;
    if (decoded.customerId !== req.params.customer_id) {
      return res.status(401).json("unauthorize");
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

//this is the token to make sure that only you can make post request to your data

function verifyAuthToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.customerId = decoded.id;
    // console.log(req.body.customer_id);
    if (decoded.customerId !== req.body.customer_id) {
      return res.status(401).json("unauthorize");
    }
    next();
  } catch (err) {
    console.log(err);
  }
}

function agentAuth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "no token provided" });
  }
  try {
    const decoded = jwt.verify(token, "your_secret_key"); //preferably, the secret key for the token can be stored in an enviromental variable such as .env file
    req.roles = decoded.roles;
    // console.log(decoded.roles);
    if (decoded.roles !== "agent") {
      return res.status(401).json("unauthorize");
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

//this is the token for admins
function adminAuth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "no token provided" });
  }
  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.roles = decoded.roles;
    // console.log(decoded.userId);
    if (decoded.roles !== "admin") {
      return res.status(401).json("unauthorize");
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = {
  verifyCertainToken,
  agentAuth,
  verifyAuthToken,
  adminAuth,
};
