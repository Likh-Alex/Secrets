//jshint esversion:6
require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const md5 = require("md5")

const app = express()
mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 2,
    max: 60
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 50
  }
})


const User = new mongoose.model("User", userSchema)

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))


app.get("/", function(req, res) {
  res.render('home')
})

app.get("/login", function(req, res) {
  res.render('login')
})

app.get("/register", function(req, res) {
  res.render('register')
})

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  })
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets")
    }
  })
})

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);
  User.findOne({
    email: req.body.username
  }, function(err, foundUser) {
    if (!err) {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets")
        }
      }
    }
  });
});


app.listen(3000, function() {
  console.log('Server is UP at 3000');
})
