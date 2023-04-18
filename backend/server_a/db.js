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
    const result = await execute(ordersTableQuery);
    return typeof result === "object";
};

/**
 * Adds order to Postgres database
 * @param {Object} order containing sandwich id, status
 * @returns {Object} created order if succesful. Otherwise empty object.
 */
async function addOrder(order) {
    if (order.hasOwnProperty("sandwichId") && order.hasOwnProperty("status")) {
        const insertOrderQuery = "INSERT INTO orders (sandwichId, status) VALUES ($1, $2) " +
          "RETURNING id";
        const values = [order.sandwichId, order.status];
        const result = await execute(insertOrderQuery, values);
        if (typeof result === "object") {
          order.id = result.rows[0].id;
          return order;
        }
    }
    return {};
};

/**
 * Gets order from DB with id
 * @param {int64} orderId 
 * @returns {Object} order if found. Otherwise empty object.
 */
async function getOrder(orderId) {
  const getOrderQuery = "SELECT * FROM orders WHERE id = $1";
  const result = await execute(getOrderQuery, [orderId]);
  if (
    typeof result === "object" &&
    Array.isArray(result.rows) &&
    result.rows.length === 1
  ) {
    return result.rows[0];
  }
  return {};
};

// returns false if not successful, result otherwise
// connection pool used for better performance.
async function execute(query, values=false) {
    let client, result;
    try {
        client = await pool.connect();   
        if (values) {
            result = await client.query(query, values);
        } else {
            result = await client.query(query);
        }
        client.release();
        return result;
    } catch (error) {
        console.error(error.stack);
        if (client) {
            client.release();
        }
        return false;
    }
};

module.exports = {
    createTables,
    addOrder,
    getOrder,
};
