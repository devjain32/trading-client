const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var usersSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  transactions: [{ type: Schema.Types.ObjectId, ref: "Transactions" }],
  friends: [{ type: Schema.Types.ObjectId, ref: "Users" }],
});

usersSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone_number: this.phone_number,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

var Users = mongoose.model("Users", usersSchema);

function validateUser(user) {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().length(10).required(),
    password: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(user);
}

exports.usersSchema = usersSchema;
exports.Users = Users;
exports.validate = validateUser;
