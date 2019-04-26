const fs = require('fs');

const cred = require('./cred.js');

const express = require('express');
const session = require('express-session');
const app = express();

app.set('view engine', 'pug')
app.set('trust proxy', 1);
app.use(session({
  secret: cred.express.sessionSecret,
  saveUninitialized: true,
  cookie: {}
}));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/editor/', require('./routes/editor.js'));

// mongo
var mongo = require('./lib/mongo.js');
mongo.connect(cred.mongo.url, cred.mongo.database);
app.locals.mongo = mongo

/*
 *
 */
function getHTMLFile(f)
{
  return fs.readFileSync(`views/${f}.html`, 'utf8');
}

/*
 *
 */
app.get('/', (req, res) => {
  mongo.getByTitle('pages', 'index').then(function(doc) {
    if (doc == null) {
      var html = getHTMLFile('index');
      res.send(html);
    } else {
      res.render('templates/page', doc);
    }
  }).catch(function(err) {
    var html = getHTMLFile('index');
    res.send(html);
  });
});

/*
 *
 */
app.get('/:page', (req, res) => {
  mongo.getByTitle('pages', req.params['page']).then(function(doc) {
    if (doc == null)
      res.sendStatus(404);
    else
      res.render('templates/page', doc);
  }).catch(function(err) {
    res.sendStatus(404);
  });
});

/*
 *
 */
app.get('/:page/:format', (req,res) => {
  if (['css','js','json'].indexOf(req.params.format) == -1)
    res.send(404);

  mongo.getByTitle('pages', req.params['page']).then(function(doc) {
    if (doc == null || typeof doc[req.params.format] == undefined)
      res.sendStatus(404);
    else {
      res.type(req.params.format);
      res.send(doc[req.params.format]);
    }
  }).catch(function(err) {
    res.sendStatus(404);
  });
});

const port = 8080;
app.listen(process.env.PORT || port, () => console.log('Listening on port ' + port));
