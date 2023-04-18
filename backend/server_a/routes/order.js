const config = require("../configs");
const db = require("../db");


// handle adding order
function handleAddOrderRequest(req, res, rabbitChannel) {
  const sandwichId = Number(req.body.sandwichId);
  // check that sandwichId is a number. TODO: also check that this exact
  // sandwichId exists in available sandwiches in some database.
  if (isNaN(sandwichId)) {
    res.status(400);
    res.send();
  } else {
    const order = {
      "sandwichId": sandwichId,
      "status": "inQueue",
    };
    db.addOrder(order)
      .then(result => {
        const isEmptyObject = Object.keys(result).length === 0;
        if (!isEmptyObject) {
          rabbitChannel.sendToQueue(config.ORDER_QUEUE, Buffer.from(JSON.stringify(result)));
          res.status(200).json(result);
        } else {
          res.status(500);
          res.send();
        }
      });
    }
};

// handle checking existing order status
function handleOrderStatusRequest(req, res, orderId) {
  const id = Number(orderId);
  // check if orderId is not valid
  if (isNaN(id)) {
    res.status(400);
    res.send();
  }
  db.getOrder(orderId)
    .then(order => {
      const isEmptyObject = Object.keys(order).length === 0;
      if (!isEmptyObject) {
        res.status(200).json(order);
      // order not found
      } else {
        res.status(404);
        res.send();
      } 
  });
};

// handle returning all existing orders
// CURRENTLY NOT WORKING. NEED USER IMPLEMENTATION FIRST.
function handleGetAllOrdersRequest(req, res) {
  res.status(500);
  res.send();
};

module.exports = {
  handleAddOrderRequest,
  handleOrderStatusRequest,
  handleGetAllOrdersRequest,
};
