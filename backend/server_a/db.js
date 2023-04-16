// this file exports functions that can be used to access postgres database
// NOT WORKING YET.

const { Client } = require("pg");

const client = new Client({
    user: "unknown",
    password: "h8737f5242fsdocf32mof",
    host: 'localhost',
    database: "MAKEMESANDWICH_DB",
    port: 5432
});

/**
 * Adds order to Postgres database
 * @param {Object} order containing id, sandwich id, status 
 * @returns True if succesful, False otherwise(e.g. id already exists)
 */
function addOrder(order) {
    console.log("adding order to db. NOT IMPLEMENTED YET");

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            age INTEGER
        )
    `;  
};

// returns true if succesful, false otherwise
async function execute(query) {
    try {
        await client.connect();
        await client.query(query);
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        await client.end();
    }
};

// module.exports = {
//     addOrder,
// };
