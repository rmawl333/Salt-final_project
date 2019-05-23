const express = require('express');
const { DailyPosts } = require('../schema');

const router = express.Router();

router.get('/:teamId', async (req, res) => {
  const { teamId } = req.params;
  const getTeamPosts = await DailyPosts.find({ teamId });
  res.json(getTeamPosts);
});

router.get('/', async (req, res) => {
  const getTeamsPosts = await DailyPosts.find({});
  res.json(getTeamsPosts);
});

router.get('/:teamId/:postId', async (req, res) => {
  const { postId, teamId } = req.params;
  const getPost = await DailyPosts.find({ _id: postId, teamId });
  res.json(getPost);
});

router.post('/:teamId', async (req, res) => {
  const { learned, struggled, mood } = req.body;
  const { teamId } = req.params;
  const postDailyMoods = new DailyPosts({
    teamId,
    learned,
    struggled,
    mood,
  });
  postDailyMoods.save().then((resp) => {
    res.json(resp);
  });
});

module.exports = router;
