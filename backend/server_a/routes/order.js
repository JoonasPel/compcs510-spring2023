const config = require("../configs");

// handle "/order" requests
function handleOrderRequest(req, res, rabbitChannel, orderNumber) {
    sandwichId = req.body.sandwichId;
    // check that sandwichId is a number. TODO: also check that this exact
    // sandwichId exists in available sandwiches in some database.
    if (isNaN(sandwichId)) {
        res.status(400);
    } else {
        const msg = {
            "id": orderNumber,
            "sandwichId": sandwichId,
        };
        rabbitChannel.sendToQueue(config.ORDER_QUEUE, Buffer.from(JSON.stringify(msg)));
        msg.status = "preparing";
        res.status(200).json(msg);
    }
};

module.exports = {
    handleOrderRequest,
};