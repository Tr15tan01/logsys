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
  id: Number,
  name: {type: String, lowercase: true, trim: true},
  age: {type: Number, min: [6, 'too small'], max: [16, 'too large']},
  male: Boolean,
  email: {type: String, lowercase: true, trim: true, minlength:[5, 'emnail too short']}
})

var Person = mongoose.model('Person', personSchema, 'ttt');

app.get('/signup', (req, res) => {
  res.render('signup')
})



app.get('/add', (req, res) => {
  var newPerson = new Person({
    id: 6,
    name: 'buraniada',
    age: 14, 
    male: false,
    email: 'om'
  })

Person.find(function(err, user) {
  if(err) {
  console.log(err)
} else {
  console.log(user[0].id)
} 
}).sort({"id":-1}).limit(1)

  Person.findOne({name: newPerson.name}, (err, user) => {
    if(user) {
      console.log('user exists')
      res.send('user exists ' + user.name)
    } else {
      newPerson.save((err, person) => {
        if(err.errors['age']) {
    console.log(err.errors['age'].message)
        } else if(err.errors['email']) {
          console.log(err.errors['email'].message)
         }   else {
          console.log('added')
          res.send('added ' + newPerson.name)
        }
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