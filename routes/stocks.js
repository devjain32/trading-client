const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Stocks, validate } = require("../models/stocks");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.get("/", async (req, res) => {
  const stocks = await Stocks.find();
  res.send(stocks);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  var stock = new Stocks({
    ticker: req.body.ticker,
    date_purchased: req.body.date_purchased,
    value_purchased: req.body.value_purchased,
  });
  stock = await stock.save();

  res.send(stock);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  var stock = await Stocks.findByIdAndUpdate(req.params.id, {
    date_sold: req.body.date_sold,
    value_sold: req.body.value_sold,
  });
  stock = await stock.save();

  res.send(stock);
});

module.exports = router;
