var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var handler = require("./requesthandlers");
var PORT = 8080;

app.get('/', handler.hello); //http://localhost:8080/getAttrac/1/59.370617/18.051539/food&museums
app.get('/init/:id/:lat/:lng/:filter', handler.init);
app.get('/getAttrac/:id/:lat/:lng/:filter', handler.getCloseAttractions); //http://localhost:8080/getAttrac/1/59.381668/18.022633/food&history
app.get('/getDetail/:id/:placeId', handler.getPlaceDetail); //get more Details about an attraction. http://localhost:8080/getDetail/1/naturhistoriska-riksmuseet-stockholm


// app.get('/update/:id/:lat/:lng/:filter', handler.update); //when the filter changed 


app.listen(PORT, function() {
    console.log('The Hidden City is listening on port ' + PORT + '!');
});

//ALWAYS use lat,lng