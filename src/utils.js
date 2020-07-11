const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APP_SECRET = "secret";

const saltRounds = 10;
const hashPassword = (password) =>
  new Promise((resolve, reject) =>
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) {
        reject(err);
      }
      return resolve(hash);
    })
  );

const comparePassword = (password, hash) =>
  new Promise((resolve, reject) =>
    bcrypt.compare(password, hash, function(err, res) {
      if (err) {
        reject(err);
      }
      return resolve(res);
    })
  );

const signToken = (userId) => jwt.sign({ userId }, APP_SECRET);

module.exports = {
  hashPassword,
  comparePassword,
  signToken,
};
