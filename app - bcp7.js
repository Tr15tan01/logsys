const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(upload.array()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!", saveUninitialized: true,resave: true, cookie: {maxAge: 30000}}));

//mongoose.connect('mongodb://localhost/my_db', {useNewUrlParser:true, useUnifiedTopology:true});

mongoose.connect('mongodb://localhost/my_db', {useNewUrlParser:true, useUnifiedTopology:true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('we are connected')
});

var personSchema = mongoose.Schema({
  name: String,
  passowrd: String, 
  email: String
});

var Person = mongoose.model('Person', personSchema, 'logins');

app.get('/add', (req, res) => {
  var newPerson = new Person({
    name: 'not clever',
    password: 123,
    email: 'email'
  })
Person.findOne({name: newPerson.name}, (err, user) => {
  if(user) {
    console.log('user exists')
    res.send('user exists ' + user.name)
  } else {
    newPerson.save((err, person) => {
      if(err) {
  console.log(err)
      } else {
        console.log('added')
        res.send('added ' + newPerson.name)
      }
    })
  }
})
 
})

app.get('/', (req, res) => {
  Person.findOne({name: 'mic'}, function(err, user) {
    console.log(user)
    res.json('hi - ' + user.name);
  })
  
})

app.listen(3000);