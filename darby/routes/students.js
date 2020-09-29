var express = require('express');
var router = express.Router();
var models = require('../models');


router.get('/success', function(req, res, next) {
  res.render('students/success', {});  
});


router.get('/error', function(req, res, next) {
  res.render('students/error', {});  
});

router.post('/sign_up', function(req, res, next) {
  // console.log("><>>", req.body);
  let firstName = req.body.firstName || "-";
  let lastName = req.body.lastName || "-";
  let phone = req.body.phone;
  let level = req.body.level;
  let carrierId = parseInt(req.body.carrierId);
  let prizeId = parseInt(req.body.prizeId);

  const studentObject = models.Student.build({
    firstName: firstName.toUpperCase(),
    lastName: lastName.toUpperCase(),
    phone: phone,
    level: level,
    CarrierId: carrierId,
    PrizeId: prizeId
  })
  
  studentObject
  .save()
  .then(anotherTask => {
    res.redirect('/students/success');
  })
  .catch(error => {
    res.redirect('/students/error');
  });
});

module.exports = router;
