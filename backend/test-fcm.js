const mongoose = require('mongoose');
const { sendFirebaseAlert, registerToken } = require('./src/services/notification.service');
require('dotenv').config();

async function runTest() {
    console.log('--- Starting FCM Dry Run ---');
    
    // 1. Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error('Error: MONGODB_URI missing in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.');

        // 2. Check for tokens
        const FcmToken = require('./src/models/fcmToken.model');
        const count = await FcmToken.countDocuments();
        console.log(`Current registered tokens in DB: ${count}`);

        if (count === 0) {
            console.log('\n[!] WARNING: No tokens found in DB.');
            console.log('To test, please open http://localhost:3001/support-admin and login.');
            console.log('OR you can manually add a dummy token now (it will fail to send but test the logic).');
        }

        // 3. Trigger Test Alert
        console.log('\nAttempting to send test alert...');
        await sendFirebaseAlert('Dry Run Test', 'This is a test notification from the local dry run script.');
        
        console.log('\n--- Dry Run Complete ---');
    } catch (err) {
        console.error('Dry Run Failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
