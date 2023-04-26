const amqp = require('amqplib');

// Rabbit
const OrderQueue = "orderQueue";
const StatusQueue = "statusQueue";
const rabbitHost = 'guest:guest@rabbitmq:5672';

async function main() {
    // connect to RabbitMQ server
    const connection = await amqp.connect('amqp://'+ rabbitHost);
    const channel = await connection.createChannel();
    console.log('handler connected to rabbit');
    // declare input and output queues
    await channel.assertQueue(OrderQueue, { durable: false });
    await channel.assertQueue(StatusQueue, { durable: false });
    channel.prefetch(1);

    // Consume messages from order queue and publish to status queue
    channel.consume(OrderQueue, function (msg) {
        const message = msg.content.toString();
        console.log(`Received message: ${message}`);

        // Parses json and sends to statusQueue after 7 secs
        setTimeout(() => {
            var obj = JSON.parse(message);
            obj.status = 'ready';
            console.log('Status set to ready');
            var msgToStatusQueue = JSON.stringify(obj);
            channel.sendToQueue(StatusQueue, Buffer.from(msgToStatusQueue));
            console.log('Sent message: ' + msgToStatusQueue);
            channel.ack(msg);
        }, 7000);
    }, { noAck: false });
}

// catch ctrl + c or container closing
process.on("SIGINT", () => closeGracefully());
process.on("SIGTERM", () => closeGracefully());
// close rabbit connection and server_a gracefully
function closeGracefully() {
  rabbitChannel.close();
  rabbitConnection.close();
};

main().catch(console.error);
