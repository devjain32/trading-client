const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Transactions, validate } = require("../models/transactions");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.get("/", async (req, res) => {
  const transactions = await Transactions.find();
  res.send(transactions);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  var transaction = new Transactions({
    ticker: req.body.ticker,
    date: req.body.date,
    price_per_share: req.body.price_per_share,
    shares: req.body.shares,
    operation: req.body.operation,
    share: false,
  });
  transaction = await transaction.save();
  res.send(transaction);
});

router.put("/:id", auth, async (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  var transaction = await Transactions.findByIdAndUpdate(req.params.id, {
    date: req.body.date,
    price_per_share: req.body.price_per_share,
    shares: req.body.shares,
    operation: req.body.operation,
  });
  transaction = await transaction.save();

  res.send(transaction);
});

router.delete("/:id", auth, async (req, res) => {
  var transaction = await Transactions.findById(req.params.id);
  if (!transaction) return res.status(400).send("Transaction does not exist.");

  transaction = await Transactions.findByIdAndDelete(req.params.id, {
    new: true,
  });
  res.send(transaction);
});

module.exports = router;
