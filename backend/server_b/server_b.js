const amqp = require('amqplib/callback_api');

// rabbitmq configs
const ORDER_QUEUE = "orderQueue";
const STATUS_QUEUE = "statusQueue";
const rabbitPORT = 5672;
let rabbitChannel;
// Nodejs server configs
const app = express();
const nodejsPORT = 8080;

async function handleOrder() {
    amqp.connect('amqp://guest:guest@rabbitmq:5672', (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
    
            // This makes sure that both of the queues have been created
            await channel.assertQueue(ORDER_QUEUE, { durable: ture });
            await channel.assertQueue(STATUS_QUEUE, { durable: true });
    
            console.log("Order handler connected");
    
            channel.consume(ORDER_QUEUE, msg => {
                console.log("Received order: ", msg.content.toString());
                msg.content.parse
                setTimeout( () => {
                    const payload = msg.content.toString();
                    const obj = JSON.parse(payload);
                    obj.status = 'Ready';
                    channel.sendToQueue()
                }, 7000)
    
            }, {
                // this means that consumer WILL NOT send confirmation to rabbit
                // about receiving the msg. probably not good to use
                noAck: false
            });
        });
    });    
}
