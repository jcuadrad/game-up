"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  location: {
    type: [Number]
  },
  startTime: {
    type: Date
  },

  endTime: {
    type: Date
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  playersNeeded: { type: Number },
  sport: {
    type: String,
    enum: ["Volleyball", "Football", "Basketball", "Paddel"],
    default: "Volleyball"
  },
  state: {
    type: String,
    enum: ["Coming Up", "Currently On", "Ended"],
    default: "Coming Up"
  },
  playersAttending: {
    type: [Schema.Types.ObjectId],
    ref: "User"
  }
});

const Game = mongoose.model("Game", gameSchema);

module.exports = {
  Game
};
