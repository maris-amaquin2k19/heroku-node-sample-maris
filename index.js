var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var users= [];
var connections = [];



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);

	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket) , 1);
		
	});

	//send message
	socket.on('send message',function(data){
		io.sockets.emit('new message' , {msg: data, user: socket.username});
	});

	socket.on('typing', function(username) {
		socket.broadcast.emit('typing', username);
	})

	// new user
	socket.on('new user',function(data,callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});