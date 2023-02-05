const User = require("../models/user");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cryptojs =require('crypto-js');
const dotenv = require('dotenv');
dotenv.config();



exports.signup = (req, res, next) => {
  const encryptemail = cryptojs.HmacSHA256(req.body.email, `${process.env.ACCESS_TOKEN_SECRET_EMAIL}`).toString();
  bcryptjs.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: encryptemail,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
  const encryptemail = cryptojs.HmacSHA256(req.body.email, `${process.env.ACCESS_TOKEN_SECRET_EMAIL}`).toString();
  User.findOne({ email: encryptemail})
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
      }
      bcryptjs.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
