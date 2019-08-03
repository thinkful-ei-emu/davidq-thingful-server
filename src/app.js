require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
//routes
const thingsRouter = require('./things/things-router');
const reviewsRouter = require('./reviews/reviews-router');
const loginRouter = require('./login-router/login-router');
const registerRouter = require('./register-router/register.route');
const refreshRoute = require('./refresh.route/refresh.route');

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}));
app.use(cors());
app.use(helmet());

app.use('/api/things', thingsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/login',loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/refresh',refreshRoute);

app.use(function errorHandler(error, req, res, next) {
  let response;
  console.error(error);
  if (NODE_ENV === 'production') {
    response = { error: 'Server error' };
  } else {
    
    response = { error: error.message, object: error };
  }
  res.status(500).json(response);
})

module.exports = app;
