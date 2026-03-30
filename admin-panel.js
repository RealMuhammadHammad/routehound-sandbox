// admin-panel.js
const mysql = require('mysql');
const db = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "SUPER_SECRET_PASSWORD_123" // 1. EXPOSED SECRET
});

export default function AdminDashboard({ query }) {
  const userId = query.id;

  // 2. SQL INJECTION
  db.query("SELECT * FROM users WHERE id = " + userId, (err, result) => {
    console.log(result);
  });

  return (
    <div>
      <h1>Welcome Admin</h1>
      {/* 3. CROSS-SITE SCRIPTING (XSS) */}
      <div dangerouslySetInnerHTML={{ __html: query.message }} />
      
      {/* 4. BROKEN ACCESS CONTROL (IDOR) */}
      <a href={`/api/delete-user?id=${userId}`}>Delete My Account</a>
    </div>
  );
}
