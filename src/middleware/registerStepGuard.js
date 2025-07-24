// Middleware کنترل مراحل ثبت‌نام
const stepPaths = [
  '/step1',
  '/step2',
  '/otp',
  '/step3',
  '/step4',
  '/step5',
  '/step6',
  '/step7',
  '/step8',
  '/step9'
];

function getStepIndex(path) {
  return stepPaths.findIndex((p) => path.startsWith(p));
}

module.exports = function registerStepGuard(req, res, next) {
  // اگر مسیر جزو مراحل ثبت‌نام نبود، ادامه بده
  const currentPath = req.path;
  const stepIndex = getStepIndex(currentPath);
  if (stepIndex === -1) return next();

  // مقدار مرحله فعلی کاربر
  const userStep = req.session.currentStep || 1;

  // اگر کاربر می‌خواهد به مرحله‌ای بالاتر از مرحله فعلی برود، ریدایرکت شود
  if (stepIndex > userStep) {
    return res.redirect(stepPaths[userStep - 1]);
  }

  // اگر کاربر مرحله قبلی را کامل نکرده، به همان مرحله برگردد
  if (stepIndex < userStep - 1) {
    return res.redirect(stepPaths[userStep - 1]);
  }

  // مجاز است
  next();
}; 