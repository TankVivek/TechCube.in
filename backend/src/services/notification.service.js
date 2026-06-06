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
            fs.mkdirSync(path.dirname(TOKENS_FILE), { recursive: true });
            fs.writeFileSync(TOKENS_FILE, JSON.stringify([]), 'utf8');
        }
        return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function saveTokens(tokens) {
    try {
        fs.mkdirSync(path.dirname(TOKENS_FILE), { recursive: true });
        fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens), 'utf8');
    } catch (err) {
        console.error("Failed to save FCM tokens:", err);
    }
}

// Add/register a token
function registerToken(token) {
    const tokens = getTokens();
    if (!tokens.includes(token)) {
        tokens.push(token);
        saveTokens(tokens);
    }
}

// Send FCM Push Notification
const sendFirebaseAlert = async (title, body) => {
    if (!firebaseInitialized) return;

    const tokens = getTokens();
    if (tokens.length === 0) return;

    const message = {
        notification: { title, body },
        tokens: tokens
    };

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`${response.successCount} FCM push notifications sent successfully.`);
        
        // Cleanup expired / invalid tokens
        if (response.failureCount > 0) {
            const activeTokens = [];
            response.responses.forEach((resp, idx) => {
                if (resp.success) {
                    activeTokens.push(tokens[idx]);
                } else {
                    const code = resp.error.code;
                    if (code === 'messaging/invalid-registration-token' || code === 'messaging/registration-token-not-registered') {
                        console.log(`Removing expired FCM token: ${tokens[idx]}`);
                    } else {
                        // Keep it for other errors
                        activeTokens.push(tokens[idx]);
                    }
                }
            });
            saveTokens(activeTokens);
        }
    } catch (error) {
        console.error("Error sending FCM notification:", error);
    }
};

module.exports = {
    registerToken,
    sendFirebaseAlert
};
