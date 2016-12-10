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

function getAttractionsForDir(pos, dir, filters){
	for (var i = 0; i < util.DIRS.length; i++) {
		
		//depending on the dirction offset the search center by radiusFilter/2
		if(i==0){
			
		}
	};
}

function getCloseAttractions(pos, filters, callback) {
    // See http://www.yelp.com/developers/documentation/v2/search_api
    var relevantAttractions = [];
    // yelpCall(pos, filters, 0, relevantAttractions, callback);
    var c = 0;

    for (var i = 0; i < filters.length; i++) {
        yelp.search({ term: filters[i], location: Stockholm, sort: 2, radius_filter: radiusFilter })
            .then(function(data) {
            	c+=1;
                relevantAttractions.push(selectRelevantAttractions(data));
                if (c == filters.length)
                    callback(relevantAttractions);
            })
            .catch(function(err) {
                console.error(err);
            });
    };
}

function checkForCloseAttraction(pos, dir){

}

//opening hours?
function selectRelevantAttractions(data) {
    //primary immediate attractions
    //secondary attractions to show on map
    var businesses = data.businesses;
    var secondaryList = [];
    for (var i = 0; i < businesses.length; i++) {
        if (businesses[i].rating > minRating) {
            var attraction = {
                "id": businesses[i].id,
                "name": businesses[i].name,
                "description": businesses[i].snippet_text,
                "rating": businesses[i].rating,
                "location": businesses[i].location.coordinate,
                // "distance": businesses[i].location.coordinate,
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
	console.log('looking for '+id);
	yelp.search({ term: id, location: 'stockholm'})
	    .then(function(data) {
	    	console.log("ohlala, found "+data);
	    	callback(data);
	    })
	    .catch(function(err) {
	        console.error(err);
	    });
}

exports.test = test;
exports.getCloseAttractions = getCloseAttractions;
exports.getPlaceDetail = getPlaceDetail;