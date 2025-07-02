const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const session = require('express-session');
const morgan = require('morgan');
const csrf = require('csurf');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// تنظیم EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// میدل‌ورها
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // در production مقدار را true و از HTTPS استفاده کنید
      maxAge: 1000 * 60 * 60, // 1 ساعت
    },
  })
);

// فعال‌سازی CSRF
app.use(csrf());

// ارسال توکن CSRF به همه viewها
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// روت‌ها
const registerRoutes = require('./src/routes/register');
app.use('/', registerRoutes);

// هندل خطاهای ۴۰۴
app.use((req, res, next) => {
  res.status(404).render('404');
});

// هندل خطاهای ۵۰۰
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: err });
});

// استارت
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});