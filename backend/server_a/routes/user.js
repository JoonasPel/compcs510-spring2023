const config = require("../configs");
const db = require("../db");


function handleUserRegistering(req, res) {
  const user = req.body;
  if (user.hasOwnProperty("username") && user.hasOwnProperty("email") && user.hasOwnProperty("password")) {
    db.addUser(user)
      .then(result => {
        if (result) {
          res.status(201);
          res.send();
          return;
        } else {
          res.status(400);
          res.send();
        }
      }); 
  }
};

module.exports = {
  handleUserRegistering,
};
