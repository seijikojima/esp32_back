const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const port = 7001
const app = express()
app.use(cors())
app.use(bodyParser.json());

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const dbName = "data"
const colName = "absorption"
const url = "mongodb://" + "127.0.0.1/" + dbName

// get all data
app.get('/data', function (req, res) {
    console.log("get all data")
    MongoClient.connect(url, function(err, db) {
        db.db(dbName).collection(colName).find().sort().toArray(function(err, result) {
          result = result.slice(0,500)
          res.send(result)
          console.log(result.length)
          db.close()
        })
    })
});

// 記事の内容更新. Article.vue
app.post('/data', function (req, res) {
  console.log(req.body)

  var year  = new Date().getFullYear();
  var month = new Date().getMonth();
  var day = new Date().getDate();
  var hours = new Date().getHours();
  var minutes = Math.floor( new Date().getMinutes() / 10 ) * 10; // 分の小数点切り捨て

  var query_date = new Date(year,month,day,hours,minutes)
  console.log(year,month,day,hours,minutes)

  var insert_data = Object.assign({ date : query_date }, req.body);

  // 10分間来たデータは同じデータ点として登録．
  MongoClient.connect(url, function(err, db) {
  db.db(dbName).collection(colName)
  .updateOne({ date : query_date }, { $set:  insert_data }, {returnOriginal: false,upsert: true} , function(err, result) {
    db.close();
    console.log(result)
    res.send(result)
  });
}); 
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

