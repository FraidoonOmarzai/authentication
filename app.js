require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(bodyParser.urlencoded({
   extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
   email: String,
   password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
   res.render("home");
});

app.get("/login", (req, res) => {
   res.render("login");
});

app.get("/register", (req, res) => {
   res.render("register");
});

app.post("/register", (req, res) => {
   const userReg = new User({
      email: req.body.username,
      password: md5(req.body.password)
   });

   userReg.save(err => {
      if (!err) {
         res.render("secrets");
      } else {
         console.log(err);
      }
   })
});

app.post("/login", (req, res) => {
   const username = req.body.username;
   const password = md5(req.body.password);

   User.findOne({
         email: username
      },
      (err, found) => {
         if (!err) {
            if (found) {
               if (found.password === password) {
                  res.render("secrets");
               }
            }
         } else {
            console.log(err);
         }
      }
   );
});







app.listen(3000, () => {
   console.log("running on port 3000");
})
