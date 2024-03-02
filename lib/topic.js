var template = require('./template.js');
var db = require('./db');
var qs = require('querystring');
var url = require('url');
var sanitizeHtml = require('sanitize-html');
var shortid = require('shortid');
var auth = require('./auth');
/*
var cookie = require('cookie');

function authStatusUI(req, res){
  var authStatusUI=`<a href="/auth/login">login</a>`
  if(authIsOwner(req, res)){
    authStatusUI=`<a href="/auth/logout_process">logout</a>`;
  }
  return authStatusUI;
}
function authIsOwner(req, res){
  var isOwner= false;
  var cookies={}
  if(req.headers.cookie){
    cookies = cookie.parse(req.headers.cookie);
  }
  console.log(cookies)
  if (cookies.email ==='egoing777@naver.com' && cookies.password==='1111'){
    isOwner=true;
  }
  return isOwner;
}
exports.home = function (req, res) {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(req.topics);
  console.log(authStatusUI(req, res));
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:100px;">`,
    `<a href="/topic/create">create</a>`,authStatusUI(req, res)
  );
  res.send(html);
}
*/



/*
exports.home = function (req, res) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(topics);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    res.send(html);
  });
}*/
exports.page = async function (req, res, next) {
  try {
    const queryData = req.query;
    //console.log('at page req.user:', req.user);

    const topic = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM topic WHERE topic.id=(?)`, [queryData.id], function (error, topic) {
        if (error) reject(error);
        resolve(topic);
      });
    });

    const temp_user = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE users.id = (?)`, [topic[0].user_id], function (error, user) {
        if (error) reject(error);
        else if (user.length === 0) { resolve('UserNotFound'); }
        else { resolve(user[0].userName); }
      });
    });
    //console.log('at page user temp_user2:', user);


    const create_time = `<p>created date: ${topic[0].created}</p>`;
    const updated_time = topic[0].last_updated ? `<p>updated date: ${topic[0].last_updated}</p>` : '';
    const title = topic[0].title;
    const description = topic[0].description;
    const list = template.list(req.topics);
    const html = template.HTML(title, list,
      `<h2>${sanitizeHtml(title)}</h2>${sanitizeHtml(description)}
       <p>by ${sanitizeHtml(temp_user)}</p>
       ${create_time}
       ${updated_time}`,
      ` <a href="/topic/create">create</a>
           <a href="/topic/update?id=${queryData.id}">update</a>
           <form action="/topic/delete_process" method="post">
             <input type="hidden" name="id" value="${queryData.id}">
             <input type="hidden" name="user_id" value="${topic[0].user_id}">
             <input type="submit" value="delete">
           </form>`, auth.StatusUI(req, res)
    );
    //console.log('at page user temp_user2:', temp_user);
    res.send(html);
  } catch (error) {
    next(error);
  }
}
// exports.page = function (req, res, next) {
//   var queryData = req.query;
//   console.log('at page req.user:', req.user);
//   // db.escape를 사용하는 방법 db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=${db.escape(queryData.id])}, function(error2, topic)
//   //db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function (error2, topic) {
//   db.query(`SELECT * FROM topic WHERE topic.id=(?)`, [queryData.id], function (error2, topic) {
//     var create_time = `<p>created date: ${topic[0].created}</p>`;
//     var updated_time = '';
//     if (topic[0].last_updated) {
//       var updated_time = `<p>updated date: ${topic[0].last_updated}</p>`;
//     }
//     //console.log('time : ',time)
//     if (error2) {
//       next(error2);
//     }
//     else {
//       db.query(`SELECT * FROM users WHERE users.id = (?)`, [topic[0].user_id], function (err3, user) {
//         console.log('at page user:', user);
//         if (err3) {
//           next(err3);
//         }
//         else if (user.length === 0) {
//           var temp_user = 'UserNotFound';
//           console.log('at page user temp_user1:', user);
//         }
//         else { var temp_user = user[0].userName; 
//           console.log('at page user temp_user2:', user);}

//         var title = topic[0].title;
//         var description = topic[0].description;
//         var list = template.list(req.topics);
//         var html = template.HTML(title, list,
//           `<h2>${sanitizeHtml(title)}</h2>${sanitizeHtml(description)}
//            <p>by ${sanitizeHtml(temp_user)}</p>
//            ${create_time}
//            ${updated_time}`,
//           ` <a href="/topic/create">create</a>
//                <a href="/topic/update?id=${queryData.id}">update</a>
//                <form action="/topic/delete_process" method="post">
//                  <input type="hidden" name="id" value="${queryData.id}">
//                  <input type="hidden" name="user_id" value="${topic[0].user_id}">
//                  <input type="submit" value="delete">
//                </form>`, auth.StatusUI(req, res)
//         );
//         res.send(html);

//       });
//     }
//   });
// }

exports.create = function (req, res) {
  //console.log('req.topic at crfate: ', req.topic)
  if (auth.isOwner(req, res) === false) {
    res.redirect('/');
    return false;//이후 문장 실행 X
  }
  //db.query(`SELECT * FROM author`, function (error2, authors) {
  var title = 'Create';
  var list = template.list(req.topics);
  var html = template.HTML(sanitizeHtml(title), list,
    `
            <form action="/topic/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
                <input type="submit">
              </p>
            </form>
            `,
    `<a href="/topic/create">create</a>`, auth.StatusUI(req, res)
  );
  res.send(html);
  //});
}

exports.create_process = async function (req, res, next) {
  try {
    if (auth.isOwner(req, res) === false) {
      res.redirect('/');
      return false;//이후 문장 실행 X
    }
    var post = req.body;
    var topic_id = shortid.generate();
    await new Promise((resolve, reject) => {
      db.query(`
            INSERT INTO topic (id, title, description, created, user_id) 
              VALUES(?, ?, ?, NOW(), ?)`,
        [topic_id, post.title, post.description, req.user[0].id],
        function (error, result) {
          if (error) {reject(error); return false};
          resolve()
        })
    })
    res.redirect(`/topic/?id=${topic_id}`);
  }
  catch (error) {
    next(error);
  }
}
/*
  var body = '';
    req.on('data', function(data){
        body = body + data;
    });
    req.on('end', function(){
        var post = qs.parse(body);
        db.query(`
          INSERT INTO topic (title, description, created, author_id) 
            VALUES(?, ?, NOW(), ?)`,
          [post.title, post.description, post.author], 
          function(error, result){
            if(error){
              throw error;
            }
            res.redirect(`/page/?id=${result.insertId}`);
          }
        )
    });*/

exports.update = async function (req, res, next) {
  try {
    if (auth.isOwner(req, res) === false) {
      res.redirect('/');
      return false;//이후 문장 실행 X
    }
    var queryData = req.query;
    //var _url = req.url;
    //var queryData = url.parse(_url, true).query;
    const topic = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error, topic) {
        if (error) reject(error);
        else if (topic[0].user_id != req.user[0].id) {
          res.redirect('/');
          return false;//이후 문장 실행 X
        }
        else resolve(topic);
      })
    });
    let list = template.list(req.topics);
    let html = template.HTML(sanitizeHtml(topic[0].title), list,
      `
          <form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
            <p>
              <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
      `<a href="/topic/create">create</a> <a href="/topic/update?id=${topic[0].id}">update</a>`, auth.StatusUI(req, res)
    );
    res.send(html);
  } catch (error) {
    next(error);
  }
}

exports.update_process = async function (req, res, next) {
  try {
    if (auth.isOwner(req, res) === false) {
      res.redirect('/');
      return false;//이후 문장 실행 X
    }
    var post = req.body;
    const topic=await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM topic WHERE topic.id = (?)`, [post.id], function (error, topic) {
        if (error) {
          reject(error);
        }
        if (topic[0].user_id != req.user[0].id) {res.redirect('/'); return false}
        resolve(topic);
      })
    });

    await new Promise((resolve, reject) => {
      db.query('UPDATE topic SET title=?, description=?, last_updated=NOW() WHERE id=?', [post.title, post.description, topic[0].id], function (error, result) {
        if (error) {
          reject(error);
        }
        res.redirect(`/topic/?id=${post.id}`);
      })
    })
  } catch (error) {
    next(error);
  }
}
/*
var body = '';
req.on('data', function (data) {
  body = body + data;
});
req.on('end', function () {
  var post = qs.parse(body);
  db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.description, post.author, post.id], function (error, result) {
    res.redirect(`/page/?id=${post.id}`);
  })
});
*/
exports.delete_process = function (req, res,next) {
  var post = req.body;
  if (auth.isOwner(req, res) === false) {
    res.redirect('/');
    return false;//이후 문장 실행 X
  }
  else if (post.user_id === req.user[0].id) {
    db.query('DELETE FROM topic WHERE id = ?', [post.id], function (error, result) {
      if (error) {
        next(error);
      }
      res.redirect(`/`);
    });
  }
  else {
    res.redirect('/');
    return false;//이후 문장 실행 X
  }
  /*
  var body = '';
  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', function () {
    var post = qs.parse(body);
    db.query('DELETE FROM topic WHERE id = ?', [post.id], function (error, result) {
      if (error) {
        throw error;
      }
      res.redirect(`/`);
    });
  });
  */
}


// <p>
// ${template.authorSelect(authors, topic[0].author_id)}
// </p>