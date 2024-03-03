const express = require('express');
const router = express.Router();
var index = require('../lib/index');

router.get('/', (req, res) => {
    //console.log('topics:', req.topics);
    index.home(req, res)
})
module.exports = router;