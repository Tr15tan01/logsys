const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const accessTokenSecret = 'youraccesstokensecret';

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
    res.render('signup');
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
  //var personInfo = req.body;
  //console.log(personInfo.name);
  //res.render('find');
  
    Person.findOne ({name: req.body.name, password: req.body.password}, function(err, user, password) {
      if (!user) {
        console.log('user not found')
        res.render('message_test', {message: 'user NOT found - ' + req.body.name})
        console.log(req.body)
        console.log(password)
      }  else if(user.name == req.body.name && user.password != req.body.password) {
        console.log('pass err')
        console.log(user.password)
        res.render('message_test', {message: 'password NOT found - ' + req.body.name})
      }
      else {
        console.log('yes - ' + user.name + ' - ' + user.email + ' - ' + user.password);
        const accessToken = jwt.sign({ name: user.name}, accessTokenSecret);
        res.render('message_test', {message: 'user found - ' + user.name, secret: accessToken})
       console.log(accessToken);
       console.log(password)
       console.log(user.password)
      }
    })
});

app.listen(3000);