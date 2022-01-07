var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {create} = require('express-handlebars')
var session = require('express-session')
var db = require('./config/connection')
var fileUpload = require('express-fileupload')
var bodyParser = require('body-parser')



db.connect((err)=>{
  if(err)
  {
    console.log(err)
  }
  else{
    console.log("database is connected") 
  }
}) //database connection calling....

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
const hbs = create({
  layoutsDir: `${__dirname}/views/layout/`,
  extname: `hbs`,
  defaultLayout: 'layout',
  partialsDir: `${__dirname}/views/partials/`
});  
app.engine('hbs',hbs.engine)



app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true 
}));


app.use(session({ secret: 'key', cookie: { maxAge: 6000000 },
resave:true,saveUninitialized:true}))
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use(fileUpload()) 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) { 
  next(createError(404));
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
