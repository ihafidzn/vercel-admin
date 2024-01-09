const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
  email: String,
  password: String,
  passwordConfirm: String,
  createdAt: { type: Date, default: Date.now },
  quiote: String,
});

const RegisterModel = mongoose.model("registers", RegisterSchema);
module.exports = RegisterModel;
