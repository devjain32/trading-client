const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Users, validate } = require("../models/users");
const { Transactions } = require("../models/transactions");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");

// GET all users
// GET one user
// POST a new user
//
// UPDATE a user's information
// UPDATE a user's casita ownership (add the casita)
// UPDATE a user's casita ownership (remove the casita)
// DELETE a user

router.get("/", async (req, res) => {
  const users = await Users.find();
  res.send(users);
});

router.get("/:id", async (req, res) => {
  // const users = await Users.findOne({ _id: req.params.id })
  //   .where("_id")
  //   .populate({
  //     path: "casitas",
  //     populate: { path: "lights" },
  //     populate: { path: "rooms", populate: { path: "lights" } },
  //   });
  const users = await Users.findOne({ _id: req.params.id })
    .where("_id")
    .populate({ path: "transactions" });
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  var user = await Users.findOne({ email: req.body.email });
  var user2 = await Users.findOne({ phone_number: req.body.phone_number });

  if (user && user2) {
    return res.status(400).send("both");
  } else if (user) {
    return res.status(400).send("email");
  } else if (user2) {
    return res.status(400).send("phone");
  }

  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(req.body.password, salt);

  user = new Users({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    password: newPassword,
  });
  user = await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(user);
});

router.post("/login", async (req, res) => {
  function validateLogin(req) {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(req);
  }
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Users.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  const token = user.generateAuthToken();
  res.send(token);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  var user = await Users.findByIdAndUpdate(
    req.params.id,
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
    },
    { new: true }
  );
  user = await user.save();
  res.send(user);
});

router.put("/transaction/:id", auth, async (req, res) => {
  console.log("inside");
  var transaction = await Transactions.findById(req.body.transactionId);
  console.log("found transaction");
  console.log(transaction);
  if (!transaction)
    return res.status(400).send("This transaction does not exist.");
  console.log("past error");
  var user = await Users.findByIdAndUpdate(
    req.params.id,
    {
      $push: { transactions: req.body.transactionId },
    },
    { new: true }
  );
  console.log("past find");
  console.log(user);
  user = await user.save();
  res.send(user);
});

router.delete("/:id", auth, async (req, res) => {
  var user = await Users.findById(req.params.id);
  if (!user) return res.status(400).send("User does not exist.");

  var user = await Users.findByIdAndDelete(req.params.id, { new: true });
  res.send(user);
});

module.exports = router;
