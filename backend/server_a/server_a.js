const amqp = require("amqplib");
const express = require("express");
const http = require("http");
const cors = require("cors");
const order = require("./routes/order");
const user = require("./routes/user");
const sandwich = require("./routes/sandwich");
const config = require("./configs")
const db = require("./db");


let rabbitChannel, rabbitConnection;
// Nodejs server configs
const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "DELETE"],
}));
app.use(express.json());

// starts rabbitmq connection
async function startRabbit() {
  try {
    const rabbitURL = "amqp://guest:guest@rabbitmq:" + config.rabbitPORT.toString();
    rabbitConnection = await amqp.connect(rabbitURL);
    rabbitChannel = await rabbitConnection.createChannel();
    await rabbitChannel.assertQueue(config.ORDER_QUEUE, { durable: false });
    await rabbitChannel.assertQueue(config.STATUS_QUEUE, { durable: false });
    // consumes handled orders from server b and updates the order data in db.
    rabbitChannel.consume(config.STATUS_QUEUE, (msg) => {
      const order = JSON.parse(msg.content.toString('utf-8'));
      db.modifyOrder(order);
    });
    console.log("Server A connected to Rabbit");
  } catch (error) {
    console.error("Server A got error when trying to setup Rabbit: ", error);
    process.exit(1);
  }
}

// listen for order requests
app.post("/order", (req, res) => {
  order.handleAddOrderRequest(req, res, rabbitChannel);
});
app.get("/order", (req, res) => {
  order.handleGetAllOrdersRequest(req, res);
});
app.get("/order/:orderId", (req, res) => {
  order.handleOrderStatusRequest(req, res, req.params.orderId);
});

// listen for sandwich requests
app.get("/sandwich", (req, res) => {
  sandwich.handleGetSandwiches(req, res);
});
app.post("/sandwich", (req, res) => {
  sandwich.handleAddSandwich(req, res);
});
app.delete("/sandwich/:sandwichId", (req, res) => {
  sandwich.handleDeleteSandwich(req, res, req.params.sandwichId);
});

// listen for user requests
app.post("/user", (req, res) => {
  user.handleUserRegistering(req, res);
});
app.post("/user/login", (req, res) => {
  user.handleUserLogin(req, res);
});
app.delete("/user/:username", (req, res) => {
  user.handleDeleteUser(req, res, req.params.username);
});

// Start the App
const promise1 = startRabbit();
const promise2 = db.createTables();
let server;
Promise.all([promise1, promise2]).then(() => {
  server = http.createServer(app).listen(config.nodejsPORT);
});

// catch ctrl + c or container closing
process.on("SIGINT", () => closeGracefully());
process.on("SIGTERM", () => closeGracefully());
// close rabbit connection and server_a gracefully
function closeGracefully() {
  rabbitChannel.close();
  rabbitConnection.close();
  server.close(() => {
    process.exit(0);
  });
};
