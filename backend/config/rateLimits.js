const rateLimit = require("express-rate-limit");

const standardResponse = (message) => ({
  success: false,
  message,
});

exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: standardResponse("Too many requests. Please try again later."),
});

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: standardResponse("Too many login attempts. Please try again later."),
});

exports.registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: standardResponse("Too many registration attempts. Please try again later."),
});

exports.contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
  message: standardResponse("Too many submissions. Please try again later."),
});

exports.chatbotLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: standardResponse("Too many chat requests. Please slow down."),
});

exports.meetingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: standardResponse("Too many meeting requests. Please try again later."),
});
