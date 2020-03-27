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
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected')
})

var personSchema = mongoose.Schema({
  name: {type: String, lowercase: true, trim: true},
  password: String,
  age: Number,
  sx: String,
  email: {type: String, lowercase: true, trim: true}
})

var Person = mongoose.model('Person', personSchema, 'ttt');

app.get('/signup', (req, res) => {
  res.render('signup')
})



app.post('/signup', (req, res) => {
  var newPerson = new Person({
    name: req.body.name,
    password: req.body.password,
    age: req.body.age, 
    sx: req.body.sx,
    email: req.body.email
  })


  Person.findOne({name: newPerson.name}, (err, user) => {
    if(user) {
      console.log('user exists')
      res.render('signup', {message_name: user.name + ' - user already exists'})
    } else if(newPerson.password.length < 6) {
      console.log('ps too short')
      res.render('signup', {message_pass: ' - Password is too short'})
    }  else if(newPerson.password.length > 56) {
      console.log('ps too long')
      res.render('signup', {message_pass: ' - Password is too short'})
    }   else {
      newPerson.save((err, person) => {
          console.log('added' + person.name)
          res.send('added ' + newPerson.name)
        
      })
    }
  })

})



app.get('/', (req, res) => {
  Person.findOne({name: 'burata'}, function(err, user) {
    console.log(user)
    res.json('hi - ' + user.name);
  })
  
})


app.get('/message', (req, res) => {
  Person.find(function(err, user) {
    //console.log(user)
    res.render('message', {message: user})
  }).skip(2).limit(3);
})

app.listen(3000);