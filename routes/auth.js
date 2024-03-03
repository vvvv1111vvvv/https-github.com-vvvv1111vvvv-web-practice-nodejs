const express = require('express');
const router = express.Router();
var auth = require('../lib/auth');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (passport) {

    router.get('/login', (req, res) => {
        //console.log('topics:', req.topics);
        auth.login(req, res)
    });
    //passportjs-password-local-------------
    router.post('/login_process',
        passport.authenticate('local', {
            successMessage: true,
            failureMessage: true,
            successRedirect: '/',
            failureRedirect: '/auth/login'
        }));
    //------------------------------
    //passportjs-google-oauth2.0-------------------------------
    router.get('/google',
        passport.authenticate('google', {
            access_type: 'offline',
            scope: ['openid', 'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email']
        }));

    router.get('/google/callback',
        passport.authenticate('google', { failureRedirect: '/auth/login', /*failureMessage: true */ }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });
    //--------------------------------------------------
    //passportjs-passport-facebook(oauth2.0)------------------------------
    //사용자 로그인 허락 주소
    // router.get('/facebook',
    //     passport.authenticate('facebook'));
    // //auth 코드를 수신할 주소
    // router.get('/facebook/callback',
    //     passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
    //     function (req, res) {
    //         // Successful authentication, redirect home.
    //         res.redirect('/');
    //     });

    //----------------------------------------------

    router.post('/logout', function (req, res, next) {
        auth.logout(req, res, next)
    });

    router.get('/register', (req, res) => {
        auth.register(req, res)
    });
    router.post('/register_process', (req, res, next) => {
        auth.register_process(req, res, next)
    });
    /*
    router.post('/login_process',urlencodedParser, (req, res)=>{
        auth.login_process(req, res)
    })
    */
    /*
    router.get('/logout_process', (req, res)=>{
        auth.logout_process(req, res)
    })
    */
    return router;
}
//module.exports = router;