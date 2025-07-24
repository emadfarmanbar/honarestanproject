exports.step1 = (req, res) => {
    req.session.currentStep = 1;
    res.render('register/step1');
  };
  