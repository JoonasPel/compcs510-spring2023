const amqp = require('amqplib');


async function sendMessage() {
  try {
    // setup
    const connection = await amqp.connect('amqp://localhost:3000');
    const channel = await connection.createChannel();
    const queue = "orders";
    await channel.assertQueue(queue, { durable: false });
    console.log("Server A connected to Rabbit");
    // send message
    channel.sendToQueue(queue, Buffer.from("This is a message from Server A."));
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