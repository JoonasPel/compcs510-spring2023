const config = require("../configs");
const db = require("../db");


// handle adding order
function handleAddOrderRequest(req, res, rabbitChannel, orderNumber) {
  const orderId = Number(orderNumber);  // just in case
  const sandwichId = Number(req.body.sandwichId);
  // check that sandwichId is a number. TODO: also check that this exact
  // sandwichId exists in available sandwiches in some database.
  if (isNaN(sandwichId) || isNaN(orderId)) {
    res.status(400);
    res.send();
  } else {
    const order = {
      "id": orderId,
      "sandwichId": sandwichId,
      "status": "inQueue",
    };
    db.addOrder(order)
      .then(result => {
        if (result) {
          rabbitChannel.sendToQueue(config.ORDER_QUEUE, Buffer.from(JSON.stringify(order)));
          res.status(200).json(order);
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
