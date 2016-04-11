//set up
var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');

//configuration
mongoose.connect(configDB.url);
require('./config/passport.js')(passport);

//express app
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.set('view engine', 'ejs');
app.use(session({secret: "iamfullstackdeveloper"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
require('./app/routes.js')(app, passport);

var router = express.Router();
router.post('/login', function (req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
        if(err) return false;
        if(!user) return res.json({message:"Login failed"});
        res.json({message:"Login Successfully", user:user});
    })(req, res, next)
});
router.get('/session', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.json({message:"logged in"})
    }
    else{
        res.json({message:"session has expired"})
    }
});
router.get('/logout', function (req, res, next) {
    req.logout();
    res.json({message:"logout successfully"})
});

app.use('/api', router);
//launch
app.listen(port, function () {
    console.log('server listen on port ' + port)
});