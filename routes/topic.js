const express = require('express');
const router = express.Router();
var topic = require('../lib/topic');
var bodyParser= require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// /topic
// /topic/create에서 /topic을 삭제해서 라우터의 파라미터에 담는다.
router.get('/', (req, res,next) => {
    topic.page(req, res, next)
})
router.get('/create', (req, res, next) => {
    topic.create(req, res, next)
})
router.post('/create_process', urlencodedParser, (req, res,next) => {
    topic.create_process(req, res,next)
})
router.get('/update', (req, res,next) => {
    topic.update(req, res,next)
})
router.post('/update_process', urlencodedParser, (req, res,next) => {
    topic.update_process(req, res,next)
})
router.post('/delete_process', urlencodedParser, (req, res,next) => {
    topic.delete_process(req, res,next)
})
module.exports=router;