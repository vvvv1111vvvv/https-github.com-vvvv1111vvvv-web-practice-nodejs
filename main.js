var flash = require('connect-flash');
var author = require('./lib/author');
var db = require('./lib/db');
var topic = require('./lib/topic');
const express = require('express')
const app = express()
const port = 3000;
var bodyParser = require('body-parser');
var compression = require('compression');
var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authorRouter = require('./routes/author');
var morgan = require('morgan');

// third party middleware
app.use(compression());
//redis set--------------------
//const express = require('express');
const dotenv = require('dotenv');
const redis = require('redis');

dotenv.config({ path: './env/.env' }); // env환경변수 파일 가져오기

//* Redis 연결
// redis[s]://[[username][:password]@][host][:port][/db-number]
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: false, 
});
redisClient.on('connect', () => {
  console.info('Redis connected!');
});
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});
redisClient.connect().catch(console.error)
//redisClient.connect().then(); // redis v4 연결 (비동기)
//const redisCli = redisClient.v4; // 기본 redisClient 객체는 콜백기반인데 v4버젼은 프로미스 기반이라 사용
//-----------------------------


//redis session-----------------------------
var session = require("express-session");
const RedisStore = require("connect-redis").default;
//import RedisStore from "connect-redis"

// var {createClient} =require("redis");

// // Initialize client.
// let redisClient = createClient()
// redisClient.connect().catch(console.error)
if (process.env.NODE_ENV==='production'){
  app.use(morgan('combined'));

}
else{
  app.use(morgan('dev'));

}
// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

// Initialize session storage.
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: true, // recommended: only save session when data exists
    secret: "keyboard cat",
  }),
)


//end- redis session ------------------------------

//session-----------------------------------
//var session = require('express-session')
//session- file-store를 위해 사용
//var FileStore = require('session-file-store')(session);
//var fileStoreOptions = {};
//app.use(session({
//  store: new FileStore(fileStoreOptions),
//  secret: 'keyboard cat',
//  resave: false,
//  saveUninitialized: true
//}));
// https option: secure:true
// http session cookie option : HttpOny:true
//----------------------------

//body parser: passport 위에-----------
app.use(bodyParser.urlencoded({ extended: false }));
//--------------------------------

//connect-flash-------------
// session 다음에
app.use(flash());
/*
app.get('/flash', function(req, res){
  //flash : 일회용 메시지
  //session에 일회용 메시지가 추가됨
  req.flash('info', 'Flash is back!')
  
  //res.redirect('/');
});

app.get('/flash-display', function(req, res){
  //일회용 메시지가 출력됨
  res.render('index', { messages: req.flash('info') });
});
*/
//------------------------



//passport local---------------------
// session 밑에 위치
var passport = require('./lib/passport')(app);
// Strategy - local: username, password
//-------------------

//form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const helmet = require('helmet')
app.use(helmet())
//using module with express or connect



app.use(express.static('public'))
//application level middleware (get방식의 *모든 요청에 동작)-----------------------
// app.get('*', function (req, res, next) {
//   db.query(`SELECT * FROM topic`, function (error, topics) {
//     if (error) {
//       next(error)
//     }
//     else {
//       req.topics = topics;
//     }
//     next();
//   });
// })
//--------------------------------------------------------

//application level middleware (get방식의 *모든 요청에 동작)-----------------------
//app.get(['/topic','/','/auth/*'], function (req, res, next) {
app.get(['/topic','/topic/create','/topic/update','/'], function (req, res, next) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) {
      next(error)
    }
    req.topics = topics;
    next();
  });
})
//--------------------------------------------------------

//var isOwner=authIsOwner(req, res);

//모든 요청에 대해 동작
/*app.use(function(req, res, next){
  db.query(`SELECT * FROM topic`, function (error, topics) {
    req.topics=topics;
    next();
  });
})*/

//라우터
app.use('/', indexRouter);
var authRouter = require('./routes/auth')(passport);
app.use('/auth', authRouter);
// /topic으로 시작하는 주소들에게 topicRouter라는 미들웨어를 적용
app.use('/topic', topicRouter);
// /author으로 시작하는 주소들에게 authorRouter라는 미들웨어를 적용
app.use('/author', authorRouter);

app.use((req, res) => {
  res.status(404).send('Not found')
})
app.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(500).send('Something broke!')
})
app.use((error2, req, res, next) => {
  console.error(error2.stack)
  res.status(500).send('Something broke2!')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})/*var http = require('http');
var url = require('url');
var topic = require('./lib/topic');
var author = require('./lib/author');
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        topic.home(request, response);
      } else {
        topic.page(request, response);
      }
    } else if(pathname === '/create'){
      topic.create(request, response);
    } else if(pathname === '/create_process'){
      topic.create_process(request, response);
    } else if(pathname === '/update'){
      topic.update(request, response);
    } else if(pathname === '/update_process'){
      topic.update_process(request, response);
    } else if(pathname === '/delete_process'){
      topic.delete_process(request, response);
    } else if(pathname === '/author'){
      author.home(request, response);
    } else if(pathname === '/author/create_process'){
      author.create_process(request, response);
    } else if(pathname === '/author/update'){
      author.update(request, response);
    } else if(pathname === '/author/update_process'){
      author.update_process(request, response);
    } else if(pathname === '/author/delete_process'){
      author.delete_process(request, response);
    }
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
*/