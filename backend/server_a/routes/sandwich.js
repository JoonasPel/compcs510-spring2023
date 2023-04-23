const config = require("../configs");
const db = require("../db");

// used to check that only people knowing this api key can create a new sandwich.
const API_KEY = process.env.CREATE_SANDWICH_API_KEY;

function handleGetSandwiches(req, res) {
  db.getSandwiches()
  .then(sandwiches => {
    res.status(200).json(sandwiches);
  });
};

function handleAddSandwich(req, res) {
  const data = req.body;
  if (data.apiKey === API_KEY) {
    delete data.apiKey;
    db.createSandwich(data)
      .then(result => {
        if (result) {
          res.status(200);
          res.send();
        } else {
          res.status(400);
          res.send();
        }
      })
  } else {
    res.status(403);
    res.send();
  }
}

function handleDeleteSandwich(req, res, sandwichId) {

}

module.exports = {
  handleGetSandwiches,
  handleAddSandwich,
  handleDeleteSandwich,
};