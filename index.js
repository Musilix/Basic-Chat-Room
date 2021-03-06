var userCount = 0;

// must declare dependencies for express to ultimately enable smooth/easy/clean manner to implement some html
//into our node.js shits
const express = require('express');
// need to also require http as we will be working with server shit. Opening up server on port 5000, and sending requests and getting responses
var http = require('http');
//we create an app instance by making an express obj(this is how we use all the tools necessary tp build html stuff)
var app = express();
var socketIo = require('socket.io');

//we need a server object in order to do things with our server such as listen
//a mere http object cant do that. But with express, we can use our http obj to create a server based on our 
//app obj!!!
var server = http.Server(app);
var io = socketIo(server);

const PORT = process.env.PORT || 5000;

// app.use(express.static(__dirname + '/public'));

//so we call our app obj/express middlware shits in order to declare a static file we will use on our hosted site
//we say to include images from our avatars folder for every http request including ./avatars

//app.use() is mountaing the express.static middleware!!!!!
app.use('/avatars', express.static(__dirname + '/avatars'));
app.use('/sounds', express.static(__dirname + '/sounds'));

//here we set the port our bebsite will bbe on
app.set('port', PORT);

// bucc nasty wa of locating our file. we cant use ./ as that is relative to our current working dir
//instead we use __dirname to find the dir which the currently executed .js file is!
// app.use('index.html', express.static(__dirname + 'index.html'));

//and here we "get" some domain... i think any domain which will be the main... thats what / stands for??? idek
//but we expect a request n response. we can use the response parameter to send text and basic things to the server
//but i think i will phase this out as i use express to bring in html
app.get('/', function(req, res){
	// res.send("HEY KID, YOURE IN THE MATRIX")

	// theres another manner to do this such as telling app.use(yada yada) up there and then doing this
	//but this alone works fine
	res.sendFile(__dirname + '/index.html');
});

//this checks to see when our io has registered as connected! then we can go on...
//
//we say a user has entered if a new io socket is connected
io.on('connection', function(socket){
	userCount++;
	io.emit('update-users');
	console.log("USER ENTERED");

	//on disconnect, we say the user has, ofc, disconnected
	socket.on('disconnect', function(){
		userCount--;
		io.emit('update-users');
		console.log("USER EXITED");
	});

	//and once a socket/user sends the server a message get event, we use our function to emit A TRUE MESSAGE GET TO EVERY USER ON THE SERVER
	//giving it a parameter with our msg data

	//holy frick, for so long this junk was returning msg.namer back as undefined, then all of a sudden when I restarted the server, everything seemed to sync up???
	//so maybe if i make changes that the server depend on, i have to reset the server
	socket.on('message-get', function(msg){
		//json obj to hold user details
		var userDetails = {
			message: msg.message,
			pic: msg.pic,
			namer: msg.namer
		};
		
		io.emit('message-get', userDetails);
	});

	//recording the users on the server: only updates when someone "disconnects"
	socket.on('get-users', function(){
		io.emit('get-users', userCount);
	});
});

//here our server obj is listening on our port 5000, rather than an http obj listening!
server.listen(PORT, function(){
	console.log("LISTENING ON " + PORT);
});




//must use listen on the server object we create with .createServer()
// var server = http.createServer(function(req,res){
//         res.writeHead(200);
//         res.end("Hello world");
//     });
// server.listen(3000,function(){
// console.log('Server running on port 3000')
// });

