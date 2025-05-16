const createContactEmailTemplate = ({ name, email, message }) => {
    return {
        subject: `New Contact Form Submission from ${name}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };
};

const createAutoReplyTemplate = (name) => {
    return {
        subject: 'Thank you for contacting TechCube',
        html: `
            <h3>Thank you for reaching out!</h3>
            <p>Dear ${name},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p>Best regards,</p>
            <p>TechCube Team</p>
        `
    };
};

module.exports = {
    createContactEmailTemplate,
    createAutoReplyTemplate
}; 