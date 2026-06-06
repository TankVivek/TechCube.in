const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TOKENS_FILE = path.join(__dirname, '../../data/fcm_tokens.json');

// Initialize Firebase Admin SDK
let firebaseInitialized = false;
try {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountVar) {
        const serviceAccount = JSON.parse(serviceAccountVar);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        firebaseInitialized = true;
        console.log("FCM: Firebase Admin SDK initialized successfully.");
    } else {
        console.log("Firebase not initialized: FIREBASE_SERVICE_ACCOUNT is missing in environment variables.");
    }
} catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
}

// Ensure tokens file exists
function getTokens() {
    try {
        if (!fs.existsSync(TOKENS_FILE)) {
            console.log(`FCM: Tokens file not found at ${TOKENS_FILE}. Creating empty list.`);
            fs.mkdirSync(path.dirname(TOKENS_FILE), { recursive: true });
            fs.writeFileSync(TOKENS_FILE, JSON.stringify([]), 'utf8');
        }
        const data = fs.readFileSync(TOKENS_FILE, 'utf8');
        const tokens = JSON.parse(data);
        console.log(`FCM: Loaded ${tokens.length} token(s) from storage.`);
        return tokens;
    } catch (err) {
        console.error("FCM: Error reading tokens file:", err.message);
        return [];
    }
}

function saveTokens(tokens) {
    try {
        console.log(`FCM: Saving ${tokens.length} token(s) to ${TOKENS_FILE}...`);
        fs.mkdirSync(path.dirname(TOKENS_FILE), { recursive: true });
        fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens), 'utf8');
        console.log("FCM: Tokens saved successfully.");
    } catch (err) {
        console.error("FCM: Failed to save FCM tokens:", err);
    }
}

// Add/register a token
function registerToken(token) {
    console.log(`FCM: Received request to register token: ${token.substring(0, 10)}...`);
    const tokens = getTokens();
    if (!tokens.includes(token)) {
        tokens.push(token);
        saveTokens(tokens);
        console.log("FCM: Token registered successfully.");
    } else {
        console.log("FCM: Token already exists in registry.");
    }
}

// Send FCM Push Notification
const sendFirebaseAlert = async (title, body) => {
    if (!firebaseInitialized) {
        console.log("FCM: Skipping alert - Firebase Admin SDK not initialized (missing service account).");
        return;
    }

    const tokens = getTokens();
    if (tokens.length === 0) {
        console.log("FCM: Skipping alert - No registered admin tokens found in fcm_tokens.json.");
        return;
    }

    console.log(`FCM: Attempting to send alert to ${tokens.length} token(s)...`);

    const message = {
        notification: { title, body },
        tokens: tokens
    };

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`FCM: ${response.successCount} sent, ${response.failureCount} failed.`);
        
        if (response.failureCount > 0) {
            const activeTokens = [];
            response.responses.forEach((resp, idx) => {
                if (resp.success) {
                    activeTokens.push(tokens[idx]);
                } else {
                    console.log(`FCM: Error sending to token ${idx}:`, resp.error.message);
                    const code = resp.error.code;
                    if (code === 'messaging/invalid-registration-token' || code === 'messaging/registration-token-not-registered') {
                        console.log(`FCM: Removing invalid/expired token: ${tokens[idx]}`);
                    } else {
                        activeTokens.push(tokens[idx]);
                    }
                }
            });
            saveTokens(activeTokens);
        }
    } catch (error) {
        console.error("FCM: Critical error in sendFirebaseAlert:", error);
    }
};

module.exports = {
    registerToken,
    sendFirebaseAlert
};
