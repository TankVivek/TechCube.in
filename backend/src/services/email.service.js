const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com', // Default to Gmail if not specified
    port: parseInt(process.env.SMTP_PORT) || 587, // Convert to number and default to 587
    secure: process.env.SMTP_SECURE === 'true', // Compare as string
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendEmail = async ({ to, subject, content }) => {
    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER, // Fallback to SMTP_USER if FROM not set
            to: to,
            subject: subject,
            html: content
        });

        return {
            success: true,
            messageId: info.messageId,
            message: 'Email sent successfully'
        };
    } catch (error) {
        console.error('Error sending email:', error);
        throw {
            success: false,
            message: 'Failed to send email',
            error: error.message
        };
    }
};

module.exports = {
    sendEmail
};