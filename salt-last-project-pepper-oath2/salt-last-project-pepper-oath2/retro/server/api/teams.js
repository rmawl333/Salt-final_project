const express = require('express');
const { Teams } = require('../schema');

const router = express.Router();


router.get('/', async (req, res) => {
  await Teams.find().then((teams) => {
    res.json(teams);
  }).catch((e) => {
    res.status(404).json({ message: e.reason });
  });
});

router.get('/:teamId', async (req, res) => {
  const { teamId } = req.params;
  await Teams.find({ _id: teamId }).then((teamfound) => {
    res.json(teamfound);
  }).catch((e) => {
    res.status(404).json({ message: 'team not found', reason: e.reason });
  });
});

router.post('/email', async (req, res) => {
  const { email } = req.body;
  await Teams.find({ email }).then((team) => {
    if (team.length === 0) {
      res.status(404).json({ message: 'no team found' });
    }
    res.json(team[0]);
  }).catch(e => res.status(404).json(e));
});


router.post('/', async (req, res) => {
  const { teamName, members, email } = req.body;
  const postTeam = new Teams({
    teamName,
    members,
    email,
  });
  await postTeam.save().then((resp) => {
    res.json(resp);
  });
});

router.post('/:teamId', async (req, res) => {
  const { teamId } = req.params;
  const { name } = req.body;

  const pushMember = await Teams.where({ _id: teamId }).updateOne({
    $push: { members: { name } },
  });
  res.json(pushMember);
});

router.delete('/:teamId', async (req, res) => {
  const { teamId } = req.params;
  const deleteTeam = await Teams.where({ _id: teamId }).deleteOne();
  res.json(deleteTeam);
});

router.delete('/:teamId/:memberId', async (req, res) => {
  const { teamId, memberId } = req.params;
  const deleteMember = await Teams.updateOne(
    { _id: teamId },
    { $pull: { members: { _id: memberId } } },
  );
  res.json(deleteMember);
});

module.exports = router;
