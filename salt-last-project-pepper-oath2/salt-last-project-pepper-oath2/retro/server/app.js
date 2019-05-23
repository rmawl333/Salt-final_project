const express = require('express');
const {
  getTeam, getDaily, getWeekly, users, moods,
} = require('./api');

const app = express();
app.use(express.json());


app.use('/api/teams', getTeam);
app.use('/api/daily-retro', getDaily);
app.use('/api/weekly-retro', getWeekly);
app.use('/api/users', users);
app.use('/api/daily-mood', moods);


module.exports = app;
