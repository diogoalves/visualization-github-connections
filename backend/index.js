const express = require('express');
const app = express();
var http = require('http').Server(app);
const path = require('path');
const querystring = require('querystring');

const request = require('request');
require('dotenv').load();

// app.use(express.static(path.join(__dirname, '/build')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/access_token', (req, res) => {
  const postData = querystring.stringify({
    "client_id": process.env.CLIENT_ID,
    "client_secret": process.env.CLIENT_SECRET,
    "code": req.query.code , 
    "redirect_uri": process.env.REDIRECT_URL
  });
  request.post({
      headers: {'content-type': 'application/json', "Accept": "application/json" },
      url: 'https://github.com//login/oauth/access_token',
      form: postData
  }, function(error, response, body){
    res.send(body)
  });
});

http.listen(4000, () => console.log('listening on *:4000'));