const xss = require("xss");
const mongoSanitize = require("express-mongo-sanitize");

function deepSanitize(value) {
  if (typeof value === "string") {
    return xss(value); // sanitize XSS
  }
  if (Array.isArray(value)) {
    return value.map(deepSanitize);
  }
  if (value && typeof value === "object") {
    const sanitizedObj = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        sanitizedObj[key] = deepSanitize(value[key]);
      }
    }
    return sanitizedObj;
  }
  return value;
}

const sanitizeMiddleware = (req, res, next) => {
  // Sanitize req.body
  if (req.body) {
    req.body = deepSanitize(mongoSanitize.sanitize(req.body));
  }

  // Sanitize req.query (mutate instead of overwrite to avoid Express 5 error)
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      req.query[key] = deepSanitize(mongoSanitize.sanitize(req.query[key]));
    });
  }

  // Sanitize req.params
  if (req.params) {
    Object.keys(req.params).forEach((key) => {
      req.params[key] = deepSanitize(mongoSanitize.sanitize(req.params[key]));
    });
  }

  next();
};

module.exports = sanitizeMiddleware;
