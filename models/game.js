"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  location: {
    type: { type: String },
    coordinates: [Number]
  },
  startTime: TimeRanges, // START TIME NOT TIME RANGES,
  duration: Number,
  owner: String,
  playersNeeded: Number,
  type: String,
  state: {
    type: String,
    enum: ["Coming Up", "Currently On", "Ended"],
    default: "Coming Up"
  },
  playersAttending: [String]
});

const User = mongoose.model("Game", gameSchema);

module.exports = {
  Game
};
