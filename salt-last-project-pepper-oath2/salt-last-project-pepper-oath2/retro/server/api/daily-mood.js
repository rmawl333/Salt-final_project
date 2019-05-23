const express = require('express');
const { Moods } = require('../schema');

const router = express.Router();

router.post('/:teamId', async (req, res) => {
  const { teamId } = req.params;
  const { body } = req;

  const arr = [];

  for (let i = 0; i < body.length; i += 1) {

    const findMood = await Moods.find({ teamId });

    if (findMood.length === 0) {
      const createTeamMood = new Moods({
        teamId,
        members: [{
          memberId: body[i].memberId,
          name: body[i].name,
          moodstamp: [body[i].moodstamp],
        }],
      });
      await createTeamMood.save().then((respon) => {
        arr.push(respon);
      });
    } else {
      const findMember = await Moods.find(
        { members: { $elemMatch: { memberId: body[i].memberId } } },
      );
      if (findMember.length === 0) {
        const pushMember = await Moods.where({ teamId })
          .updateOne({
            $push: {
              members: {
                memberId: body[i].memberId,
                name: body[i].name,
                moodstamp: body[i].moodstamp,
              },
            },
          });
        arr.push(pushMember);
      } else {
        Moods.updateOne({ 'members.memberId': body[i].memberId }, {
          $push: {
            'members.$.moodstamp': body[i].moodstamp,
          },
        }, (err) => {
          if (err) return Error(err);
          return '';
        });
      }
    }
  }

  res.json(arr);
});

router.get('/', async (req, res) => {
  await Moods.find().then((teamfound) => {
    res.json(teamfound);
  }).catch((e) => {
    res.status(404).json({ message: 'team not found', e });
  });
});

router.get('/:teamId', async (req, res) => {
  const { teamId } = req.params;
  await Moods.find({ teamId }).then((teamfound) => {
    const finalMoodArray = [];
    for (let i = 0; i < teamfound[0].members.length; i += 1) {

      const memberName = teamfound[0].members[i].name;
      const data = teamfound[0].members[i].moodstamp.toString();
      const toObject = `{${data}}`;
      finalMoodArray.push({ name: memberName, data: JSON.parse(toObject) });

    }
    res.json(finalMoodArray);

  }).catch((e) => {
    res.status(404).json({ message: 'team not found', e });
  });
});

router.delete('/:teamId', async (req, res) => {
  const { teamId } = req.params;
  const deleteTeam = await Moods.where({ _id: teamId }).deleteOne();
  res.json(deleteTeam);
});

module.exports = router;
