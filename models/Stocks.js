const Joi = require("joi");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var stocksSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  ticker: { type: String, required: true },
  date_purchased: { type: String },
  value_purchased: { type: String },
  date_sold: { type: String },
  value_sold: { type: String },
  public: [{ type: Schema.Types.ObjectId, ref: "Users" }],
});

var Stocks = mongoose.model("Stocks", stocksSchema);

function validateStock(stock) {
  const schema = Joi.object({
    ticker: Joi.string().min(2).max(5),
    date_purchased: Joi.string().min(2),
    value_purchased: Joi.string().min(2),
    date_sold: Joi.string().min(2),
    value_sold: Joi.string().min(2),
  });

  return schema.validate(stock);
}

exports.stocksSchema = stocksSchema;
exports.Stocks = Stocks;
exports.validate = validateStock;
