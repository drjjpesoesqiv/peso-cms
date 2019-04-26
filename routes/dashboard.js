var cred = require('../cred.js');
var Result = require('../lib/result.js');

var express = require('express');
var router = express.Router();

/*
 *
 */
function checkCred(user, pass) {
  return user == cred.dashboard.user
      && pass == cred.dashboard.pass
}

/*
 *
 */
function checkAdmin(req) {
  return req.session.admin;
}

/*
 *
 */
router.get('/', (req, res) => {
  let template = ( ! checkAdmin(req, res))
    ? 'login'
    : 'dashboard';
  res.render('dashboard/' + template, require('../lib/dashboardConfig.js'));
});

router.post('/login', (req, res) => {
  if ( ! checkCred(req.body.user, req.body.pass))
    return res.send(new Result().error('Invalid Credentials').json());

  // grant admin
  req.session.admin = true;

  res.send(new Result().succeed().json());
});

router.get('/list/:page', (req, res) => {
  if ( ! checkAdmin(req, res)) { res.sendStatus(404); return; }

  req.app.locals.mongo.getTitles('pages', 100, req.params['page']).then(function(docs) {
    res.send(docs);
  }).catch(function(err) {
    res.send(new Result().error(err).json());
  });
});

/*
 *
 */
router.post('/load', (req, res) => {
  if ( ! checkAdmin(req, res)) { res.sendStatus(404); return; }

  req.app.locals.mongo.getByTitle('pages', req.body.title).then(function(doc) {
    res.send(doc);
  }).catch(function(err) {
    res.send(new Result().error(err).json());
  });
});

/*
 *
 */
router.post('/save', (req, res) => {
  if ( ! checkAdmin(req, res)) { res.sendStatus(404); return; }
  
  var data = req.body.data;
  req.app.locals.mongo.insert('pages', { 'title': data['title'] }, data).then(function() {
    res.send(new Result().succeed().json());
  }).catch(function(err) {
    res.send(new Result().error(err).json());
  });  
});

module.exports = router;
