const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost/my_db', {useNewUrlParser:true, useUnifiedTopology:true});

const db = mongoose.connection;
const mySchema = new mongoose.Schema({
    name: String,
    age: Number
});

const Person = mongoose.model('Person', mySchema, 'users');

db.once('open', function() {
    console.log('ceonnected');
});

const gauda = new Person({name: 'David', age: 23});
gauda.save();

const tara = new Person({name: 'tara', age: 33 });
tara.save(function(err, tara) {
    if(err) {
        return console.error(err);
    } else {
        console.log('silence saved');
    }
});