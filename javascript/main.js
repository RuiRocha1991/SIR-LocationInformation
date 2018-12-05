var mymap;
var marker;
var popup;
var pos;

function initMap() {
	mymap = L.map('mapid').setView([-104.99404, 39.75621], 40);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', 
		{ 
			maxZoom: 18,
    		id: 'mapbox.streets',
    		accessToken: 'pk.eyJ1Ijoicm9jaGFydWkiLCJhIjoiY2pveTY0cmh3MjhmdDNra2ZrbXcxcHpiMiJ9.ByPMqT07PUxafU1S_oNlTw'
		}).addTo(mymap);
    mymap.locate({setView: true, maxZoom: 8});      
	mymap.on('click', onMapClick);
	function onMapClick(e) {
		addMarker(e.latlng);
	}
	geocoder = new google.maps.Geocoder;
	 if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
	        pos = {
	        	lat: position.coords.latitude,
	          	lng: position.coords.longitude          
	        };
	        addMarker(pos);
      	}, function() {
	        handleLocationError(true);
	      });
    } else {
      handleLocationError(false);
    }
    $("#mapid").css("height","290px");
    $('#mapid').hover(function(){
    	$('#mapid').css("height","835px");
		},function(){
		    $('#mapid').css("height","290px");
		});
}

function handleLocationError(browserHasGeolocation) {
	alert("Location not found!")
}

function addMarker(location) {
	if(marker !== undefined)
		mymap.removeLayer(marker);
	getWeather(location);
	marker = L.marker(location).addTo(mymap);
	//getPlaces(location);
}


function getPlaces(location){
	let lat=location.lat;
	let lng=location.lng;
	let type="food";
	fetch("http://localhost/01-Escola/SIR/Trabalhos%20Praticos/TrabalhoPratico1/php/test.php?lat="+lat+"&lng="+lng+"&type="+type)
		.then(function(resp){
			return resp.json();
		})
		.then(function(data){
			getDetailsPlaceFromId(data.results);
		})
		.catch(function(error){
			console.log(error.message);
		})
}

function getWeather(location){
	fetch("http://localhost/01-Escola/SIR/Trabalhos%20Praticos/TrabalhoPratico1/php/darkyProxy.php?lat="+location.lat+"&lng="+location.lng)
	    .then(function(resp) {
	        return resp.json();
	    })
	    .then(function(data) {
			setInfoResult(data);
			convertWeatherJsonToDailyJson(data);
	        getNameCity(location);
	    })
	    .catch(function (error) {
	        console.log(error.message);
	    });
}



function getDetailsPlaceFromId(places){
	for (let i = 0; i < places.length; i++) {
		console.log(places[i].place_id);
		$.ajax({
			url:"https://maps.googleapis.com/maps/api/place/details/json?placeid="+places[i].place_id+"&key=AIzaSyAPwAin8WQ_Ous1cp9MLAKZW-SAmYHsPpQ",
			method: 'GET',
			dataType:'jsonp',
			success:function(data){
				console.log(data);
			},
			error: function (errorMessage) {
		  		console.log("Erro: "+errorMessage);
			}

		})
	}
}


function getInfoCity(cityName){ 
	let city='';
	var country='';
	for(let i=0; i<cityName.length;i++){
		if(cityName[i] == ',')
			break;
		city+=cityName[i];
	}

	let length=cityName.length;
	while(length>0 && cityName[length]!=','){
		country+=cityName[length-1];
		length--;
	}

 	$.ajax({
 		url: 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&redirects&titles='+city.replace(' ', '_'),
		method: 'GET',
		dataType: 'jsonp',
		success: function (data) {
		 	$( "#descriptionCity" ).text("");
		 	$( "#descriptionCity" ).text( data.query.pages[Object.keys(data.query.pages)].extract );
		},
		error: function (errorMessage) {
		  alert(errorMessage);
		}
	});
	let lengthCountry=country.length;
	while(lengthCountry>0){
		city+=country[lengthCountry-1];
		lengthCountry--;
	}
	$("#cityName").val(city);
}


function setInfoResult(data){
	$("#iconWeather").attr("src","https://darksky.net/images/weather-icons/"+data.currently.icon+".png");
	$( "#weatherSummary" ).text(data.currently.summary);
	$("#temperatureApparent").val(data.currently.apparentTemperature+" ºC");
	$("#visibility").val(data.currently.visibility+" KM");
	$("#windGust").val(data.currently.windGust+" KM/h");
	$("#windSpeed").val(data.currently.windSpeed+" KM/h");
}

