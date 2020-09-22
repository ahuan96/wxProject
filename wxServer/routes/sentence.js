var express = require('express');
var moment = require('moment');
var router = express.Router();
let user = require('../controllers/sentenceController')


/* GET home page. */
// router.get('/', user.getUsers );
// router.get('/getUsers', user.getUsers );
// router.get('/selUser', user.selUser );

// 用户登录
router.get('/list', (req, res) => {
    let info = {};
    user.list(info).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});
router.get('/getType', (req, res) => {
    let info = {};
    user.getType(info).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

// 获取已经发布的分类
router.get('/getStarType', (req, res) => {
    let data = req.query || req.body
    let info = {
        openid:data.openid
    };
    user.getStarType(info).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

// 获取已经发布的分类
router.get('/getStarList', (req, res) => {
    let data = req.query || req.body
    let info = {
        openid:data.openid,
        type_id:data.type_id
    };
    let pageObj = {
        page:data.page,
        size:data.size,
    }
    user.getStarList(info,pageObj).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

// 获取已经收藏的分类
router.get('/getTypeById', (req, res) => {
    let data = req.query || req.body
    let info = {
        openid:data.openid
    };
    user.getTypeById(info).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

router.get('/getListByType', (req, res) => {
    let data = req.query || req.body
    let pageObj = {
        page:data.page,
        size:data.size,
    }
    let info = {type_id:data.type_id};
    if(data.openid){
        info.openid = data.openid
    }
    user.getListByType(info,pageObj).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

router.get('/addSentence', (req, res) => {
    let data = req.query || req.body
    let info = {
        type_id:data.type_id,
        isgap:data.isgap,
        color_id:data.color_id,
        openid:data.openid,
        sentence:data.sentence,
        author:data.author,
        state:2     // 先设置发布状态
    };
    info.create_time = moment().format('YYYY-MM-DD hh:mm:ss')
    user.addSentence(info).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

router.get('/updateSentence', (req, res) => {
    let data = req.query || req.body
    
    // info.create_time = moment().format('YYYY-MM-DD hh:mm:ss')
    user.updateSentence(data).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

router.get('/addStar', (req, res) => {
    let data = req.query || req.body
    
    // info.create_time = moment().format('YYYY-MM-DD hh:mm:ss')
    user.addStar(data).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

router.get('/delStar', (req, res) => {
    let data = req.query || req.body
    
    user.delStar(data).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

router.get('/addZan', (req, res) => {
    let data = req.query || req.body
    
    // info.create_time = moment().format('YYYY-MM-DD hh:mm:ss')
    user.addZan(data).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

router.get('/delZan', (req, res) => {
    let data = req.query || req.body
    
    user.delZan(data).then(result => {
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
});

module.exports = router;
