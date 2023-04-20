const amqp = require("amqplib");
const express = require("express");
const http = require("http");
const cors = require("cors");
const order = require("./routes/order");
const config = require("./configs")
const db = require("./db");


let rabbitChannel, rabbitConnection;
// Nodejs server configs
const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
}));
app.use(express.json());

// starts rabbitmq connection
async function startRabbit() {
  try {
    const rabbitURL = "amqp://guest:guest@rabbitmq:" + config.rabbitPORT.toString();
    rabbitConnection = await amqp.connect(rabbitURL);
    rabbitChannel = await rabbitConnection.createChannel();
    // creates queue in RabbitMQ if queue with this name didn't exist yet
    await rabbitChannel.assertQueue(config.ORDER_QUEUE, { durable: false });
    console.log("Server A connected to Rabbit");
  } catch (error) {
    console.error("Server A got error when trying to setup Rabbit: ", error);
    process.exit(1);
  }
}

// listen for order requests from frontend
app.post("/order", (req, res) => {
  order.handleAddOrderRequest(req, res, rabbitChannel);
});
app.get("/order", (req, res) => {
  order.handleGetAllOrdersRequest(req, res);
});
app.get("/order/:orderId", (req, res) => {
  order.handleOrderStatusRequest(req, res, req.params.orderId);
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
