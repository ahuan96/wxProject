var express = require('express');
var router = express.Router();
let user = require('../controllers/userController')


/* GET home page. */
// router.get('/', user.getUsers );
// router.get('/getUsers', user.getUsers );
// router.get('/selUser', user.selUser );

// 用户登录
router.post('/login', (req, res) => {
    let info = {
        code: req.body.code
    };
    user.login(info).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

// 用户注册
router.post('/register', (req, res) => {
    let info = req.body
    user.register(info).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

// 用户信息查询
router.post('/info', (req, res) => {
    let info = {
        username: req.body.username
    };
    user.info(info).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

// router.post('/sign', user.sign );
// router.get('/updateUser', user.updateUser );

module.exports = router;
