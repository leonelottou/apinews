const express = require('express');
var mysql = require('mysql');
var parser = require('body-parser');
const moment = require('moment');
var nodemailer = require('nodemailer');


const http = require('http');
const axios = require('axios');

const app = express();

app.set('view engine', 'ejs');
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "newsapi"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  

 
});

moment.locale();        

app.use(express.json());

app.use((req, res, next) => {

  const userAgent = req.get('user-agent');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('User-Agent',userAgent);
    next();
  });



app.get('/mail',function(req, res){

  var transporter = nodemailer.createTransport({
    

  /*   host: "smtp.mailtrap.io",
    port: 2525,

    auth: {
      user: '56cc4e99316f57',
      pass: '09491822a647ae'
    } */


   host: "mocha3035.mochahost.com",
    port: 465,

    auth: {
      user: 'infos@ouicare.cm',
      pass: 'helios2016'
    } 

  });


  

  var mailOptions = {
    from: 'infos@ouicare.cm',
    to: 'leonelottou@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });




})

  app.get('/',  async function(req, res)  {

 
    const donne = await axios.get("https://newsapi.org/v2/everything?q=cameroon&apiKey=1e41b4b61db34241b05180a57e5d2826");

    console.log( donne.data['articles'][0]);
    

   let mydata=donne.data['articles'];
   
     res.render('main',{"mydata":mydata,"page":"index"});


   });


   app.get('/article',  async function(req, res)  {

    con.query("SELECT * FROM news ORDER BY id desc", function (err, result, fields) {
      if (err) throw err;
      console.log({"mydata":result});

      res.render('main',{"mydata":result,"page":"about",moment});
    });
  });

  app.get('/articles/update',  async function(req, res)  {

    con.query("SELECT * FROM news WHERE id='"+req.query.id+"' ", function (err, result, fields) {
      if (err) throw err;
      console.log({"mydata":result[0]});

      res.render('main',{"mydata":result[0],"page":"update",moment});
    });
  });

 
  app.get('/add',function(req, res)  {

   

      res.render('main',{"page":"addnews"});

  });

  app.use('/articles/delete',function(req, res)  {

    //res.json(req.query.id);

    con.query("DELETE FROM news WHERE id='"+req.query.id+"'", function (err, result, fields) {
      if (err) throw err;
      res.redirect('/article');

   
    });

});

 

   

  app.post('/article/add',function(req,res){
    let currentDate = new Date().toJSON().slice(0, 10);
console.log(currentDate);
    var student = {
        "titre" : req.body.titre,
        "description" : req.body.description,
        "date":currentDate,
        "auteur":req.body.auteur,
        "contenu":req.body.contenu,}
    console.log(req.body);

   // res.json(student);

  console.log(student.titre);

   con.query("INSERT INTO news VALUES (NULL, '"+student.titre+"','"+student.auteur+"','"+student.date+"','"+student.description+"','"+student.contenu+"' ) " , function (err, result, fields) {
      if (err) throw err;
      

      res.redirect('/article');
    }); 
   // res.render('main',{"page":"addnews"});

    
    //res.json(student);
     
});

app.post('/verif_update',function(req,res){
  let currentDate = new Date().toJSON().slice(0, 10);
console.log(currentDate);
  var student = {
      "titre" : req.body.titre,
      "description" : req.body.description,
      
      "auteur":req.body.auteur,
      "contenu":req.body.contenu,}
  console.log(req.body);

 // res.json(student);

console.log(student.titre);

 con.query("UPDATE  news SET  titre='"+student.titre+"', auteur='"+student.auteur+"', description='"+student.description+"', contenu='"+student.contenu+"' WHERE id='"+req.query.id+"' " , function (err, result, fields) {
    if (err) throw err;
    

    res.redirect('/articles/update?id='+req.query.id);
  }); 
 // res.render('main',{"page":"addnews"});

  
  //res.json(student);
   
});






app.get('/api/stuff', (req, res, next) => {




 
  
  });


  app.post('/api/stuff', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
      message: 'Objet créé !'
    });
  });
 
module.exports = app;