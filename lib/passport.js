var db = require('./db');
const argon2 = require('argon2');
var shortid = require('shortid');

module.exports = function (app) {


    var passport = require('passport'),
        //LocalStrategy = require('passport-local').Strategy,
        //FacebookStrategy = require('passport-facebook').Strategy,
        GoogleStrategy = require('passport-google-oauth20').Strategy;

    //passport 사용
    app.use(passport.initialize());
    //passport는 내부적으로 session 사용
    app.use(passport.session());

    //로그인에 성공했을 때, 딱 한 번 호출되어 사용자의 식별자를
    //session store에 저장 
    passport.serializeUser(function (user, cb) {
        //console.log('serializeUser', user)
        //'serializeUser': user은 이하와 같다.
        // serializeUser {
        //   email: 'egoing777@gmail.com',
        //   password: '111111',
        //   nickname: 'egoing'
        // }
        //두번째 인자로 식별자를 넘김
        //console.log('@@user[0].id',user[0].id)
        cb(null, user.id)
        // process.nextTick(function() {
        //   cb(null, { id: user.id, username: user.username });
        // });
    });
    // 저장된 데이터를 페이지가 로드 될 떄마다,
    // 조회할 떄 사용
    passport.deserializeUser(function (id, cb) {
        //console.log('deserializeUser', id)
        // process.nextTick(function() {
        //   return cb(null, user);
        // });
        db.query(`SELECT * FROM users WHERE id = (?)`, [id], (error2, user) => {
            if (error2) {
                throw error2;
            }
            else {
                cb(null, user);
            }
        }
            //var user = db.get('users').find({id:id}).value();
        );
    });
    /*
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function (//usernameField
    email, 
    //passswordField
    password, done) {
        //var user = db.get('users').find({ email: email }).value();
        if (email === "" || password === "") {
            return done(null, false, {
                message: 'Incorrect email or password. Try again or Google login'
            });
        }
        else {
            db.query(`SELECT * FROM users WHERE email = (?)`, [email], async (error2, user) => {
                if (error2) {
                    throw error2;
                }
                else if (user.length === 0) {
                    //console.log('1');
                    return done(null, false, {
                        message: 'Incorrect email or password. Try again or Google login'
                    });
                }
                else {
                    //console.log('user[0]', user[0]);
                    ////console.log('user.password', user.password);
                    //console.log('user[0].password', user[0].password);
                    if (user[0].password !== null) {

                        if (await argon2.verify(user[0].password, password)) {
                            //console.log('@user[0].id',user[0].id)
                            return done(null, user[0], {
                                message: 'login success'
                            });
                        }
                        // if (user[0].password === password) {
                        //     return done(null, user[0], {
                        //         message: 'login success'
                        //     });
                        // }
                        else {
                            return done(null, false, {
                                message: 'Incorrect email or password.  Try again or Google login'
                            });
                        }
                    }
                    else {
                        return done(null, false, {
                            message: 'Incorrect email or password.  Try again or Google login'
                        });
                    }

                }


                db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, user) {
                  if (err) { return cb(err); }
                  if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }
              
                  crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
                    if (err) { return cb(err); }
                    if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
                      return cb(null, false, { message: 'Incorrect username or password.' });
                    }
                    return cb(null, user);
                  });
                });
            });
        }
    }));
    */
    var googleCredentials = require('../config/google_oauth2.json');
    passport.use(new GoogleStrategy({
        clientID: googleCredentials.web.client_id,
        clientSecret: googleCredentials.web.client_secret,
        callbackURL: googleCredentials.web.redirect_uris[0]
    },
        function (accessToken, refreshToken, profile, cb) {
            //console.log('google strategt access :', accessToken, ' refresh :', refreshToken, 'profile:', profile);
            var email = profile.emails[0].value;
            db.query(`SELECT * FROM users WHERE email = (?)`, [email], (error2, user) => {
                if (error2) {
                    throw error2;
                }//미가입 email
                else if (user.length === 0) {
                    console.log('user :', 1)
                    const user = {
                        id: shortid.generate(),
                        email: email,
                        userName: profile.displayName,
                        userNameCode: Math.random().toString(36).substring(2, 12),
                        googleId: profile.id
                    }
                    console.log('user :', 2)
                    db.query(`INSERT INTO Users (id, email, userName, registered_date, userNameCode, googleId) 
                        VALUES(?, ?, ?, NOW(), ?, ?)`,
                        [user.id, user.email, user.userName, user.userNameCode, user.googleId],
                        function (error, result) {
                            if (error) {
                                throw error;
                            }
                            console.log('user :', 3)
                            cb(null, user);
                        })
                }//가입 but 일반 password로 로그인했던 경우
                else if (user[0].googleId === null) {
                    user[0].googleId = profile.id
                    db.query(`UPDATE Users SET googleId= (?) WHERE email = (?)`, [user[0].googleId, email], (error2, result) => {
                        if (error2) {
                            throw error2;
                        }
                        console.log('user :', 6)
                        cb(null, user[0]);
                    })
                }
                else {
                    console.log('user :', user)
                    console.log('user.id', user[0].id)
                    cb(null, user[0]);
                }
            })
            // User.findOrCreate({ googleId: profile.id }, function (err, user) {
            //      return cb(err, user);
            // });
        }
    ));
    //passport-facebook--------------------------
    /*
    var facebookCredentials = require('../config/facebook_oauth2.json');
    passport.use(new FacebookStrategy({
        clientID: facebookCredentials.web.client_id,
        clientSecret: facebookCredentials.web.client_secret,
        callbackURL: facebookCredentials.web.redirect_uris[0]
    },
        function (accessToken, refreshToken, profile, cb) {
            console.log('google strategt access :', accessToken, ' refresh :', refreshToken, 'profile:', profile);
            // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            //     return cb(err, user);
            // });
        }
    ));
    */
    //-------------------------------------------



    return passport;
}