const express = require('express');
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.static('public'));

mongoose.connect('mongodb://localhost/my_db', {useNewUrlParser:true, useUnifiedTopology:true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('we are connected!');
  
});

const dogSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const puppy = mongoose.model('puppy', dogSchema);

const silence = new puppy({ name: 'Silence', age: 12 });
//console.log(silence.name); // 'Silence'

const noise = new puppy({name: 'noise', age: 32});
//console.log(noise.name);
/*
silence.save(function(err, silence) {
    if(err) {
        return console.error(err);
    } else {
        console.log('silence saved');
    }
});

noise.save();
*/
app.get('/', (req, res) => {
    res.render('signup');
});

app.post('/signup', function(req, res){
    var personInfo = req.body; //Get the parsed information
    
    if(!personInfo.name || !personInfo.age || !personInfo.nationality){
       res.send('success')
    } else {
       var newPerson = new Person({
          name: personInfo.name,
          age: personInfo.age,
          nationality: personInfo.nationality
       });
         console.log(personInfo);
       newPerson.save(function(err, Person){
          if(err)
             res.render('show_message', {message: "Database error", type: "error"});
          else
             res.render('show_message', {
                message: "New person added", type: "success", person: personInfo});
       });
    }
 });

puppy.find({name: "noise", age: 32}, 
function(err, response){
   console.log(response);
});

app.listen(3000);