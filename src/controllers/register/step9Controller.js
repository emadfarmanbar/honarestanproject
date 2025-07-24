const Registration = require('../../models/Registration');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

// تنظیمات Multer برای آپلود فایل‌های Base64
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.jpg`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('فقط فایل‌های JPG و PNG مجاز هستند.'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // حداکثر ۵ مگابایت
}).fields([
  { name: 'studentPhotoProcessed', maxCount: 1 },
  { name: 'studentBirthCertificateProcessed', maxCount: 1 },
  { name: 'fatherBirthCertificateProcessed', maxCount: 1 },
  { name: 'motherBirthCertificateProcessed', maxCount: 1 },
  { name: 'fatherNationalCardProcessed', maxCount: 1 },
  { name: 'motherNationalCardProcessed', maxCount: 1 },
  { name: 'guidanceFormProcessed', maxCount: 1 },
  { name: 'ninthGradeReportProcessed', maxCount: 1 },
  { name: 'vaccinationCardProcessed', maxCount: 1 }
]);

// تابع تبدیل Base64 به فایل
async function saveBase64Image(base64String, outputPath) {
  const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
  await fs.writeFile(outputPath, base64Data, 'base64');
  return outputPath;
}

// GET: نمایش فرم آپلود مدارک
const getStep9 = (req, res) => {
  req.session.currentStep = 9;
  res.render('register/step9', {
    error: null,
    formData: {},
    csrfToken: req.csrfToken()
  });
};

// POST: پردازش و ذخیره مدارک
const postStep9 = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.render('register/step9', {
        error: err.message || 'خطا در آپلود فایل‌ها. لطفاً دوباره تلاش کنید.',
        formData: {},
        csrfToken: req.csrfToken()
      });
    }

    const errors = [];
    const requiredFields = [
      'studentPhotoProcessed',
      'studentBirthCertificateProcessed',
      'fatherBirthCertificateProcessed',
      'motherBirthCertificateProcessed',
      'fatherNationalCardProcessed',
      'motherNationalCardProcessed',
      'guidanceFormProcessed',
      'ninthGradeReportProcessed',
      'vaccinationCardProcessed'
    ];

    // بررسی وجود تمام فایل‌های مورد نیاز
    for (const field of requiredFields) {
      if (!req.body[field] && !req.files[field]) {
        errors.push(`آپلود ${field.replace('Processed', '')} الزامی است.`);
      }
    }

    if (errors.length > 0) {
      return res.render('register/step9', {
        error: errors.join(' '),
        formData: {},
        csrfToken: req.csrfToken()
      });
    }

    const documents = {};
    try {
      // ذخیره تصاویر Base64
      for (const field of requiredFields) {
        const base64String = req.body[field];
        if (base64String) {
          const outputPath = path.join(
            __dirname,
            '../../public/uploads',
            `${field}-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`
          );
          await saveBase64Image(base64String, outputPath);
          documents[field.replace('Processed', '')] = `/uploads/${path.basename(outputPath)}`;
        }
      }

      // ذخیره در دیتابیس
      if (req.session.registrationId) {
        await Registration.findByIdAndUpdate(
          req.session.registrationId,
          { $set: { documents } },
          { new: true }
        );
      } else {
        throw new Error('شناسه ثبت‌نام یافت نشد.');
      }

      // پاکسازی سشن
      req.session.step3 = null;
      req.session.step5 = null;
      req.session.step6 = null;
      req.session.fatherInfo = null;
      req.session.motherInfo = null;
      req.session.mobile = null;
      req.session.currentStep = 10;

      res.redirect('/register/complete');
    } catch (err) {
      console.error('خطا در ذخیره مدارک:', err);
      return res.render('register/step9', {
        error: 'خطا در ذخیره مدارک. لطفاً دوباره تلاش کنید.',
        formData: {},
        csrfToken: req.csrfToken()
      });
    }
  });
};

module.exports = {
  getStep9,
  postStep9
};