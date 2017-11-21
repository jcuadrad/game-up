'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function arrayLimit (val) {
  return val.length <= 10;
}

const gameSchema = new Schema({
  name: {
    type: String
  },

  location: {
    type: { type: String },
    coordinates: [Number]
  },

  startTime: {
    type: Date
  },

  endTime: {
    type: Date
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  playersNeeded: { type: Number },
  sport: {
    type: String,
    enum: ['Volleyball', 'Football', 'Basketball', 'Paddel'],
    default: 'Volleyball'
  },
  state: {
    type: String,
    enum: ['Coming Up', 'Currently On', 'Ended'],
    default: 'Coming Up'
  },
  playersAttending: {
    type: [Schema.Types.ObjectId],
    ref: 'User'
  }
});

gameSchema.index({ location: '2dsphere' });

const Game = mongoose.model('Game', gameSchema);

module.exports = {
  Game
};
