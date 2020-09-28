var express = require("express");
var router = express.Router();
var models = require("../models");
const Sequelize = require("sequelize");

router.get("/current", function(req, res, next) {
  let prizes = models.Prize.findAll({
    where: {
      status: "current"
    }
  }).then(function(prize) {
    if (prize && prize.length > 0) {
      let currentPrize = prize[0];

      currentPrize
        .getStudents()
        .then(function(rows) {
          models.Student.findAll({
            where: {
              PrizeId: currentPrize.id
            },
            attributes: [["DISTINCT(CarrierId)", "count"]]
          })
            .then(function(ncarriers) {
              res.render("prizes/current", {
                prize: currentPrize,
                n: rows.length,
                ncarriers: ncarriers.length
              });
            })
            .catch(function(err) {
              res.render("prizes/current", {
                prize: currentPrize,
                n: 0,
                ncarriers: 0
              });
            });
        })
        .catch(function(err) {
          res.render("prizes/current", {
            prize: currentPrize,
            n: 0,
            ncarriers: 0
          });
        });

      return;
    } else {
      res.redirect("/404");
    }
  });
});

router.get('/create', function(req, res, next) {
  res.render('prizes/create', {});  
});

router.post("/store", function(req, res, next) {
  let school = req.body.school;
  const prizeObject = models.Prize.build({
    school: school,
    status: 'current'
  })
  
  prizeObject
  .save()
  .then(anotherTask => {
    res.redirect('/prizes/current');
  })
  .catch(error => {
    res.redirect('/404');
  });  
});

router.post("/set_winner", function(req, res, next) {
  let prizeId = req.body.prizeId;
  models.Prize.findAll({
    where: {
      id: prizeId,
      status: 'current'
    }
  })
    .then(function(prizes) {
      if (prizes && prizes.length > 0) {
        let currentPrizes = prizes[0];
        models.Student.findAll({
          where: {
            PrizeId: currentPrizes.id
          }
        })
          .then(function(students) {
            if (students && students.length > 0) {
              /* 
               * Aqui se hace el sorteo
               *
              */
              let currentStudent = students[0];

              models.Student.update({
                winner: true,
              }, {
                where: {
                  id: currentStudent.id
                }
              });
              models.Prize.update({
                status: 'played'
              }, {
                where: {
                  id: currentPrizes.id
                }
              });
              /* 
               * End
               *
              */              
              res.json({
                status: true,
                object: {
                  winner: currentStudent.getFullname
                }
              });
            } else {
              res.json({
                status: false
              });
            }
          })
          .catch(function() {
            res.json({
              status: false
            });
          });
      } else {
        res.json({
          status: false
        });
      }
    })
    .catch(function(err) {
      res.json({
        status: false
      });
    });
});


router.get('/played', function(req, res, next) {
    let prizes = models.Prize.findAll({
      order: [
        ['id', 'DESC']
      ],
      where: {
      status: 'played'
    }}).then(function(prize){
      if ( prize && prize.length > 0 ) {
        let currentPrize = prize[0];
        let student = models.Student.findAll({
          where: {
            winner: 1,
            PrizeId: currentPrize.id
          }
        }).then(function(students){
          if ( students && students.length > 0 ) {
            res.render('prizes/played', { 'prize': currentPrize, 
                                 'student': students[0]});  
          } else {
            res.render('prizes/played', { 'prize': currentPrize, 
                                 'student': undefined});  
          }
        });
      } else {
        res.redirect('/404');
      }
    });
});



module.exports = router;
