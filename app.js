var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var index = require('./routes/index');

var app = express();


// 使用handlebars作为模板引擎
var hbs = require('hbs');
// 自定义模块装载
hbs.registerHelper({
    section: function (name, options) {
        if (!this._sections) {
            this._sections = {};
        }
        this._sections[name] = options.fn(this);
        return null;
    },
    if_eq: function(a, b, opts) {
        if(a == b) // Or === depending on your needs
            return opts.fn(this);
        else
            return opts.inverse(this);
    },
    has_role: function(user, role, opts) {
        if(user && user.roles && (user.roles.indexOf(role)>=0)) {
            return opts.fn(this);
        }
        else {
            return opts.inverse(this);
        }
    },
    format_date: function (date, opts) {
        if (date) {
            var formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
            return formattedDate;
        }
        return '';
    }
});
// init
var init = require('./init');
init.initAll();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// 设置部分渲染页面路径
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
