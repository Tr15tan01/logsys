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
  name: {type: String, minlength: 5, maxlength: 8, unique: [true, 'must be uniqqqqqqq'], lowercase: true, trim: true},
  age: Number,
  male: Boolean
})

var Person = mongoose.model('Person', personSchema, 'ttt');


app.get('/add', (req, res) => {
  var newPerson = new Person({
    id: 4,
    name: 'ZAFIORA',
    age: 12, 
    male: false
  })

newPerson.save((error, user) => {
  if(error) {
    console.log(error.errors['name'].message)
    res.send(error.errors['name'].message)

} 
    else if(error.code == 11000) {
      console.log('ut is diplicate')
      res.send('it is duplicate')
    } else {
    res.send('added')
  }

});


})

app.get('/', (req, res) => {
  Person.findOne({name: 'mic'}, function(err, user) {
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