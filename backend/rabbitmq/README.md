# RabbitMQ

We have two queues in RabbitMQ, one for orders and one for statuses. Orders are pushed to order queue and they are consumed from server_b one by one. Meaning orders will be processed(cooked) one at a time and then pushed to status queue. 
