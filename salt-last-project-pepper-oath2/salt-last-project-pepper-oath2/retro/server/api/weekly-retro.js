const express = require('express');
const { WeeklyBoat } = require('../schema');

const router = express.Router();

router.get('/', async (req, res) => {

  const getWeeklyPosts = await WeeklyBoat.find({});

  res.json(getWeeklyPosts);
});

router.get('/:teamId', async (req, res) => {

  const { teamId } = req.params;
  const getWeeklyPosts = await WeeklyBoat.find({ teamId });

  res.json(getWeeklyPosts);
});

router.get('/:teamId/:postId', async (req, res) => {

  const { postId, teamId } = req.params;
  const weeklyPost = await WeeklyBoat.find({ _id: postId, teamId });

  res.json(weeklyPost);
});

router.post('/:teamId', async (req, res) => {

  const {
    sun, wind, anchor, rock, island, actionImprovements,
  } = req.body;
  const { teamId } = req.params;
  const postWeeklyBoat = new WeeklyBoat({
    teamId,
    sun,
    wind,
    anchor,
    rock,
    island,
    actionImprovements,
  });

  postWeeklyBoat.save().then((resp) => {
    res.json(resp);
  });
});

module.exports = router;
