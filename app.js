const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const session = require('express-session');
const morgan = require('morgan');
const csrf = require('csurf');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// تنظیم EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
// میدل‌ورها
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.tailwindcss.com",
          "https://cdnjs.cloudflare.com",
          "https://unpkg.com",
          "https://tile.openstreetmap.ir",
          "https://cdn.jsdelivr.net/npm/jalaali-js@1.2.6/dist/jalaali.min.js",
          "https://code.jquery.com",
          "https://docs.opencv.org", // برای OpenCV.js
          "https://kit.fontawesome.com" // برای Font Awesome
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.tailwindcss.com",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com",
          "https://unpkg.com",
          "https://tile.openstreetmap.ir",
          "https://cdn.jsdelivr.net/npm/jalaali-js@1.2.6/dist/jalaali.min.js",
          "https://code.jquery.com",
          "https://kit.fontawesome.com" // برای Font Awesome
        ],
        fontSrc: [
          "'self'",
          "data:",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.tailwindcss.com",
          "https://unpkg.com",
          "https://tile.openstreetmap.ir",
          "https://kit.fontawesome.com" // برای Font Awesome
        ],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https:"
        ],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "same-site" }
  })
);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mydevsecret123456',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 15 * 60 * 1000 } // 15 دقیقه
  })
);

// فعال‌سازی CSRF
app.use(csrf());

// ارسال csrf token به همه viewها
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// اتصال به MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/honarestan-register', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// روت‌های ثبت‌نام
const registerRoutes = require('./src/routes/register');
app.use('/', registerRoutes);

// هندل خطای ۴۰۴
app.use((req, res) => {
  res.status(404).render('404');
});

// هندل خطاهای عمومی
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: err });
});

// استارت سرور
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});