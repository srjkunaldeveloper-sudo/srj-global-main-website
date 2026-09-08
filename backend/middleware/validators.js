const { body, param, validationResult } = require("express-validator");

const handleErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map((e) => e.msg).join(". ");
    return res.status(400).json({
      success: false,
      message: errorMsg,
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }

  next();
};

exports.validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2-100 characters"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6, max: 128 }).withMessage("Password must be 6-128 characters"),
  handleErrors,
];

exports.validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required"),
  handleErrors,
];

exports.validateCreateBlog = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 255 }).withMessage("Title must be 3-255 characters"),
  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10, max: 5000 }).withMessage("Description must be 10-5000 characters"),
  body("image")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("Image URL must be at most 500 characters"),
  body("category")
    .trim()
    .notEmpty().withMessage("Category is required")
    .isLength({ max: 100 }).withMessage("Category must be at most 100 characters"),
  body("type")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 }).withMessage("Type must be at most 100 characters"),
  body("content")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 50000 }).withMessage("Content must be at most 50000 characters"),
  body("author")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 }).withMessage("Author must be at most 100 characters"),
  handleErrors,
];

exports.validateCreateContact = [
  body("firstName")
    .trim()
    .notEmpty().withMessage("First name is required")
    .isLength({ min: 2, max: 100 }).withMessage("First name must be 2-100 characters"),
  body("lastName")
    .trim()
    .notEmpty().withMessage("Last name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Last name must be 2-100 characters"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email")
    .normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty().withMessage("Phone is required")
    .matches(/^\+?[\d\s\-()]{7,20}$/).withMessage("Must be a valid phone number"),
  body("service")
    .trim()
    .notEmpty().withMessage("Service is required")
    .isLength({ max: 200 }).withMessage("Service must be at most 200 characters"),
  body("message")
    .trim()
    .notEmpty().withMessage("Message is required")
    .isLength({ min: 10, max: 5000 }).withMessage("Message must be 10-5000 characters"),
  handleErrors,
];

exports.validateCreateService = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 255 }).withMessage("Title must be 3-255 characters"),
  body("icon")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 }).withMessage("Icon must be at most 100 characters"),
  body("image")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("Image URL must be at most 500 characters"),
  body("short_description")
    .trim()
    .notEmpty().withMessage("Short description is required")
    .isLength({ min: 10, max: 500 }).withMessage("Short description must be 10-500 characters"),
  body("full_description")
    .trim()
    .notEmpty().withMessage("Full description is required")
    .isLength({ min: 10, max: 5000 }).withMessage("Full description must be 10-5000 characters"),
  body("category_id")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 }).withMessage("Category ID must be at most 100 characters"),
  handleErrors,
];

exports.validateCreatePlan = [
  body("plan_name")
    .trim()
    .notEmpty().withMessage("Plan name is required")
    .isLength({ max: 200 }).withMessage("Plan name must be at most 200 characters"),
  body("full_name")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 2, max: 200 }).withMessage("Full name must be 2-200 characters"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email")
    .normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty().withMessage("Phone is required")
    .matches(/^\+?[\d\s\-()]{7,20}$/).withMessage("Must be a valid phone number"),
  body("company_name")
    .trim()
    .notEmpty().withMessage("Company name is required")
    .isLength({ max: 200 }).withMessage("Company name must be at most 200 characters"),
  body("project_type")
    .trim()
    .notEmpty().withMessage("Project type is required")
    .isLength({ max: 200 }).withMessage("Project type must be at most 200 characters"),
  body("budget")
    .trim()
    .notEmpty().withMessage("Budget is required")
    .isLength({ max: 100 }).withMessage("Budget must be at most 100 characters"),
  body("requirements")
    .trim()
    .notEmpty().withMessage("Requirements are required")
    .isLength({ min: 10, max: 5000 }).withMessage("Requirements must be 10-5000 characters"),
  handleErrors,
];

exports.validateChatMessage = [
  body("message")
    .trim()
    .notEmpty().withMessage("Message is required")
    .isLength({ min: 1, max: 2000 }).withMessage("Message must be 1-2000 characters"),
  handleErrors,
];

exports.validateSendMeeting = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 200 }).withMessage("Name must be 2-200 characters"),
  body("phone")
    .trim()
    .notEmpty().withMessage("Phone is required")
    .matches(/^\+?[\d\s\-()]{7,20}$/).withMessage("Must be a valid phone number"),
  body("plan")
    .trim()
    .notEmpty().withMessage("Plan is required")
    .isLength({ max: 200 }).withMessage("Plan must be at most 200 characters"),
  handleErrors,
];

exports.validateIdParam = [
  param("id")
    .notEmpty().withMessage("ID is required")
    .isInt({ min: 1 }).withMessage("ID must be a positive integer"),
  handleErrors,
];
