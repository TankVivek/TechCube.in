const admin = require('firebase-admin');
const mongoose = require('mongoose');
const FcmToken = require('../models/fcmToken.model');
require('dotenv').config();

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

// Add/register a token
async function registerToken(token) {
    console.log(`FCM: Received request to register token: ${token.substring(0, 10)}...`);
    
    if (mongoose.connection.readyState !== 1) {
        console.warn("FCM: Skipping token registration - MongoDB is not connected (Current state: " + mongoose.connection.readyState + ")");
        return;
    }

    try {
        // Use upsert to update the timestamp if the token already exists
        // This resets the TTL expiration timer
        await FcmToken.findOneAndUpdate(
            { token },
            { createdAt: new Date() },
            { upsert: true, new: true }
        );
        console.log("FCM: Token registered/updated in MongoDB successfully.");
    } catch (err) {
        console.error("FCM: Failed to register token in MongoDB:", err.message);
    }
}

// Send FCM Push Notification
const sendFirebaseAlert = async (title, body) => {
    if (!firebaseInitialized) {
        console.log("FCM: Skipping alert - Firebase Admin SDK not initialized (missing service account).");
        return;
    }

    if (mongoose.connection.readyState !== 1) {
        console.warn("FCM: Skipping alert - MongoDB is not connected (Current state: " + mongoose.connection.readyState + ")");
        return;
    }

    try {
        const tokenDocs = await FcmToken.find({});
        const tokens = tokenDocs.map(t => t.token);

        if (tokens.length === 0) {
            console.log("FCM: Skipping alert - No registered admin tokens found in MongoDB.");
            return;
        }

        console.log(`FCM: Attempting to send alert to ${tokens.length} token(s)...`);

        const message = {
            notification: { title, body },
            tokens: tokens
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`FCM: ${response.successCount} sent, ${response.failureCount} failed.`);
        
        if (response.failureCount > 0) {
            const tokensToRemove = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    console.log(`FCM: Error sending to token ${idx}:`, resp.error.message);
                    const code = resp.error.code;
                    if (code === 'messaging/invalid-registration-token' || code === 'messaging/registration-token-not-registered') {
                        tokensToRemove.push(tokens[idx]);
                    }
                }
            });
            
            if (tokensToRemove.length > 0) {
                console.log(`FCM: Removing ${tokensToRemove.length} invalid/expired tokens from MongoDB.`);
                await FcmToken.deleteMany({ token: { $in: tokensToRemove } });
            }
        }
    } catch (error) {
        console.error("FCM: Critical error in sendFirebaseAlert:", error);
    }
};

module.exports = {
    registerToken,
    sendFirebaseAlert
};
