const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const path = require('path');
const sanitize = require('./middlewares/sanitize');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(sanitize);


// gzip compression
app.use(compression());

// enable cors
app.use(cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/api/v1/auth', authLimiter);
}
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '.uploads')));
// v1 api routes
app.use('/api/v1', routes);

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// error middlewares — order matters!
app.use(errorConverter); // first
app.use(errorHandler);   // last

module.exports = app;
//
