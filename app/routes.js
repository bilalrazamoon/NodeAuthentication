//routes.js

module.exports = function (app, passport) {
    //basic routes
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {user: req.user});
    });
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    //auth
    app.get('/login', function (req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));
    app.get('/login', function (req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

    //connect
    app.get('/connect/local', function (req, res) {
        res.render('connect-local.ejs', {message: req.flash('loginMessage')});
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/connect/local',
        failureFlash: true
    }));
    app.get('/connect/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));
    app.get('/connect/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

    //unlink
    app.get('/unlink/local', function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });
    app.get('/unlink/facebook', function (req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}