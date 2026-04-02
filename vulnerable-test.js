// ROUTEHOUND BAIT:
const db = require('database');

function getUserData(userInput) {
    // This is a textbook SQL Injection vulnerability
    const query = "SELECT * FROM users WHERE username = '" + userInput + "'";
    db.execute(query);
}
// testing the gemini brain  إن شاء اللّه  will work
//we can do it إن شاء اللّه 
