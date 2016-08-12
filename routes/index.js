var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});


router.post('/', function(req, res, next) {
    var body = req.body;
    res.json({
        text: "Hi, I have received your message. Here is what you sent me: " + JSON.stringify(body)
    });
});

module.exports = router;
