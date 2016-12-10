// Request API access: http://www.yelp.com/developers/getting_started/api_access
var Yelp = require('yelp');
var util = require("./constants");

var yelpConsumerKey = 'DgzSfDYmRVYboIrDbgL1ww';
var yelpConsumerSecret = '95yQCget2F7KPQtLlvQoI6sNoYg';
var yelpToken = 'GD8cFoVP0chYTEjNtyIDnj_HOxyUt72F';
var yelpTokenSecret = 'GK5WpmYbLMJnJMpAU4z8aSLbU4w';

var minRating = 3.9; //TODO specify the min rating to show the cafe. Query e.g. the whole city to find relevant finds?
var radiusFilter = 1000;
var fence = 40;

var yelp = new Yelp({
    consumer_key: yelpConsumerKey,
    consumer_secret: yelpConsumerSecret,
    token: yelpToken,
    token_secret: yelpTokenSecret,
});

function test() {
    // See http://www.yelp.com/developers/documentation/v2/search_api
    yelp.search({ term: 'food', location: 'Montreal' })
        .then(function(data) {
            console.log(data);
        })
        .catch(function(err) {
            console.error(err);
        });
}

//Query everything. Put into own fileformat
function init(pos, filters){

}

function getAttractionsForDir(pos, filters, callback) {
    // See http://www.yelp.com/developers/documentation/v2/search_api
    var sortedAttractions = [];
    var c = 0;
    for (var i = 0; i < filters.length; i++) {
        yelp.search({ term: filters[i], location: pos[0] + "," + pos[1], sort: 2, radius_filter: radiusFilter })
            .then(function(data) {

                //guess the correct category
                var cat = filters[c];
                c += 1;
                var relevantAttractions = selectRelevantAttractions(pos, data);
                if (relevantAttractions.length > 0)
                    sortedAttractions.push(sortAttractions(pos, cat, relevantAttractions, callback));
                if (c == filters.length) {
                    callback(sortedAttractions);
                }
            })
            .catch(function(err) {
                console.error(err);
            });
    };
}

//TODO sort it into more than four directions
function sortAttractions(pos, cat, attractions, callback) {
    console.log("now sorting attractions for cat " + cat + ". they are " + attractions);
    var northEast = [];
    var southEast = [];
    var southWest = [];
    var northWest = [];

    for (var i = 0; i < attractions.length; i++) {
        if (attractions[i].location.latitude > pos[0]) {
            if (attractions[i].location.longitude > pos[1]) {
                northEast.push(attractions[i]);
            } else {
                northWest.push(attractions[i]);
            }
        } else {
            if (attractions[i].location.longitude > pos[1]) {
                southEast.push(attractions[i]);
            } else {
                southWest.push(attractions[i]);
            }
        }
    }

    //build response
    var filterResponse = {
        "cat": cat,
        "results": [{
            "dir": util.DIRS.indexOf("NE"),
            "attractions": northEast
        }, {
            "dir": util.DIRS.indexOf("SE"),
            "attractions": southEast
        }, {
            "dir": util.DIRS.indexOf("SW"),
            "attractions": southWest
        }, {
            "dir": util.DIRS.indexOf("NW"),
            "attractions": northWest
        }]
    };

    return filterResponse;
}

//DEPRACTED - OLD :)
function getCloseAttractions(pos, filters, callback) {
    // See http://www.yelp.com/developers/documentation/v2/search_api
    var relevantAttractions = [];
    // yelpCall(pos, filters, 0, relevantAttractions, callback);
    var c = 0;

    for (var i = 0; i < filters.length; i++) {
        yelp.search({ term: filters[i], location: pos[0] + "," + pos[1], sort: 2, radius_filter: radiusFilter })
            .then(function(data) {
                c += 1;
                relevantAttractions.push(selectRelevantAttractions(pos, data));
                if (c == filters.length)
                    callback(relevantAttractions);
            })
            .catch(function(err) {
                console.error(err);
            });
    };
}

function checkForCloseAttraction(pos, dir) {

}

//opening hours?
function selectRelevantAttractions(pos, data) {
    //primary immediate attractions
    //secondary attractions to show on map
    var businesses = data.businesses;
    var secondaryList = [];
    for (var i = 0; i < businesses.length; i++) {
        if (businesses[i].rating > minRating) {

            var distance = getDistanceFromLatLngInM(businesses[i].location.coordinate.latitude, businesses[i].location.coordinate.longitude, pos[0], pos[1]);

            var attraction = {
                "id": businesses[i].id,
                "name": businesses[i].name,
                "description": businesses[i].snippet_text,
                "rating": businesses[i].rating,
                "location": businesses[i].location.coordinate,
                "distance": distance
                    // "directions": businesses[i].location.coordinate TODO!
            }
            secondaryList.push(attraction);
            console.log("push  " + businesses[i].name);
        } else {
            break;
        }
    };


    if (secondaryList.length == 0)
        return;

    // var response = {};
    // list.results;



    //check if the location is close
    //if(secondaryList[0].distance < minDist)

    // var primary = {
    //     "name": secondaryList[0].name,
    //     "snippet_text": secondaryList[0],
    //     "directions": "500m from you there is the "
    // }
    // return primary;
    return secondaryList;
}


function getPlaceDetail(id, callback) {
    console.log('looking for ' + id);
    yelp.search({ term: id, location: 'stockholm' })
        .then(function(data) {
            console.log("ohlala, found " + data);
            callback(data);
        })
        .catch(function(err) {
            console.error(err);
        });
}

//taken from 
//http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistanceFromLatLngInM(lat1, lon1, lat2, lon2) {
    var R = 6371000; // Radius of the earth in m
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in m
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}


exports.test = test;
exports.getCloseAttractions = getCloseAttractions;
exports.getPlaceDetail = getPlaceDetail;
exports.getAttractionsForDir = getAttractionsForDir;