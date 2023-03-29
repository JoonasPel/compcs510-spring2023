const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:3000', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        const queue = "orders";
        channel.assertQueue(queue, { durable: false });

        console.log("Waiting for messages...");
        channel.consume(queue, function(msg) {
            console.log("Received message: ", msg.content.toString());
        }, {
            // this means that consumer WILL NOT send confirmation to rabbit
            // about receiving the msg. probably not good to use
            noAck: true
        });
    });
});
