const { sendEmail } = require('../services/email.service');
const { createContactEmailTemplate, createAutoReplyTemplate } = require('../helpers/email.helper');

const handleSendEmail = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Prepare admin notification email
        const adminEmail = createContactEmailTemplate({ name, email, message });
        const adminEmailData = {
            to: process.env.SMTP_TO || 'info@techcube.in',
            subject: adminEmail.subject,
            content: adminEmail.html
        };
        
        // Prepare auto-reply email
        const autoReplyEmail = createAutoReplyTemplate(name);
        const autoReplyData = {
            to: email,
            subject: autoReplyEmail.subject,
            content: autoReplyEmail.html
        };
        
        // Send admin notification
        try {
            await sendEmail(adminEmailData);
        } catch (err) {
            console.error('Failed to send admin email notification:', err);
        }

        // Send auto-reply to customer
        try {
            await sendEmail(autoReplyData);
        } catch (err) {
            console.error('Failed to send auto-reply to customer:', err);
        }
        
        res.status(200).json({
            success: true,
            message: 'Thank you for your message. We will get back to you soon!'
        });
    } catch (error) {
        console.error('Error in handleSendEmail:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

const healthCheck = (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Email service is running' 
    });
};

module.exports = {
    handleSendEmail,
    healthCheck
};