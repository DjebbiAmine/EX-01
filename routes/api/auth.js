const express = require('express');
const app = express();
const db = require("../../models");
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');


// LoAd Input Validation

const validateSubmitInscription = require('../../validation/inscription');


// LoAd User and Inscription Model
const User = db.User;
const Inscription = db.Inscription;


// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public

module.exports = function(app) {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

app.get('/api/auth/getauth', (req, res) => {
        // user Matched
        const payload = { id: User.id, name: User.name }; // Create JWT Payload

        // Sign Token requIred
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 60 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );

});

app.post('/api/auth/validate', (req, res) => {

  const { errors, isValid } = validateSubmitInscription(req.body);
 
  // Check Validation
  if (!isValid) {
    return res.status(410).json(errors);
  }
  Inscription.findOne({
    where: {
      userId: req.body.userid
    }
  }).then(inscription => {
    let isInscription = inscription.validated
    if (!isInscription) {

      inscription.update(
        { validated: true},
        { where: { userId: req.body.userid} }
      )
        .then(result =>
          console.log(result)
        )
        .catch(err =>
          console.log(err)
        )
      res.status(200).send({
        message: "success! inscription is validated"
      });
      return;
    }
    else {
      res.status(200).send({
        message: "Failed! inscription already validated!"
      });
    }
  });
});

// @route   GET api/users/curreNt
// @desc    Return current user
// @access  PrivatE
/*router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);*/

}
