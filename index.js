var chalk   = require('chalk');
var express = require('express');
var app     = express();
var less    = require('express-less');
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var arduino = require('./arduino/server.js');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/static'));
app.use('/less', less(__dirname + '/less'));

app.get('/', function(req, res){
  res.render('rc-car.jade')
});

io.on('connection', function(socket){
  console.log(chalk.red('Client connected to SocketIO'));
});

http.listen(3000, function(){
  console.log(chalk.green('Express/SocketIO is Initialized'));
});

arduino.on('image', function(){
  io.emit('image');
});
