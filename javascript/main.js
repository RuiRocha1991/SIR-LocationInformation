var mymap;
var marker;
var popup;
var pos;
var places=[];


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
	getPlaces(location);
}

function  getWeather(location){
	fetch("php/darkyProxy.php?lat="+location.lat+"&lng="+location.lng)
	    .then(function(resp) {
	        return resp.json();
	    })
	    .then( function(data) {
			setInfoResult(data);
			convertWeatherJsonToDailyJson(data);
			getCity(location);
	    })
	    .catch(function (error) {
	        console.log(error.message);
	    });
}

function getCity(location) {
    geocoder.geocode({'location': location}, function(results, status) {
  	if (status === 'OK') {
      	let name="";
        if (results[0]) {
        	for(let i=0; i<results.length; i++)
        		for(let x=0; x<results[i].types.length;x++)
        			if(results[i].formatted_address.indexOf("USA")<0){
        				if(results[i].types[x]=="administrative_area_level_2"){
        					if(results[i].formatted_address.indexOf('Brazil')>0){
        						for(let y=0; y<results[i].formatted_address.length; y++){
        							if(results[i].formatted_address[y] == '-')
        								break;
        							name+=results[i].formatted_address[y];
        						}
        					}else{
        						name=results[i].formatted_address;
							}
	        				getInfoCity( name); 
        				}
        			}else
        				if(results[i].types[x]=="administrative_area_level_1"){
	        				getInfoCity( results[i].formatted_address);  
    					}	
        } else 
          window.alert('No results found');
	} else 
	window.alert('Geocoder failed due to: ' + status);
    }); 
 }




function getPlaces(location){
	let type="museum";
	fetch("php/placesProxy.php?lat="+location.lat+"&lng="+location.lng+"&type="+type)
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

function getDetailsPlaceFromId(places){
	for (let i = 0; i < places.length; i++) {
		$.ajax({
			url: 'php/placesIdProxy.php?place='+places[i].place_id,
			method: 'GET',
			dataType: 'json',
			success: function (data) {
				places[i]=data;
				fillCardsPlaces(data);
			},
			error: function (errorMessage) {
				alert(errorMessage);
			}
		});
	}
	
}

function getInfoCity(name){ 
	let city=getNameCity(name);
	let country=getCountry(name);
	$.ajax({
 		url: 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&redirects&titles='+city.replace(' ', '_'),
		method: 'GET',
		dataType: 'jsonp',
		success: function (data) {
			$("#cityName").val(city+country);
		 	$( "#descriptionCity" ).text( data.query.pages[Object.keys(data.query.pages)].extract );
		},
		error: function (errorMessage) {
		  alert(errorMessage);
		}
	});
}


function setInfoResult(data){
	$("#iconWeather").attr("src","https://darksky.net/images/weather-icons/"+data.currently.icon+".png");
	$( "#weatherSummary" ).text(data.currently.summary);
	$("#temperatureApparent").val(data.currently.apparentTemperature+" ºC");
	$("#visibility").val(data.currently.visibility+" KM");
	$("#windGust").val(data.currently.windGust+" KM/h");
	$("#windSpeed").val(data.currently.windSpeed+" KM/h");
}

