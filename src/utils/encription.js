const bcrypt = require("bcrypt");

exports.createPasswordHash = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, process.env.PASSWORD_SALT, (err, encrypted) => {
      if (err) {
        return reject(err);
      }

      return resolve(encrypted);
    });
  });
