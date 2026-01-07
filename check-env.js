const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env file manually since we are running a standalone script
const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.log("ERROR: Could not load .env file. It might be missing.");
} else {
    console.log(".env file loaded successfully.");
}

console.log("Checking Google Auth Variables:");
const googleId = process.env.AUTH_GOOGLE_ID || "";
console.log("AUTH_GOOGLE_ID:", googleId ? "SET" : "MISSING");
if (googleId) {
    console.log("  Value (Partial):", googleId.substring(0, 30) + "...");
}
console.log("AUTH_GOOGLE_SECRET:", process.env.AUTH_GOOGLE_SECRET ? "SET" : "MISSING");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : "MISSING");
// Check for AUTH_SECRET as well since it caused previous issues
console.log("AUTH_SECRET:", process.env.AUTH_SECRET ? "SET" : "MISSING");
