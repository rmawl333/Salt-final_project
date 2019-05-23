const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

mongoose.Promise = global.Promise;

mongoose.connect(
  'mongodb://retropepper:salt2pepper1@ds115874.mlab.com:15874/master',
  { useNewUrlParser: true },
);

const dailySchema = new Schema({
  _id: { type: Number, default: Date.now },
  teamId: String,
  learned: String,
  struggled: String,
  mood: [{ name: String, value: String }],
});

const weeklySchemaBoat = new Schema({
  _id: { type: Number, default: Date.now },
  teamId: String,
  sun: String,
  wind: String,
  anchor: String,
  rock: String,
  island: String,
  actionImprovements: [{ action: String, done: Boolean }],
});

const teamSchema = new Schema({
  teamName: String,
  email: String,
  members: [{ id: ObjectId, name: String }],
});

const dailyMoods = new Schema({
  teamId: String,
  members: [{ memberId: String, name: String, moodstamp: [String] }],
});

const Moods = mongoose.model('dailyMoods', dailyMoods);
const Teams = mongoose.model('teams', teamSchema);

const WeeklyBoat = mongoose.model('weeklyboat', weeklySchemaBoat);

const DailyPosts = mongoose.model('dailyposts', dailySchema);

module.exports = {
  DailyPosts,
  Teams,
  WeeklyBoat,
  Moods,
};
