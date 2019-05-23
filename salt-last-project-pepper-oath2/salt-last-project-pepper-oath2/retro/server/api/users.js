const express = require('express');
const { Teams } = require('../schema');


const oktaClient = require('../lib/oktaClient');

const router = express.Router();

router.post('/', (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const newUser = {
    profile: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      login: req.body.email,
    },
    credentials: {
      password: {
        value: req.body.password,
      },
    },
  };


  return oktaClient
    .createUser(newUser)
    .then((user) => {
      res.status(201);
      res.send(user);
    }).then(async () => {
      const retroUser = new Teams({
        teamName: newUser.profile.firstName,
        email: newUser.profile.email,
      });
      await retroUser.save().then(() => {
      });
    })
    .catch((err) => {
      res.status(400);
      res.send(err);
    });


});

module.exports = router;
