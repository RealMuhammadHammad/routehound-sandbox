// api.js
const STRIPE_SECRET_KEY = "sk_live_1234567890abcdef1234567890abcdef";

function processPayment(amount) {
  console.log("Charging " + amount + " using key: " + STRIPE_SECRET_KEY);
}
