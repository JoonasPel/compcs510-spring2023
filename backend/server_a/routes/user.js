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
        } else {
          res.status(400);
          res.send();
        }
      });
  } else {
    res.status(400);
    res.send();   
  }
};

function handleUserLogin(req, res) {
  const user = req.body;
  if (user.hasOwnProperty("username") && user.hasOwnProperty("password")) {
    db.checkUserCredentials(user)
      .then(result => {
        if (result) {
          res.status(200).json({role: result});
        } else {
          res.status(400);
          res.send();
        }
    });
  } else {
    res.status(400);
    res.send();
  }
};

function handleDeleteUser(req, res, username) {
  const data = req.body;
  if (data.hasOwnProperty("password")) {
    db.deleteUser(username, data.password)
      .then(result => {
        if (result) {
          res.status(200);
          res.send();
        } else {
          res.status(400);
          res.send();
        }
      });
  } else {
    res.status(401);
    res.send();
  }
};

module.exports = {
  handleUserRegistering,
  handleUserLogin,
  handleDeleteUser,
};
