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
    MongoClient.connect(url, connectOption, function(err, db) {
        db.db(dbName).collection(colName).find().sort().toArray(function(err, result) {
          result = result.slice(0,500)
          res.send(result)
          console.log(result.length)
          db.close()
        })
    })
});

// post data from esp32
app.post('/post_data', function (req, res) {
  console.log(req.body)
  var insert_data = {
    date : new Date(),
    temperature : req.body.temperature,
    humidity : req.body.humidity,
    weight : req.body.weight
  }
  MongoClient.connect(url, connectOption, function(err, db) { 
    db.db(dbName).collection(colName).insertOne(insert_data, function(err, result) {
      console.log("1 document inserted");
      res.send(result.value)
      db.close();
    });
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
