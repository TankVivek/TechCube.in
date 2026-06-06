const { Resend } = require('resend');
require('dotenv').config();

const sendEmail = async ({ to, subject, content }) => {
    const resendKey = process.env.RESEND_API_KEY;
    
    if (resendKey) {
        try {
            const resend = new Resend(resendKey);
            const { data, error } = await resend.emails.send({
                from: process.env.RESEND_FROM || 'onboarding@resend.dev',
                to: [to],
                subject: subject,
                html: content
            });
            
            if (error) {
                throw new Error(error.message || 'Resend SDK error');
            }
            
            return {
                success: true,
                messageId: data.id,
                message: 'Email sent successfully via Resend SDK'
            };
        } catch (error) {
            console.error('Error sending email via Resend SDK:', error);
            throw {
                success: false,
                message: 'Failed to send email via Resend SDK',
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