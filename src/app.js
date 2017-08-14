'use strict';

//loading dependencies
var express = require('express');
var path = require('path');

//initializing express aplication
var app = express();

// Loading Config
var Config = require('./lib/config');

//body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//loger
var logger = require('morgan');
app.use(logger('dev'));

//cookies / session
var cookieParser = require('cookie-parser');
var session = require('./lib/helpers/session');

app.use(cookieParser());
app.use(session);

 //layout setup
var exphbs = require('express-handlebars'); 

//stylus setup
var staylus = require('staylus');
var nib = require('nib');

// compile Stylus on the fly
if (!config().html.css.stylusPrecompile){
  app.use(
    stylus.middleware({
        src:__dirname + '/stylus',
        dest: __dirname + '/public/css',
        compile: function(str, path){
          return stylus(str)
                  .set('filename', path)
                  .set('compress', config().html.css.compress)
                   
        }
      })
    );
}

//handlesbars setup
app.engine(config().views.engine, exphbs({
	extname: config().views.extension,
	defaultlayout: config().views.layout,
	layoutsDir: --__dirname + '/view/layout'
	partialsDir: --__dirname + '/view/partials'
}));

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', config().views.engine);
app.use(express.static(path.join(__dirname, 'public')));

// Sending config to templates
app.use(function(req, res, next) {
  res.locals.config = config();
  next();
});

// Disabling x-powered-by
app.disable('x-powered-by');

require('./router')(app);



if (!!module.exports){
	module.exports = app;
} else{
	app.listen(config().serverport);
}
