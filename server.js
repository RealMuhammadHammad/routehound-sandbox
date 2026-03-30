const express = require('express');
const app = express();

// 1. EXPOSED SECRET
const ADMIN_KEY = "sk_live_51Mwa6SCl0V7ST6Nd0WjX"; 

app.get('/user', (req, res) => {
  const id = req.query.id;
  
  // 2. SQL INJECTION
  const query = `SELECT * FROM users WHERE id = ${id}`;
  
  // 3. CROSS-SITE SCRIPTING (XSS)
  res.send(`<h1>Welcome, ${req.query.name}</h1>`); 
});
