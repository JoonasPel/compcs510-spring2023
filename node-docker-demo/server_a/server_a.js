const amqp = require("amqplib");
const express = require("express");
const http = require("http");

// rabbitmq configs
const QUEUENAME = "orders";
const rabbitPORT = 5672;
let rabbitChannel;
// Nodejs server configs
const app = express();
const nodejsPORT = 3000;

// starts rabbitmq connection
async function startRabbit() {
  try {
    const rabbitURL = "amqp://guest:guest@rabbitmq:" + rabbitPORT.toString();
    const rabbitConnection = await amqp.connect(rabbitURL);
    rabbitChannel = await rabbitConnection.createChannel();
    // creates queue in RabbitMQ if queue with this name didn't exist yet
    await rabbitChannel.assertQueue(QUEUENAME, { durable: false });
    console.log("Server A connected to Rabbit");
  } catch (error) {
    console.error("Server A got error when trying to setup Rabbit: ", error);
    process.exit(1);
  }
}

// listen for requests from frontend
app.get("/something", (req, res) => {
  const message = "Hello from Server A";
  rabbitChannel.sendToQueue(QUEUENAME, Buffer.from(message));
});

// Start the App
startRabbit();
http.createServer(app).listen(nodejsPORT);
