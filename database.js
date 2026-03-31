const dbPassword = "SUPER_SECRET_DB_PASSWORD_999";
function getUser(userId) {
  return "SELECT * FROM users WHERE id = " + userId;
}
