const validateNote = (req, res, next) => {
  const { title, content } = req.body;

  // Check if request body exists
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Request body is required'
    });
  }

  // Validate title
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Title is required and must be a non-empty string'
    });
  }

  // Validate content
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Content is required and must be a non-empty string'
    });
  }

  // Validate title length
  if (title.trim().length > 200) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Title must be 200 characters or less'
    });
  }

  // Validate content length
  if (content.trim().length > 5000) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Content must be 5000 characters or less'
    });
  }

  next();
};

module.exports = validateNote;
