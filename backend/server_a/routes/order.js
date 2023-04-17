const config = require("../configs");
const db = require("../db");

// save orders. TODO: SQL DB THIS
const orders = new Map();

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
    orders.set(order.id, order);
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
  const order = orders.get(id);
  if (order) {
    res.status(200).json(order);
  // order not found
  } else {
    res.status(404);
    res.send();
  }
};
// handle returning all existing orders
function handleGetAllOrdersRequest(req, res) {
  const allOrders = Array.from(orders.values());
  res.status(200).json(allOrders);
};

module.exports = {
  handleAddOrderRequest,
  handleOrderStatusRequest,
  handleGetAllOrdersRequest,
};
