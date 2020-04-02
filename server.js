const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://localhost:27017'

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.set('view engine','ejs')

app.post('/quotes',(req, res) => {
    db.collection('quotes').insertOne(req.body, (err, result) => 
    {
        if(err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
})

app.get('/', (req, res) => {
    db.collection('quotes').find().toArray(( err, result) => {
        if (err) return console.log(err)

        res.render('index.ejs',{quotes: result})
    })
})

app.put('/quotes', (req, res) => {
    db.collection('quotes')
    .findOneAndUpdate({name: 'Yoda'}, {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})

app.delete('/quotes', (req, res) => {
    db.collection('quotes').findOneAndDelete({name: req.body.name},
    (err, result) => {
      if (err) return res.send(500, err)
      res.send({message: 'A darth vadar quote got deleted'})
    })
})


var db
var dbName = 'star-wars-quotes'
MongoClient.connect( url, (err, client) => {
    if(err) return console.log(err)

    //Storing a refernce to the database so you can use it later
    db = client.db(dbName)
    console.log(`Connected MongoDB: ${url}`)
    console.log(`Database: ${dbName}`)
    
    app.listen(7000, function() {
        console.log('listening on 7000')
    })
})





