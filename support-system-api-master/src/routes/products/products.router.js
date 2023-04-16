const express = require("express");
const productRouter = express.Router();
const { agentAuth } = require("../../utils/requireAuth");

const {
  products,
  viewProducts,
  certainProduct,
} = require("./products.controller");

productRouter.post("/product", agentAuth, products);
productRouter.get("/product", viewProducts);
productRouter.get("/product/:product_id", certainProduct);

module.exports = {
  productRouter,
};
