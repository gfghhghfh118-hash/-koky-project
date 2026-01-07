
import dotenv from 'dotenv';
dotenv.config();

function checkEnv(key: string) {
    const val = process.env[key];
    if (!val) {
        console.error(`❌ Missing ${key}`);
        return false;
    }
    console.log(`✅ Found ${key}: ${val.substring(0, 5)}...`);
    return true;
}

console.log("Verifying critical environment variables...");
const required = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "ADMIN_SETUP_SECRET",
    "AUTH_GOOGLE_ID",
    "AUTH_GOOGLE_SECRET"
];

let allGood = true;
required.forEach(k => {
    if (!checkEnv(k)) allGood = false;
});

if (allGood) {
    console.log("🚀 All systems GO! Environment is healthy.");
} else {
    console.error("⚠️ Environment issues detected!");
    process.exit(1);
}
