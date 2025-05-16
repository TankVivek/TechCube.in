const validateEmailRequest = (req, res, next) => {
    const { to, subject, content } = req.body;

    // Check if required fields are present
    if (!to || !subject || !content) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: to, subject, and content are required'
        });
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    // Validate subject length
    if (subject.length < 1 || subject.length > 100) {
        return res.status(400).json({
            success: false,
            message: 'Subject must be between 1 and 100 characters'
        });
    }

    // Validate content length
    if (content.length < 1 || content.length > 5000) {
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