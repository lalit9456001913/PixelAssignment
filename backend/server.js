/************ create mongo connection */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise
url = 'mongodb://localhost:27017/PixelDb';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
var uuid = require('uuid');
/************************* */
const port = 5000
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
var session = require('express-session')

require('./schema.js')
const User = mongoose.model('User')

/**** import auth middleware */
const middleware = require('./middleware.js')
/***************** */
const SECRET_KEY = "pixels"
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'pixels',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

const hashmap={
  1:"Monday",
  2:"Tuesday",
  3:"Wednessday",
  4:"Thursday",
  5:"Friday",
  6:"Saturday",
  7:"Sunday"
}

app.post('/createUser',async(req,res)=>{
    try{
        let user = req.body.user
        if(user._id == undefined){
        user._id = new mongoose.mongo.ObjectID()
        }
        User.findOneAndUpdate({_id:user._id},user,{new:true,upsert:true},function(err,user){
          if (err) {
            res.status(403).json({"error":err})
          }
          res.status(200).json({data:user})
        })
    }catch(e){
        res.status(500).json({"error":e})
    }   
})

app.post('/login',async(req,res)=>{
    try{
      console.log(req.body)
        const {username,password} = req.body
        const user =await User.findOne({username:username,password:password})
        console.log(user)
        if(user){
            jwt.sign({user},SECRET_KEY,(err,token)=>{
                if(err){
                res.status(403).send({"msg":"token issue"})
                }else{
                res.cookie('x-auth-token', token, { httpOnly: true })
                res.setHeader('x-auth-token',token)
                console.log(user)
                res.status(200).send(user);
                }
            })
        }
        else{
            res.status(403).json({"msg":"eigther username or password is wrong"})
        }
    }catch(error){
      res.status(500).json({"error":error})
    }
})

app.post('/sendDateAndGetDay',middleware.verifyUser,(req,res)=>{
  try{
    let date = new Date(req.body.date)
    let day_of_week = date.getDay()
    if(day_of_week==0){
      day_of_week+=7
    }
    res.json({"status":200,day:hashmap[day_of_week],day_of_week:day_of_week})
  }catch(error){
    res.status(500).json({"error":error})
  }
})

app.get('/logout',(req,res)=>{
  try{
      const sess = req.session;
      var data = {
          "Data": ""
      };
      sess.destroy(function(err) {
          if (err) {
              data["Data"] = 'Error destroying session';
              res(403).json(data);
          } else {
              data["Data"] = 'logout successfully';
              res.clearCookie('x-auth-token')
              res.status(200).json(data);
          }
      });
  }catch(err){
      res.status(500).json({"msg":err})
  }
})

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })