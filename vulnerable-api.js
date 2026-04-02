const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

// Hardcoded secret (BAD)
const SECRET = "123456";

// Fake DB
let users = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "user", password: "user123", role: "user" }
];

// 1. No input validation + SQL Injection simulation
app.get("/search", (req, res) => {
  const query = req.query.q;
  const sql = `SELECT * FROM products WHERE name = '${query}'`; // vulnerable
  res.send({ query: sql });
});

// 2. Plaintext passwords + weak auth
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) return res.status(401).send("Invalid credentials");

  const token = jwt.sign(user, SECRET); // no expiry
  res.send({ token });
});

// 3. Broken access control
app.get("/admin", (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, SECRET);

  if (decoded.role !== "admin") {
    return res.send("Access granted anyway 😈"); // intentional flaw
  }

  res.send("Welcome admin");
});

// 4. IDOR (Insecure Direct Object Reference)
app.get("/user/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  res.send(user); // no auth check
});

// 5. Command Injection
const { exec } = require("child_process");
app.get("/ping", (req, res) => {
  const ip = req.query.ip;
  exec(`ping -c 1 ${ip}`, (err, stdout) => {
    res.send(stdout);
  });
});

// 6. XSS
app.get("/profile", (req, res) => {
  const name = req.query.name;
  res.send(`<h1>Hello ${name}</h1>`); // no sanitization
});

// 7. Sensitive data exposure
app.get("/debug", (req, res) => {
  res.send({
    users,
    secret: SECRET
  });
});

// 8. No rate limiting (brute force possible)

// 9. Insecure file upload simulation
app.post("/upload", (req, res) => {
  const filename = req.body.filename;
  res.send(`Saved file to /uploads/${filename}`); // path traversal risk
});

// 10. Open redirect
app.get("/redirect", (req, res) => {
  const url = req.query.url;
  res.redirect(url);
});

app.listen(3000, () => console.log("Vulnerable API running on port 3000"));
