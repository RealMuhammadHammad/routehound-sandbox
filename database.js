app.post('/api/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  
  db.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});
