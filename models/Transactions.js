const Joi = require("joi");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var transactionsSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  ticker: { type: String, required: true },
  date: { type: String },
  price_per_share: { type: String },
  shares: { type: String },
  operation: { type: String },
  share: { type: Boolean },
});

var Transactions = mongoose.model("Transactions", transactionsSchema);

function validateTransaction(transaction) {
  const schema = Joi.object({
    ticker: Joi.string().min(2).max(5),
    date: Joi.string(),
    price_per_share: Joi.string(),
    shares: Joi.string(),
    operation: Joi.string(),
    share: Joi.boolean(),
  });

  return schema.validate(transaction);
}

exports.transactionsSchema = transactionsSchema;
exports.Transactions = Transactions;
exports.validate = validateTransaction;
