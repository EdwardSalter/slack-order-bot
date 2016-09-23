var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var assests;
if  (app.get('env') !== 'development') {
  assests = require('./assets.json');
}

require('./data/database').connect().then(() => {
    let routes, users, clock;
    try {
        routes = require('./routes/index');
        users = require('./routes/users');
        clock = require('./clock');
    } catch (e) {
        console.log(e);
    }

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', routes);
    app.use('/users', users);


    app.locals.dynamicUrl = function(src, bundleName, bundleType) {
      if (app.get('env') === 'development') {
          var url = '';

            url = "http://localhost:3001"; // todo: bin/www defines the port... resuse it somehow

        url += src;
        return url;
      } else {
          return assests[bundleName][bundleType];
      }
    }

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
});

module.exports = app;
