const express = require('express');
const app = express();
//引入cors 解决跨域问题
const cors = require('cors');
app.use(cors());

// 1 导入
let mongoose = require('mongoose');
// 2 连接
mongoose.connect('mongodb://localhost/notes');
// 3 连接完成后，调用的函数
mongoose.connection.once("open", () => {
    console.log('数据库链接成功')
})

app.use(express.static('public'));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    // app.get('/', (req, res) => {
    //         res.send('hello hahh')
    //     })

// 4 创建Schema
let Schema = mongoose.Schema;

let userSchema = new Schema({
    email: String,
    password: String
})

let usernoteSchema = new Schema({
        useremail: {
            type: String,
            required: true
        },
        content: [{
            title: {
                type: String,
                required: true
            },
            contents: {
                type: String,
                required: true
            }
        }]
    })
    // 5 创建model对象
let userModel = mongoose.model("users", userSchema);
let usernoteModel = mongoose.model("usernotes", usernoteSchema);

// 6 处理数据 添加注册的用户信息
function add(data) {
    userModel.create([
        { email: data.email, password: data.password },
    ], (err) => {
        if (!err) {
            console.log(data.email + '插入成功' + data.password);
        } else {
            throw err;
        }
    })
}
// var validate = new usernoteModel({
//     "_id": "5ff7822037fbe047d8fa6496",
//     "useremail": "5ff7822037fbe047d8fa1234",
//     "content": [{
//         "title": "Do something",
//         "contents": "false"
//     }]
// }).validateSync()
// console.log("valid = ", validate)

// 定义接口
app.post('/register', (req, res) => {
    //使用mongoose对数据库进行增删查改处理
    //先获取前端传入的数据
    console.log('走到了register接口路径');
    var data = req.body;
    res.status(200).json({
        code: 1
    })
    add(data);
})

app.post('/login', (req, res) => {
    //使用mongoose对数据库进行增删查改处理
    //先获取前端传入的数据
    //console.log('走到了login接口路径');
    var data = req.body;
    //console.log(data);
    let promise = new Promise((resolve, reject) => {
        userModel.find({ email: data.email, password: data.password }, (err, docs) => {
            if (!err) {
                console.log('登录成功');
                if (docs.length === 1) {
                    resolve(1);
                } else {
                    reject(0);
                }
            } else {
                throw err;
            }
        })
    })
    promise.then((ok) => {
        res.status(200).json({
            code: ok
        })
    }, (no) => {
        res.status(200).json({
            code: no
        })
    })
})

app.post('/noteinfo', (req, res) => {
    var data = req.body;
    console.log(data.useremail + '到了保存数据的接口');
    let note = {};
    note.title = data.title;
    note.contents = data.contents;
    let str = [];
    str.push(note);
    var i = 1;
    var flag = true;
    console.log((i++) + '次' + data.contents);
    let p1 = new Promise((resolve, reject) => {
        usernoteModel.find({ 'useremail': data.useremail }, (err, docs) => {
            if (!err) {
                //console.log(docs.length);
                if (docs.length === 0) {
                    console.log('创建一个用户信息表');
                    let usernotes = new usernoteModel({
                        useremail: data.useremail,
                        content: str
                    });
                    usernotes.save((err, docs) => {
                        console.log(docs)
                    });
                    res.status(200).json({
                        code: ok
                    });
                } else {
                    //{ content: { $elemMatch: { title: data.title } } }, { 'useremail': data.useremail }
                    let p = new Promise((resolve, reject) => {
                        usernoteModel.update({
                                "useremail": data.useremail
                            }, {
                                '$push': {
                                    'content': note
                                }
                            },
                            (err, docs) => {
                                if (!err) {
                                    //console.log(docs, docs.length);
                                    if (docs.length) {
                                        resolve(1);
                                    } else {
                                        reject(0);
                                    }
                                } else {
                                    throw err;
                                }
                            })
                    });
                    p.then((ok) => {
                        res.status(200).json({
                            code: ok
                        })
                    }, (no) => {
                        res.status(200).json({
                            code: no
                        })
                    });
                }
            } else {
                throw err;
            }
        })
    }).catch(err => { console.log(err); });

})

app.put('/ModNotes', (req, res) => {
    var data = req.body;
    let note = {};
    note.title = data.title;
    note.contents = data.contents;
    let str = [];
    str.push(note);
    console.log(data.title + '走到修改接口没有');
    usernoteModel.update({ 'useremail': data.useremail }, { $pull: { 'content': { '_id': data.id } } }, (err, docs) => {
        if (!err) {
            console.log('删除成功');
        } else {
            throw err;
        }
    })
    let pp = new Promise((resolve, reject) => {
        usernoteModel.update({
                "useremail": data.useremail
            }, {
                '$push': {
                    'content': note
                }
            },
            (err, docs) => {
                if (!err) {
                    //console.log(docs, docs.length);
                    if (docs.length) {
                        console.log('修改成功')
                        resolve(1);
                    } else {
                        reject(0);
                    }
                } else {
                    throw err;
                }
            })
    });
    pp.then((ok) => {
        res.status(200).json({
            code: ok
        })
    }, (no) => {
        res.status(200).json({
            code: no
        })
    });


})
app.get('/getNotes', (req, res) => {
    var data = req.query;
    var arr = "";
    console.log(data);
    let p2 = new Promise((resolve, reject) => {
        usernoteModel.find({ 'useremail': data.useremail }, (err, docs) => {
            if (!err) {
                arr = docs;
                console.log(docs, docs.length);

            } else {
                throw err;
            }
            res.send(arr);
        })
    });
    p2.then((ok) => {
        res.status(200).json({
            code: ok
        })
    }, (no) => {
        res.status(200).json({
            code: no
        })
    })

})

app.delete('/delNotes', (req, res) => {
    var data = req.body
        //console.log(data);
    usernoteModel.update({ 'useremail': data.useremail }, { $pull: { 'content': { '_id': data.id } } }, (err, docs) => {
        if (!err) {
            console.log('删除成功');
        } else {
            throw err;
        }
    })

});
app.listen(3000, () => {
    console.log('Node app start at port 3000，成功连接后端，走这里...');
})