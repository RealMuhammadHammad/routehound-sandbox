// database.js
const { Client } = require('pg');
const client = new Client();

async function getUserData(userInput) {
  await client.connect();
  
  // DANGER: Directly concatenating user input into a SQL query
  const query = "SELECT * FROM users WHERE username = '" + userInput + "'";
  
  const res = await client.query(query);
  await client.end();
  
  return res.rows;
}
//إن شاء اللّه we'll do it
