// auth.js
const OPENAI_API_KEY = "sk-proj-1234567890abcdef1234567890abcdef";

function renderWelcomeMessage(userName) {
  // Danger: Direct injection of user input into HTML (XSS)
  document.getElementById("welcome").innerHTML = "<h1>Welcome back, " + userName + "!</h1>";
}
