const amqp = require('amqplib');


async function sendMessage() {
  try {
    // setup
    const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');
    const channel = await connection.createChannel();
    const queue = "orders";
    await channel.assertQueue(queue, { durable: false });
    console.log("Server A connected to Rabbit");
    // send message
    channel.sendToQueue(queue, Buffer.from(
      "THIS IS A MESSAGE FROM SERVER A. IF YOU SEE THIS. DEMO WORKS"));
    console.log("Server A sent message to Rabbit");

  } catch (error) {
    console.error("Server A got error when trying to setup Rabbit: ", error);
    process.exit(1);
  }
};

// Waiting 5 secs when starting and then sending the message.
setTimeout(() => {
  sendMessage();
}, 5000);