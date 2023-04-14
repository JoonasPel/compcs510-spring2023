const amqp = require('amqplib/callback_api');

amqp.connect('amqp://guest:guest@rabbitmq:5672', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        const queue = "orderQueue";
        channel.assertQueue(queue, { durable: false });

        console.log("!!!!!!! I AM SERVER B WAITING FOR MESSAGES !!!!!!!!!!!");
        channel.consume(queue, function(msg) {
            console.log("Received message in server B: ", msg.content.toString());
        }, {
            // this means that consumer WILL NOT send confirmation to rabbit
            // about receiving the msg. probably not good to use
            noAck: true
        });
    });
});
