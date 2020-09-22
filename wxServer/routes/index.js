var express = require('express');
var router = express.Router();
// var user = require('../controllers/userController')


/* GET home page. */
router.get('/', (req,res) => {
    res.end('1')
} );

module.exports = router;
