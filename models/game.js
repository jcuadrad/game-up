"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  location: [], //COORDINATES FROM GOOGLE MAPS
  startTime: TimeRanges, // START TIME NOT TIME RANGES,
  duration: Number
});

const User = mongoose.model("Game", gameSchema);

module.exports = {
  Game
};
