var template = require('./template.js');
var db = require('./db');
var qs = require('querystring');
var url = require('url');
var sanitizeHtml = require('sanitize-html');
var auth = require('./auth');
//middleware만듬
exports.home = function (req, res) {
  //console.log('/',req.user);
  //var fmsg = req.session;
  //console.log('req.topics on hone:', req.topics);
  var feedback = '';
  /*
  if (fmsg.messages) {
    feedback = fmsg.messages[0];
    delete req.session.messages;
  }
*/


  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(req.topics);
  var html = template.HTML(sanitizeHtml(title), list,
    `<h2>${sanitizeHtml(title)}</h2><div>${sanitizeHtml(feedback)}</div>${sanitizeHtml(description)}
      <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:100px;">`,
    `<a href="/topic/create">create</a>`, auth.StatusUI(req, res)
  ); //req.session.save(() => {
    res.send(html);
  //})
}