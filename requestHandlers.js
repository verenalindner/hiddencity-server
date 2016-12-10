var destinator = require("./destinator");
// var navigator = require("./navigator");

function hello(req, res) {
    destinator.test();
    res.send("hello");
}

function init(req, res) {
    destinator.test();
    res.send("hello");
}

//TODO make the filter a list!
function getCloseAttractions(req, res) {
    var p = req.params;
    var pos = [p.lat, p.lng];


    var filter = p.filter.split("&"); //get the filters as an array
    console.log(filter);
    // destinator.getCloseAttractions(pos, filter, function(dataRes) { 
    destinator.getAttractionsForDir(pos, filter, function(dataRes) {
        res.send(dataRes);
    });
}

function getPlaceDetail(req, res) {
    var p = req.params;
    destinator.getPlaceDetail(p.placeId, function(dataRes) {
        res.send(dataRes);
    });
}



exports.hello = hello;
exports.getCloseAttractions = getCloseAttractions;
exports.getPlaceDetail = getPlaceDetail;