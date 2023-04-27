# Server B

Server B has only one simple task to do that is to handle the orders. It connects to RabbitMQ and consumes a message from the orderQueue. Then it waits the 7 second handling time and then sends the "prepared" order to the statusQueue. Orders are prepared one at a time.
