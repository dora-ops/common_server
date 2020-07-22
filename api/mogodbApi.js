var models = require('../config');
var express = require('express');
var router = express();
var multer = require('multer');
var UUID = require('uuid')
var path = require('path')

var util = require('./util')

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
var database = 'mooc'






var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public'))
    },
    filename: function (req, file, cb) {

        var str = file.originalname.split('.');
        cb(null, UUID.v1() + '.' + str[1]);
    }
})
var upload = multer({ storage: storage })


// var router = express.Router();
router.all('*', function (req, res, next) {
    const ori = req.get('Origin');
    if (!(ori != undefined && req.get('Origin').endsWith('8089'))) {

    }
    res.header("Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By",' 3.2.1')
    // res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Access-Control-Allow-Headers", "Content-Type,application/x-www-form-urlencoded");
    // res.setHeader("Access-Control-Allow-Headers", "x-requested-with,application/x-www-form-urlencoded");
    next();
});

var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

router.post('/add', (req, res) => {
    var p = req.body;


    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);

        dbo.collection(p.table).insertOne(p.data, function (err, ret) {
            if (err) throw err;
            jsonWrite(res, ret)
            db.close();

        });
    });
});

router.post('/query', (req, res) => {
    var p = req.body;


    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection(p.table).find(p.param || {}).toArray(function (err, result) { // 返回集合中所有数据
            if (err) throw err;
            // console.log(result);
            jsonWrite(res, result)
            db.close();
        });
    });
});

router.post('/update', (req, res) => {
    var p = req.body;
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection(p.table).update(p.param || {}, { $set: p.set || {} }, { multi: true }, function (err, result) { // 返回集合中所有数据
            if (err) throw err;
            // console.log(result);
            jsonWrite(res, result)
            db.close();
        });
    });
});

router.post('/remove', (req, res) => {
    var p = req.body;
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(database);
        dbo.collection(p.table).remove(p.param || {}, function (err, result) { // 返回集合中所有数据
            if (err) throw err;
            // console.log(result);
            jsonWrite(res, result)
            db.close();
        });
    });
});




module.exports = router;
