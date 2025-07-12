const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    console.log('Request body:', req.body);
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array(),
      message: errors.array().map(err => `${err.param}: ${err.msg}`).join(', ')
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('username')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('location')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Skill validation
const validateSkill = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Skill name must be between 2 and 100 characters'),
  body('description')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('type')
    .isIn(['offered', 'wanted'])
    .withMessage('Skill type must be either "offered" or "wanted"'),
  handleValidationErrors
];

// Swap request validation
const validateSwapRequest = [
  body('toUserId')
    .notEmpty()
    .withMessage('Recipient user ID is required'),
  body('offeredSkillId')
    .notEmpty()
    .withMessage('Offered skill ID is required'),
  body('requestedSkillId')
    .notEmpty()
    .withMessage('Requested skill ID is required'),
  body('message')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Message must be between 10 and 500 characters'),
  handleValidationErrors
];

// Feedback validation
const validateFeedback = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters'),
  handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('location')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('availability')
    .optional()
    .custom((value) => {
      console.log('Validating availability:', value, typeof value);
      
      // Allow array of strings or empty array
      if (Array.isArray(value)) {
        console.log('Availability is array, length:', value.length);
        // Filter out empty strings and validate each item in the array
        const filteredValue = value.filter(item => item && item.trim() !== '');
        console.log('Filtered availability array:', filteredValue);
        
        for (const item of filteredValue) {
          console.log('Validating item:', item, 'length:', item.length);
          if (typeof item !== 'string' || item.length < 5 || item.length > 200) {
            throw new Error(`Each availability item must be between 5 and 200 characters. Got: "${item}" (${item.length} chars)`);
          }
        }
        return true;
      }
      // Allow empty/null values
      if (value === '' || value === undefined || value === null) {
        console.log('Availability is empty/null, allowing');
        return true;
      }
      console.log('Availability is not array, not empty:', value);
      throw new Error('Availability must be an array of strings');
    }),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean value'),
  handleValidationErrors
];

// Admin message validation
const validateAdminMessage = [
  body('title')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('message')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('type')
    .isIn(['info', 'warning', 'alert'])
    .withMessage('Message type must be info, warning, or alert'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateSkill,
  validateSwapRequest,
  validateFeedback,
  validateProfileUpdate,
  validateAdminMessage
}; 