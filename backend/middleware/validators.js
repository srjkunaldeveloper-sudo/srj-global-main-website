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
  body("company")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 255 }).withMessage("Company must be at most 255 characters"),
  body("service")
    .trim()
    .notEmpty().withMessage("Service is required")
    .isLength({ max: 150 }).withMessage("Service must be at most 150 characters"),
  body("budget")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 }).withMessage("Budget must be at most 100 characters"),
  body("message")
    .trim()
    .notEmpty().withMessage("Message is required")
    .isLength({ min: 10, max: 5000 }).withMessage("Message must be 10-5000 characters"),
  handleErrors,
];

exports.validateUpdateContactStatus = [
  body("status")
    .trim()
    .notEmpty().withMessage("Status is required")
    .isIn(["new", "contacted", "resolved"]).withMessage("Status must be one of: new, contacted, resolved"),
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

exports.validateCreateTestimonial = [
  body("quote")
    .trim()
    .notEmpty().withMessage("Quote/content is required")
    .isLength({ min: 5, max: 5000 }).withMessage("Quote must be 5-5000 characters"),
  body("author")
    .trim()
    .notEmpty().withMessage("Author name is required")
    .isLength({ min: 2, max: 255 }).withMessage("Author name must be 2-255 characters"),
  body("role")
    .trim()
    .notEmpty().withMessage("Role/designation is required")
    .isLength({ min: 2, max: 255 }).withMessage("Role must be 2-255 characters"),
  body("company")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 255 }).withMessage("Company name must be at most 255 characters"),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage("Rating must be an integer between 1 and 5"),
  body("is_active")
    .optional()
    .isInt({ min: 0, max: 1 }).withMessage("is_active must be 0 or 1"),
  body("sort_order")
    .optional()
    .isInt().withMessage("sort_order must be an integer"),
  handleErrors,
];

exports.validateCreatePortfolio = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 2, max: 255 }).withMessage("Title must be 2-255 characters"),
  body("category")
    .trim()
    .notEmpty().withMessage("Category is required")
    .isLength({ min: 2, max: 150 }).withMessage("Category must be 2-150 characters"),
  body("tags")
    .optional({ values: "falsy" })
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (!Array.isArray(parsed)) {
              throw new Error("Tags must be a valid list/array");
            }
          } catch (e) {
            throw new Error("Tags JSON is malformed");
          }
        }
        return true;
      }
      throw new Error("Tags must be a string or array");
    }),
  body("project_url")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("Project URL must be at most 500 characters")
    .custom((value) => {
      if (!value) return true;
      try {
        new URL(value.startsWith("http") ? value : `https://${value}`);
        return true;
      } catch (e) {
        throw new Error("Must be a valid URL");
      }
    }),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 5000 }).withMessage("Description must be at most 5000 characters"),
  body("is_active")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("is_active must be 0 or 1"),
  body("sort_order")
    .optional()
    .isInt().withMessage("sort_order must be an integer"),
  handleErrors,
];

exports.validateUpdatePortfolio = [
  body("title")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 255 }).withMessage("Title must be 2-255 characters"),
  body("category")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 150 }).withMessage("Category must be 2-150 characters"),
  body("tags")
    .optional({ values: "falsy" })
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (!Array.isArray(parsed)) {
              throw new Error("Tags must be a valid list/array");
            }
          } catch (e) {
            throw new Error("Tags JSON is malformed");
          }
        }
        return true;
      }
      throw new Error("Tags must be a string or array");
    }),
  body("project_url")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("Project URL must be at most 500 characters")
    .custom((value) => {
      if (!value || value === "REMOVE") return true;
      try {
        new URL(value.startsWith("http") ? value : `https://${value}`);
        return true;
      } catch (e) {
        throw new Error("Must be a valid URL");
      }
    }),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 5000 }).withMessage("Description must be at most 5000 characters"),
  body("is_active")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("is_active must be 0 or 1"),
  body("sort_order")
    .optional()
    .isInt().withMessage("sort_order must be an integer"),
  handleErrors,
];

exports.validateCreateFaq = [
  body("question")
    .trim()
    .notEmpty().withMessage("Question is required")
    .isLength({ min: 5, max: 2000 }).withMessage("Question must be 5-2000 characters"),
  body("answer")
    .trim()
    .notEmpty().withMessage("Answer is required")
    .isLength({ min: 5, max: 5000 }).withMessage("Answer must be 5-5000 characters"),
  body("category")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 }).withMessage("Category must be at most 100 characters"),
  body("is_active")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("is_active must be 0 or 1"),
  body("sort_order")
    .optional()
    .isInt().withMessage("sort_order must be an integer"),
  handleErrors,
];

exports.validateUpdateFaq = [
  body("question")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 5, max: 2000 }).withMessage("Question must be 5-2000 characters"),
  body("answer")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 5, max: 5000 }).withMessage("Answer must be 5-5000 characters"),
  body("category")
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage("Category must be at most 100 characters"),
  body("is_active")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("is_active must be 0 or 1"),
  body("sort_order")
    .optional()
    .isInt().withMessage("sort_order must be an integer"),
  handleErrors,
];

exports.validateCreateIndustry = [
  body("id")
    .trim()
    .notEmpty().withMessage("ID/slug is required")
    .isLength({ min: 2, max: 100 }).withMessage("ID must be 2-100 characters")
    .matches(/^[a-z0-9-]+$/).withMessage("ID must contain lowercase alphanumeric characters and hyphens only"),
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 2, max: 255 }).withMessage("Title must be 2-255 characters"),
  body("subtitle")
    .trim()
    .notEmpty().withMessage("Subtitle is required")
    .isLength({ min: 2, max: 255 }).withMessage("Subtitle must be 2-255 characters"),
  body("icon")
    .trim()
    .notEmpty().withMessage("Icon is required")
    .isLength({ max: 100 }).withMessage("Icon must be at most 100 characters"),
  body("color")
    .trim()
    .notEmpty().withMessage("Color is required")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage("Color must be a valid hex color code (e.g. #4F7DFF)"),
  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 5, max: 5000 }).withMessage("Description must be 5-5000 characters"),
  body("badge")
    .trim()
    .notEmpty().withMessage("Badge is required")
    .isLength({ max: 100 }).withMessage("Badge must be at most 100 characters"),
  body("features")
    .optional({ values: "falsy" })
    .custom((value) => {
      if (!value) return true;
      if (Array.isArray(value)) return true;
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (!Array.isArray(parsed)) {
              throw new Error("Features must be a valid list/array");
            }
          } catch (e) {
            throw new Error("Features JSON is malformed");
          }
        }
        return true;
      }
      throw new Error("Features must be a string or array");
    }),
  body("benefits")
    .optional({ values: "falsy" })
    .custom((value) => {
      if (!value) return true;
      if (Array.isArray(value)) return true;
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (!Array.isArray(parsed)) {
              throw new Error("Benefits must be a valid list/array");
            }
          } catch (e) {
            throw new Error("Benefits JSON is malformed");
          }
        }
        return true;
      }
      throw new Error("Benefits must be a string or array");
    }),
  body("is_active")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("is_active must be 0 or 1"),
  body("sort_order")
    .optional()
    .isInt().withMessage("sort_order must be an integer"),
  handleErrors,
];

exports.validateUpdateIndustry = [
  body("title")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 255 }).withMessage("Title must be 2-255 characters"),
  body("subtitle")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 255 }).withMessage("Subtitle must be 2-255 characters"),
  body("icon")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 }).withMessage("Icon must be at most 100 characters"),
  body("color")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage("Color must be a valid hex color code (e.g. #4F7DFF)"),
  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 5, max: 5000 }).withMessage("Description must be 5-5000 characters"),
  body("badge")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 }).withMessage("Badge must be at most 100 characters"),
  body("features")
    .optional({ values: "falsy" })
    .custom((value) => {
      if (!value) return true;
      if (Array.isArray(value)) return true;
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (!Array.isArray(parsed)) {
              throw new Error("Features must be a valid list/array");
            }
          } catch (e) {
            throw new Error("Features JSON is malformed");
          }
        }
        return true;
      }
      throw new Error("Features must be a string or array");
    }),
  body("benefits")
    .optional({ values: "falsy" })
    .custom((value) => {
      if (!value) return true;
      if (Array.isArray(value)) return true;
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const parsed = JSON.parse(trimmed);
            if (!Array.isArray(parsed)) {
              throw new Error("Benefits must be a valid list/array");
            }
          } catch (e) {
            throw new Error("Benefits JSON is malformed");
          }
        }
        return true;
      }
      throw new Error("Benefits must be a string or array");
    }),
  body("is_active")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("is_active must be 0 or 1"),
  body("sort_order")
    .optional()
    .isInt().withMessage("sort_order must be an integer"),
  handleErrors,
];

exports.validateCreateTeam = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 255 }).withMessage("Name must be 2-255 characters"),
  body("role")
    .trim()
    .notEmpty().withMessage("Role is required")
    .isLength({ min: 2, max: 150 }).withMessage("Role must be 2-150 characters"),
  body("role_class")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 50 }).withMessage("Role class must be at most 50 characters"),
  body("bio")
    .trim()
    .notEmpty().withMessage("Bio is required")
    .isLength({ min: 5, max: 5000 }).withMessage("Bio must be 5-5000 characters"),
  body("image")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("Image URL must be at most 500 characters"),
  body("featured")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("featured must be 0 or 1"),
  body("online")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("online must be 0 or 1"),
  body("verified")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("verified must be 0 or 1"),
  body("badge")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 }).withMessage("Badge must be at most 100 characters"),
  body("linkedin")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("LinkedIn link must be at most 500 characters"),
  body("github")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("GitHub link must be at most 500 characters"),
  body("twitter")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("Twitter link must be at most 500 characters"),
  body("email")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 255 }).withMessage("Email must be at most 255 characters"),
  body("website")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("Website link must be at most 500 characters"),
  body("is_active")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("is_active must be 0 or 1"),
  body("sort_order")
    .optional()
    .isInt().withMessage("sort_order must be an integer"),
  handleErrors,
];

exports.validateUpdateTeam = [
  body("name")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 255 }).withMessage("Name must be 2-255 characters"),
  body("role")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 150 }).withMessage("Role must be 2-150 characters"),
  body("role_class")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 50 }).withMessage("Role class must be at most 50 characters"),
  body("bio")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 5, max: 5000 }).withMessage("Bio must be 5-5000 characters"),
  body("image")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("Image URL must be at most 500 characters"),
  body("featured")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("featured must be 0 or 1"),
  body("online")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("online must be 0 or 1"),
  body("verified")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("verified must be 0 or 1"),
  body("badge")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 }).withMessage("Badge must be at most 100 characters"),
  body("linkedin")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("LinkedIn link must be at most 500 characters"),
  body("github")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("GitHub link must be at most 500 characters"),
  body("twitter")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("Twitter link must be at most 500 characters"),
  body("email")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 255 }).withMessage("Email must be at most 255 characters"),
  body("website")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 }).withMessage("Website link must be at most 500 characters"),
  body("is_active")
    .optional()
    .custom((val) => val == 0 || val == 1 || val === "true" || val === "false" || typeof val === "boolean")
    .withMessage("is_active must be 0 or 1"),
  body("sort_order")
    .optional()
    .isInt().withMessage("sort_order must be an integer"),
  handleErrors,
];

exports.validateSubscribe = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .isLength({ max: 255 }).withMessage("Email must be at most 255 characters"),
  handleErrors,
];

exports.validateUpdateSettingKey = [
  param("key")
    .trim()
    .notEmpty().withMessage("Setting key parameter is required")
    .isLength({ max: 100 }).withMessage("Setting key must be at most 100 characters")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Setting key must contain only letters, numbers, and underscores"),
  handleErrors,
];

exports.validateBulkUpdateSettings = [
  body()
    .custom((reqBody) => {
      if (!reqBody || typeof reqBody !== "object") {
        throw new Error("Request body must be a valid JSON object");
      }
      return true;
    }),
  handleErrors,
];

