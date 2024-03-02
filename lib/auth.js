var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');
var db = require('./db');
var shortid = require('shortid');
var flashDurationSeconds = 100;
const argon2 = require('argon2');

exports.login = function (req, res) {
    /*
    req.session.key = '123'; // 'key' 라는 key에 '123' value 삽입.
    req.session.uid = 'ABCD';// 'uid' 라는 key에 'ABCD' value 삽입.
    if(req.session.uid) {
        res.redirect('/');
    } else {
        // 없으면 홈으로 이동
        res.render('/author');
    }
    */
    var fmsg = req.session;
    //console.log('res.session:', fmsg);
    var feedback = '';
    if (fmsg.messages) {
        feedback = fmsg.messages[0];
        delete req.session.messages;
    }
    /*
    var feedback = '';
    console.log('req: ', req.session)
    if (req.session.messages) {
        feedback = req.session.messages[0];
    }*/
    //console.log('req2: ', feedback)
    //console.log(fmsg)
    var title = 'WEB - Login';
    //var description = 'Hello, Node.js';
    //var list = template.list(req.topics);
    var list = '';
    var html = template.HTML(sanitizeHtml(title), list,
        `<h2>${sanitizeHtml(title)}</h2>
        <div>${sanitizeHtml(feedback)}</div>
      <!--<form action="/auth/login_process" method="POST">-->
      <!--<p><input type="text" name="email" placeholder="email"></p>-->
      <!--<p><input type="password" name="password" placeholder="password"></p>-->
      <!--<p><input type="submit"></p>-->
      <!--</form>-->
      <a class="button google" href="/auth/google">Sign in with Google</a>
      <!--<a class="button facebook" href="/auth/facebook">Sign in with Facebook</a>-->
      `,
        '',
    );
    res.send(html);
}

// req.session.destroy(function (err) {
//     if (err) { throw err; }
//     else {

//     }
// }
// )

/*
exports.login_process = function (req, res) {
    passport.authenticate('local', {
        successFlash: true,
        failureFlash: true,
        successRedirect: '/',
        failureRedirect: '/auth/login',
    })
}'*/
/*
exports.login_process = function (req, res) {
    var post = req.body;
    var email = post.email;
    var password = post.password;
    if (email === authData.email && password === authData.password) {
        req.session.is_logined = true;
        req.session.nickname = authData.nickname;

        //세션 객체의 데이트가 session store에 바로 저장후-> 리다이렉션 실행
        req.session.save(function(){
            res.redirect('/');
        });
    }
    else {
        res.send('who?')
    }
}
*/
exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.session.destroy(function (err) {
            res.redirect('/')
        })
    });

}
/*
exports.logout_process = function (req, res) {
    
    /*
    세션
    req.session.destroy(function(err){
        res.redirect('/')
    })
    */
/*
쿠키:
res.writeHead(302, {
    'Set-Cookie': [
        `email=; Max-Age=0; Path=/`,
        `password=; Max-Age=0; Path=/`,
        `nickname=; Max-Age=0; Path=/`,

    ],
    Location: `/`
});
res.end();
*/
/*}*/
/*
exports.register = function (req, res) {
    //console.log(fmsg)
    var feedback = '';
    var feedback_email = '';
    var feedback_password = '';
    var feedback_password2 = '';
    var feedback_userName = '';
    if (req.session.Json) {
        var fmsg = req.session.Json;
        if (fmsg.error_register_email) {
            feedback_email = fmsg.error_register_email;
        };
        if (fmsg.error_register_password) {
            feedback_password = fmsg.error_register_password;
        };
        if (fmsg.error_register_password2) {
            feedback_password2 = fmsg.error_register_password2;
        };
        if (fmsg.error_register_userName) {
            feedback_userName = fmsg.error_register_userName;
        };
        if (fmsg.error_register_password_not_same) {
            feedback_password2 = fmsg.error_register_password_not_same;
        };
        if (fmsg.error_register_duplicated_email) {
            feedback_email = fmsg.error_register_duplicated_email;
        };
        delete req.session.Json;
    }
    var title = 'WEB - Sign up';
    //var description = 'Hello, Node.js';
    //var list = template.list(req.topics);
    var list = '';
    var html = template.HTML(sanitizeHtml(title), list,
        `<h2>${sanitizeHtml(title)}</h2>
        <div>${feedback}</div>
      <form action="/auth/register_process" method="POST">
        <div>${feedback_email}<div>
        <p><input type="text" name="email" placeholder="Email" value="egoing777@gmail.com"></p>
        <div>${feedback_password}<div>
        <p><input type="password" name="password" placeholder="Password" value="111111"></p>
        <div>${feedback_password2}<div>
        <p><input type="password" name="password2" placeholder="Password" value="111111"></p>
        <div>${feedback_userName}<div>
        <p><input type="text" name="userName" placeholder="Username" value="egoing"></p>
        <p><input type="submit" value="register"></p>
      </form>
      `,
        '',
    );
    req.session.save(() => {
        res.send(html);
    })

}
exports.register_process = async function (req, res, next) {
    try {
        var post = req.body;
        var email = post.email;
        var password = post.password;
        var password2 = post.password2;
        var userName = post.userName;
        var userNameCode = post.userNameCode;
        var returnJson = {}

        //빈칸 여부 체크
        if (email === '' || password === '' || password2 === '' || userName === '') {
            if (email === '') {
                returnJson.error_register_email = 'Email is not valid';
            }
            if (password === '') {
                returnJson.error_register_password = 'Password is not valid';
            }
            if (password2 === '') {
                returnJson.error_register_password2 = 'Password is not valid';
            }
            if (userName === '') {
                returnJson.error_register_userName = 'Username is not valid';
            }
            //console.log('11')
            //setTimeout(()=>{
            //}, flashDurationSeconds);
            req.session.Json = returnJson;
            //console.log('11: ', req.flash())
            req.session.save(() => {
                res.redirect(`/auth/register`);
            })
        }
        // password 동일 체크
        else if (password != password2) {
            returnJson.error_register_password_not_same = 'Password must be same';
            req.session.Json = returnJson;
            req.session.save(() => {
                res.redirect(`/auth/register`);
            })
        }
        //가입 여부 email로 체크
        else {
            await new Promise((resolve, reject) => {
                db.query(`SELECT * FROM users WHERE email = (?)`, [email], (error, user) => {
                    if (error) {
                        reject(error);
                    }
                    if (user.length === 0) {
                        resolve();
                    }
                    else {
                        returnJson.error_register_duplicated_email = 'Email already being used. Try other email or Google login';
                        req.session.Json = returnJson;
                        req.session.save(() => {
                            res.redirect(`/auth/register`);
                        })
                    }
                })
            });
            const hash = await argon2.hash(password, {
                hashLength: 50,
            });
            const user = {
                id: shortid.generate(),
                email: email,
                password: hash,
                userName: userName,
                userNameCode: Math.random().toString(36).substring(2, 12)
            }
            await new Promise((resolve, reject) => {
                db.query(`INSERT INTO Users (id, email, password, userName, registered_date, userNameCode) 
            VALUES(?, ?, ?, ?, NOW(),?)`,
                    [user.id, user.email, user.password, user.userName, user.userNameCode],
                    function (error, result) {
                        if (error) {
                            reject(error);
                        }
                        delete req.session.Json;
                        req.session.save(() => {
                            req.login(user, function (err) {
                                if (err) { throw err; }
                                return res.redirect('/')
                            })
                        })
                    }
                );
            })
        }
    }
    catch (error) {
        next(error);
    }
}*/



exports.isOwner = function (req, res) {
    if (req.user) {
        return true;
    }
    /*if (req.session.is_logined) {
        return true;
    }*/
    else {
        return false;
    }
}
exports.StatusUI = function (req, res) {

    var authStatusUI = `<a href="/auth/login">Sign in</a> | <!--<a href="/auth/register">Sign up</a>-->`
    if (this.isOwner(req, res)) {
        //console.log('at statusUI req.user:', req.user[0].userName);
        authStatusUI = `${sanitizeHtml(req.user[0].userName)} | <form action="/auth/logout" method="post">
                 <input type="submit" value="logout">
               </form>`;
    }
    //console.log(`authStatusUI :${authStatusUI}`);
    return authStatusUI;
}
/* 
module.exports={
    IsOwner:function (req, res){
        if(req.session.is_logined){
          return true;
        }
        else{
          return false;
        }
      },
    StatusUI:function(req, res){
        var authStatusUI=`<a href="/auth/login">login</a>`
        if(this.IsOwner(req, res)){
          authStatusUI=`${req.session.nickname} | <a href="/auth/logout_process">logout</a>`;
        }
        //console.log(`authStatusUI :${authStatusUI}`);
        return authStatusUI;
      }
}*/