// this file exports functions that can be used to access postgres database

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
    const resultOrders = await execute(ordersTableQuery);
    if (!resultOrders) {return false;}

    // table for users
    const usersTableQuery = "CREATE TABLE IF NOT EXISTS users " +
      "(id SERIAL PRIMARY KEY, username VARCHAR(100), email VARCHAR(100), password VARCHAR(100), "+
        "role VARCHAR(10) CHECK (role IN ('customer', 'admin')))";
    const resultUsers = await execute(usersTableQuery);
    if (!resultUsers) {return false;}
    // admin account (yes it is unsafe this way)
    const admin = {username: "admin55", email: "admin55@email.com", password: "secret55"};
    const resultAdmin = await addUser(admin, isAdmin=true);
    if (!resultAdmin) {return false;}

    // sandwich table with two sandwiches
    const sandwichQuery = "CREATE TABLE IF NOT EXISTS sandwiches " +
      "( id SERIAL PRIMARY KEY, name TEXT UNIQUE, bread_type TEXT )";
    const toppingsQuery = "CREATE TABLE IF NOT EXISTS sandwich_toppings " +
      "( id SERIAL PRIMARY KEY, name TEXT, sandwich_id INTEGER, FOREIGN KEY (sandwich_id) " +
      "REFERENCES sandwiches(id) ON DELETE CASCADE)";
    const insertSandwichesQuery = "INSERT INTO sandwiches (name, bread_type) VALUES "+
      "('Ham_sandwich', 'oat'), ('Turkey_sandwich', 'oat')";
    const insertToppingsQuery = "INSERT INTO sandwich_toppings (name, sandwich_id) VALUES "+
      "('Cheese', 1), ('Ham', 1), ('Turkey', 2), ('Cheese', 2)";
    const queries = [sandwichQuery, toppingsQuery, insertSandwichesQuery, insertToppingsQuery];
    for (const query of queries) {
      const result = await execute(query);
      if (!result) {return false;}
    }

    // nothing went wrong if we got here
    return true;
};

async function getSandwiches() {
  const query = `
  SELECT
  s.id AS sandwich_id,
  s.name AS sandwich_name,
  s.bread_type AS bread_type,
  json_agg(json_build_object('id', t.id, 'name', t.name)) AS toppings
  FROM sandwiches s
  LEFT JOIN sandwich_toppings t ON s.id = t.sandwich_id
  GROUP BY s.id, s.name, s.bread_type;
  `;
  const result = await execute(query);
  return result.rows;
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

async function modifyOrder(orderWithNewValues) {
  if (orderWithNewValues.hasOwnProperty("id") && orderWithNewValues.hasOwnProperty("status")) {
    const id = orderWithNewValues.id;
    const newStatus = orderWithNewValues.status;
    const modifyOrderQuery = "UPDATE orders SET status = $1 WHERE id = $2";
    const values = [newStatus, id];
    const result = await execute(modifyOrderQuery, values);
    return typeof result === "object";
  }
  return false;
};

async function addUser(user, isAdmin=false) {
  const insertUserQuery = "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)";
  const role = isAdmin ? "admin" : "customer";
  const values = [user.username, user.email, user.password, role];
  const result = await execute(insertUserQuery, values);
  return typeof result === "object";
};

/**
 * Deletes user if correct credentials(username, password) given. Can't delete admin.
 * @param {*} username 
 * @param {*} password 
 * @returns true if succesfull, false otherwise.
 */
async function deleteUser(username, password) {
  const result = await checkUserCredentials({username, password});
  if (result && result !== "admin") {
    const deleteUserQuery = "DELETE FROM users WHERE username = $1 AND password = $2";
    const values = [username, password];
    const deletingResult = await execute(deleteUserQuery, values);
    return typeof deletingResult === "object";
  } else {
    return false;
  }
};

/**
 * checks if user credentials are correct
 * @param {Object} user
 * @returns user role. if credentials incorrect, returns false
 */
async function checkUserCredentials(user) {
  const logInQuery = "SELECT * FROM users WHERE username = $1 AND password = $2 LIMIT 1";
  const values = [user.username, user.password];
  const result = await execute(logInQuery, values);
  if (typeof result === "object" && result.rows.length === 1) {
    const role = result.rows[0].role;
    return role;
  } else {
    return false;
  }
};

async function createSandwich(params) {
  /* example data
    {
      name: "bmt",
      toppings: { kinkku, juusto, salaatti},
      breadType: hunajakaura,
      apiKey:
    }
  */

  // Parse data for the new bread
  const bread = params;
  const breadName = bread.name;
  const breadType = bread.breadType;
  var values = [breadName, breadType];

  // Add new bread
  const createNewBreadQuery = "INSERT INTO public.sandwiches(name, bread_type) VALUES ($1, $2)";
  var result = await execute(createNewBreadQuery, values);
  if (!result) {return false;}

  // Get id for the newly added bread
  const getBreadIdQuery = "SELECT id FROM public.sandwiches WHERE name = $1";
  values = [breadName];
  result = await execute(getBreadIdQuery, values);
  if (!result) {return false;}
  var sandwichId = -1;
  if (typeof result === "object") {
    sandwichId = result.rows[0].id;
  }

  // Create new rows for the toppings
  const createNewToppingQuery = "INSERT INTO public.sandwich_toppings(name, sandwich_id) VALUES ($1, $2);";
  for (var topping of bread.toppings) { 
    values = [topping.name, sandwichId];
    result = await execute(createNewToppingQuery, values);
    if (!result) {return false;}
  }
  return true;
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

/**
 * get all orders in database
 * @returns {Array[Object]} orders, empty array if no orders. false if error.
 */
async function getAllOrders() {
  const getOrderQuery = "SELECT * FROM orders";
  const result = await execute(getOrderQuery);
  if (typeof result === "object" && Array.isArray(result.rows)) {
    return result.rows;
  }
  return false;
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
    modifyOrder,
    getOrder,
    getAllOrders,
    getSandwiches,
    createSandwich,
    addUser,
    deleteUser,
    checkUserCredentials,
};
