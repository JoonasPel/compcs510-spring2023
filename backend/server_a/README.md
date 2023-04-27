# Server A

On app startup server_a.js creates a connection/channel to RabbitMQ and calls db.js to initialize Postgres database tables(orders, users, sandwiches). Then starts to listen for requests from frontend and at the same time consumes statusQueue from RabbitMQ. Orders received from frontend are saved to DB and also sent to the orderQueue in RabbitMQ for server_b to "prepare them".

There are three different routes available for handling frontend requests that are orders, users and sandwiches. Server_a forwards the request to the correct route file, e.g. "/user/login" goes to user.js. Route files handle the request and use functions from db.js to access PostGre database when needed.

ready/prepared orders received from statusQueue(sent from server_b) are modified to DB.
