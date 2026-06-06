require('dotenv').config();

const sendEmail = async ({ to, subject, content }) => {
    const resendKey = process.env.RESEND_API_KEY;
    
    if (resendKey) {
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: process.env.RESEND_FROM || 'onboarding@resend.dev',
                    to: to,
                    subject: subject,
                    html: content
                })
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Resend API error');
            }
            
            return {
                success: true,
                messageId: data.id,
                message: 'Email sent successfully via Resend API'
            };
        } catch (error) {
            console.error('Error sending email via Resend:', error);
            throw {
                success: false,
                message: 'Failed to send email via Resend API',
                error: error.message
            };
        }
    }

    // Fallback to SMTP nodemailer if Resend Key is not present
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: to,
            subject: subject,
            html: content
        });

        return {
            success: true,
            messageId: info.messageId,
            message: 'Email sent successfully via SMTP'
        };
    } catch (error) {
        console.error('Error sending email via SMTP:', error);
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