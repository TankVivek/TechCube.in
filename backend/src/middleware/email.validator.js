const validateEmailRequest = (req, res, next) => {
    const { email, name, message } = req.body;

    // Check if all required fields are present
    if (!email || !name || !message) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields. Please provide to, subject, and content.'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    // Validate subject and content length
    if (name.length < 1 || name.length > 100) {
        return res.status(400).json({
            success: false,
            message: 'Subject must be between 1 and 100 characters'
        });
    }

    if (message.length < 1 || message.length > 5000) {
        return res.status(400).json({
            success: false,
            message: 'Content must be between 1 and 5000 characters'
        });
    }

    next();
};

module.exports = {
    validateEmailRequest
}; 