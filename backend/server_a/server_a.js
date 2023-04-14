const amqp = require("amqplib");
const express = require("express");
const http = require("http");
const cors = require("cors");
const order = require("./routes/order");
const config = require("./configs")


let rabbitChannel;
// Nodejs server configs
const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
}));
app.use(express.json());
// Gives every order an unique id by incrementing this.
let orderNumber = 0;

// starts rabbitmq connection
async function startRabbit() {
  try {
    const rabbitURL = "amqp://guest:guest@rabbitmq:" + config.rabbitPORT.toString();
    const rabbitConnection = await amqp.connect(rabbitURL);
    rabbitChannel = await rabbitConnection.createChannel();
    // creates queue in RabbitMQ if queue with this name didn't exist yet
    await rabbitChannel.assertQueue(config.ORDER_QUEUE, { durable: false });
    console.log("Server A connected to Rabbit");
  } catch (error) {
    console.error("Server A got error when trying to setup Rabbit: ", error);
    process.exit(1);
  }
}

// listen for requests from frontend
app.post("/order", (req, res) => {
  orderNumber++;
  order.handleOrderRequest(req, res, rabbitChannel, orderNumber);
});

// Start the App
startRabbit();
http.createServer(app).listen(config.nodejsPORT);
