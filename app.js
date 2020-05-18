var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var port =  process.env.PORT || '8081';

var server = http.Server(app);
server.listen(port);
var io = require('socket.io')(server);



io.on('connection', (socket) => {
    console.log(socket.id);
    socket.broadcast.emit('joined', {user : socket.id});

    socket.on('call',(s)=>{
      console.log(s);
      io.to(s.target).emit('calling', s)
    })
    socket.on('receiveCall', (s)=>{
      console.log(s);
      io.to(s.target).emit('ack', s);
    });
    socket.on('ice', (s) => {
      console.log(s);
      io.to(s.target).emit('icereceive', s);
    })
 });

 

