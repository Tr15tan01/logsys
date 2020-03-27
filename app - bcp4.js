const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(upload.array()); 
app.use(bodyParser.urlencoded({ extended: true })); 

mongoose.connect('mongodb://localhost/my_db', {useNewUrlParser:true, useUnifiedTopology:true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected');
});

var personSchema = mongoose.Schema({
    name: String,
    password: String,
    email: String
 });

var Person = mongoose.model("Person", personSchema, 'login');


app.get('/', (req, res) => {
    //res.render('signup');
     res.render('message_test');
     var passw = 'password123';
     var saltRounds = 10;
     bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
          throw err
        } else {
          bcrypt.hash(passw, salt, function(err, hash) {
            if (err) {
              throw err
            } else {
              console.log(hash)
              //$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K
            }
          })
        }
      })
});



//posting later

app.post('/signup', (req, res) => {
//res.send(req.body);
var personInfo = req.body;
var newPerson = new Person({
    name: personInfo.name,
    password: personInfo.password,
    email: personInfo.email
});
newPerson.save(function(err, Person){
    if(err)
       res.render('message', {message: "Database error", type: "error"});
    else
       res.render('message', {
          message: "New person added", type: "success", person: personInfo});
 });
});
app.get('/find', (req, res) => {
    res.render('find');
})

/*
app.post('/find', (req, res) => {
    var personInfo = req.body;
    console.log(personInfo.name);
    res.render('find');
    //console.log(Person.find({"name":"tristan"}));
    if(personInfo.name === "tristan") {
      console.log('found ' + personInfo.name);
      Person.find({name: personInfo.name}, 
      function(err, response){
      console.log(response);
});
    } else {
      console.log('not found ' + personInfo.name)
    }
   
 });

*/
app.post('/find', (req, res) => {
  var personInfo = req.body;
  //console.log(personInfo.name);
  res.render('find');
  Person.find({name: personInfo.name}, function(err, response){
     if(err) {
      return next(err);
     } else {
      console.log(response[0].name + ' ' + response[0].email);
     }
});
});


app.listen(3000);