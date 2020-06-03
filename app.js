const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(upload.array()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!", saveUninitialized: true,resave: true, cookie: {maxAge: 30000}}));

//mongoose.connect('mongodb://localhost/my_db', {useNewUrlParser:true, useUnifiedTopology:true});

mongoose.connect('mongodb+srv://titevar:thinkmore787@cluster0-tpkz7.mongodb.net/my_db?retryWrites=true&w=majority', {useNewUrlParser:true, useUnifiedTopology:true});
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected')
})

var personSchema = mongoose.Schema({
  name: {type: String, lowercase: true, trim: true},
  password: {type: String, trim: true},
  age: {type: Number, lowercase: true, trim: true},
  email: {type: String, lowercase: true, trim: true},
  sx: String
})

var Person = mongoose.model('Person', personSchema, 'col');

app.get('/', (req, res) => {
  res.render('signup');
        //$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K
})



app.post('/signup', (req, res) => {
  
  //encryoting password
  const saltRounds = 10
 
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      throw err
    } else {
      bcrypt.hash(newPerson.password, salt, function(err, hash) {
        if (err) {
          throw err
        } else {
         // console.log(hash)
          newPerson.password = hash;
        }
      })
    }
  })

  var newPerson = new Person({
    name: req.body.name,
    password: req.body.password,
    age: req.body.age, 
    email: req.body.email,
    sx: req.body.sx
  })


  Person.findOne({name: newPerson.name}, (err, user) => {
    if(user) {
      console.log('user exists')
      res.render('signup', {message_name: user.name + ' - user already exists'})
    } else if(newPerson.name.length < 4) {
      console.log('name too short')
      res.render('signup', {message_name: ' - Name must be more than 4 characters'})
    }  else if(newPerson.name.length > 12) {
      console.log('name too long')
      res.render('signup', {message_name: ' - Name must be less than 12 characters'})
    }    else if(newPerson.password.length < 6) {
      console.log('ps too short')
      res.render('signup', {message_pass: ' - Password is too short'})
    }  else if(newPerson.password.length > 156) {
      console.log('ps too long')
      res.render('signup', {message_pass: ' - Password is too long'})
    }   else if(newPerson.age == '') {
      console.log('age not pr')
      res.render('signup', {message_age: ' - Age is required'})
    }  else if(newPerson.email == '') {
      console.log('ps too long')
      res.render('signup', {message_email: ' - email is not provided'})
    } 
    
    else {
      newPerson.save((err, person) => {
          console.log('added' + person.name)
          res.render('find') 
      })
    }
  })

})

app.get('/find', (req, res) => {
  res.render('find');
});


//testing bcrypt on heroku
app.get('/test', (req, res) => {
 // res.render('test', {message: psst});
 

   //encryoting password
   const saltRounds = 10
 
   bcrypt.genSalt(saltRounds, function (err, salt) {
     if (err) {
       throw err
     } else {
       bcrypt.hash('password', salt, function(err, hash) {
         if (err) {
           throw err
         } else {
          // console.log(hash)
           var psst = hash;
           res.render('test', {message: psst});
           var newPerson = new Person({
            name: 'test',
            password: psst,
            age: 24, 
            email: 'test',
            sx: 'female'
          })
        
           newPerson.save((err, person) => {
            console.log('added' + person.name)
           // res.render('find') 
        })
         }
       })
     }
   })

 
})


app.post('/find', (req, res) => {
  Person.findOne ({name: req.body.name}, function(err, user, password) {
    if(user) {
      bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
        if (err) {
          throw err
        } else if (!isMatch) {
          console.log("Password doesn't match!")
      res.render('find', {message: 'passwoed problem'});
        } else {
          console.log("Password matches!")
          res.render('secret', {message : 'this is secret page: user - ' + user.name })
        }
      })
    } 
else {
 console.log('user not found')
 res.render('find', {message: 'user problem - ' + req.body.name});
}
  })
})

/*
app.get('/', (req, res) => {
  res.render('find');  
    res.render('find');  
})
*/


app.get('/message', (req, res) => {
  Person.find(function(err, user) {
    //console.log(user)
    res.render('message', {message: user})
  }).skip(2).limit(3);
})

app.listen(port);
