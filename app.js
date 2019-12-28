//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const homeStartingContent = "Welcome to My 11th Nugget. An online journal, to help us stay connected, even when we're thousands of miles apart.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
// const ourSongContent = "This is a special page that I would like to dedicate to a project that we can build together. We have always joked about writing a song together, and that gave me an idea. Every song is made up of a whole lot of different elements, put together one at a time - from a beat to a chord progression, melody, lyrics, etc. Each song is also made up of different parts - intro, verse, chorus, etc.Every month on the 27th, starting from January, we are going to use this website to create one element of a song. I will upload a whole lot of options for a certain element of the song, and you can either pick one, or give me some kind of feedback. At the end of the year, we will have effectively written a song together - you and I, from across the globe.";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-brandon:270719@cluster0-ytnir.mongodb.net/my11thNuggetDB", {
  useNewUrlParser: true
});

//let posts = [];

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {

  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

// app.get("/contact", function(req, res){
//   res.render("contact", {contactContent: contactContent});
// });

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/our-song", function (req, res) {
  // res.render("our-song", {ourSongContent: ourSongContent});
  res.render("our-song");
});


app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });

  // Email functionality 
  // **********************************************************************************

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'my11thnugget@gmail.com',
      pass: 'Nugget270719'
    }
  });

  let mailOptions = {
    from: 'my11thnugget@gmail.com',
    to: 'brndnhlz@gmail.com, brandonholz97@gmail.com',
    subject: 'New Post On My 11th Nugget',
    text: 'Hi! There is a new post on My 11th Nugget - check it out!'
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('Error sending email', err);
    } else {
      console.log('Successfully sent email');
    }
  });


  // **********************************************************************************

  // posts.push(post);
  //
  // res.redirect("/");

});

// app.get("/posts/:postName", function(req, res){
//   const requestedTitle = _.lowerCase(req.params.postName);
//
//   posts.forEach(function(post){
//     const storedTitle = _.lowerCase(post.title);
//
//     if (storedTitle === requestedTitle) {
//       res.render("post", {
//         title: post.title,
//         content: post.content
//       });
//     }
//   });
//
// });

app.get("/posts/:postId", function (req, res) {

  const requestedPostId = req.params.postId;

  console.log(requestedPostId); //test

  //Post.findOne({_id: requestedPostId}, function(err, post){
  Post.findOne({
    title: requestedPostId
  }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started successfully");
});