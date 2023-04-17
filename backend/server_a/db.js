// this file exports functions that can be used to access postgres database
// NOT WORKING YET.

const { Pool, Client } = require("pg");

const pool = new Pool({
    user: "unknown",
    password: "h8737f5242fsdocf32mof",
    host: "db",
    database: "MAKEMESANDWICH_DB",
    port: 5432,
});

/**
 * Creates tables that are used in application. Should be called on app startup
 * @returns true if succesful, false otherwise
 */
async function createTables() {
    // table for order objects. SERIAL makes automatically incrementing number
    const ordersTableQuery = "CREATE TABLE IF NOT EXISTS orders " +
        "(id SERIAL PRIMARY KEY, sandwichId INTEGER, status VARCHAR(20) "+
        "CHECK (status IN ('ordered', 'received', 'inQueue', 'ready', 'failed')))";
    const isSuccess = await execute(ordersTableQuery);
    return isSuccess;
};

/**
 * Adds order to Postgres database
 * @param {Object} order containing id, sandwich id, status 
 * @returns true if succesful, false otherwise(e.g. id already exists)
 */
async function addOrder(order) {
    if (order.hasOwnProperty("sandwichId") && order.hasOwnProperty("status")) {
        const insertOrderQuery = "INSERT INTO orders (sandwichId, status) VALUES ($1, $2)";
        const values = [order.sandwichId, order.status];
        const isSuccess = await execute(insertOrderQuery, values);
        return isSuccess;
    }
    return false;
};

// returns true if succesful, false otherwise
// connection pool used for better performance.
async function execute(query, values=false) {
    let client;
    try {
        client = await pool.connect();
        if (values) {
            await client.query(query, values);
        } else {
            await client.query(query);
        }
        client.release();
        return true;
    } catch (error) {
        console.error(error.stack);
        if (client) {
            client.release();
        }
        return false;
    }
};

module.exports = {
    addOrder,
    createTables,
};
