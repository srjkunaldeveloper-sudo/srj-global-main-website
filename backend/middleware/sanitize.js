const stripXSS = (value) => {
  if (typeof value !== "string") return value;

  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\bon\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\bon\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript\s*:/gi, "");
};

const sanitizeObject = (obj) => {
  if (typeof obj === "string") {
    return stripXSS(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (obj && typeof obj === "object") {
    const sanitized = {};

    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }

    return sanitized;
  }

  return obj;
};

exports.sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};
