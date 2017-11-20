"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  sport: {
    type: String,
    enum: ["Volleyball", "Football", "Basketball", "Paddel"],
    default: "Volleyball"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User
};
