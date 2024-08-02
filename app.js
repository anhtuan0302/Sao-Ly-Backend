var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');

var accountRouter = require('./routes/account');
var employeeRouter = require('./routes/employee');

var webhookFacebookRouter = require('./routes/chatFacebook/webhook');
var chatbotFacebookRouter = require('./routes/chatFacebook/chatbot');
var tiktokRouter = require('./routes/livestream/tiktok');

// Config for dotenv
require('dotenv').config();

const AccountModel = require('./models/account/account');

var app = express();

// Config for mongoose
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
    createAdminAccount();
})
.catch(err => console.log('Failed to connect to MongoDB', err));

function createAdminAccount() {
  AccountModel.findOne({ role: 'admin' })
    .then((admin) => {
      if (!admin) {
        const adminAccount = new Account({
          phoneNumber: process.env.ADMIN_PHONENUMBER,
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          role: 'admin'
        });
        adminAccount.save()
          .then(() => console.log('Admin account created successfully.'))
          .catch(err => console.log('Error creating admin account:', err));
      } else {
        console.log('Admin account already exists.');
      }
    })
    .catch(err => console.log('Error checking for admin account:', err));
}

// Config for cors
app.use(cors());

// Config for body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/account', accountRouter);
app.use('/employee', employeeRouter);

// Router for Facebook Chatbot
app.use('/webhook', webhookFacebookRouter);
app.use('/chatbot', chatbotFacebookRouter);
app.use('/tiktok', tiktokRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
