const express = require('express');
const router = express.Router();
const { handleSendEmail } = require('../controllers/email.controller');
const { validateEmailRequest } = require('../middleware/email.validator');

// Route for sending emails
router.post('/send', validateEmailRequest, handleSendEmail);

module.exports = router; 