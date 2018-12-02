/*map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: -34.397, lng: 150.644},
	  zoom: 13
	});*/

	map = L.map('mapid').setView([51.5, -0.09], 13);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', 
		{ 
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 18,
    		id: 'mapbox.streets',
    		accessToken: 'pk.eyJ1Ijoicm9jaGFydWkiLCJhIjoiY2pveTY0cmh3MjhmdDNra2ZrbXcxcHpiMiJ9.ByPMqT07PUxafU1S_oNlTw'
		}).addTo(map);

	}

	geocoder = new google.maps.Geocoder;
	infoWindow = new google.maps.InfoWindow;
	// Try HTML5 geolocation.
    if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
        	lat: position.coords.latitude,
          	lng: position.coords.longitude
           
        lat:40.708220,
          lng:-74.283909
           formatted_address:"Union, NJ 07083, USA"

          lat: 41.710208,
          lng:-8.754914
          formatted_address: "Viana do Castelo, Portugal"

           //brasil
          lat:-22.908971, 
          lng:-43.475516


          //espanha
          lat: 37.390371,
          lng:-5.984583

         
          
        };
		addMarker(pos)
		map.addListener('click', addMarker);
        map.setCenter(pos);
	      }, function() {
	        handleLocationError(true, infoWindow, map.getCenter());
	      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
	                      'Error: The Geolocation service failed.' :
	                      'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}

function addMarker(location) {
	getWeather(location)
	deleteMarkers();
	var marker = new google.maps.Marker({
	 	position: location, 
		map: map,
		draggable: true,
	  	animation: google.maps.Animation.DROP,
	});
	
	marker.addListener('click', function() {
		
  		infowindow.open(map, marker);
    });
    
 	var positionToinfo = "Latitude: "+location.lat+" Longitude: "+location.lng;
    var infowindow = new google.maps.InfoWindow({
      content: positionToinfo
    });
    markers.push(marker);
}

function deleteMarkers() {
	setMapOnAll(null);
    markers = []; 
}

function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
	  markers[i].setMap(map);
	}
}


function getWeather(location){
	fetch("http://localhost/01-Escola/SIR/TrabalhoPratico1/php/darkyProxy.php?lat="+location.lat+"&lng="+location.lng)
	    .then(function(resp) {
	        return resp.json();
	    })
	    .then(function(data) {
	        setInfoResult(data);
	        getNameCity(location);
	    })
	    .catch(function (error) {
	        console.log(error.message);
	    });
}

function getNameCity(location) {
    geocoder.geocode({'location': location}, function(results, status) {
  	if (status === 'OK') {
      	document.getElementById('cityName').value="";
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
        					document.getElementById('cityName').value=results[i].formatted_address;
	        				getInfoCity(name); 
        				}
        			}else
        				if(results[i].types[x]=="administrative_area_level_1"){
        					document.getElementById('cityName').value=results[i].formatted_address;
	        				getInfoCity(results[i].formatted_address);  
    					}	
        } else 
          window.alert('No results found');
	} else 
	window.alert('Geocoder failed due to: ' + status);
    }); 
 }

function getInfoCity(cityName){ 
 	$.ajax({
 		url: 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&redirects&titles='+cityName.replace(' ', '_'),
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
}

function getKeyOfCity(data){
	let a = Object.keys(data);
	console.log("Variavel a: "+a);
}


function setInfoResult(data){
	var iconWeather = document.getElementById('iconWeather');
	iconWeather.src="https://darksky.net/images/weather-icons/"+data.currently.icon+".png";
	var summary= document.getElementById('weatherSummary');
	summary.value=data.currently.summary;
	var temperatureApparent = document.getElementById('temperatureApparent');
	var visibility = document.getElementById('visibility');
	var windGust = document.getElementById('windGust');
	var windSpeed = document.getElementById('windSpeed');

	temperatureApparent.value=data.currently.apparentTemperature+" ºC";
	visibility.value=data.currently.visibility+" KM";
	windGust.value=data.currently.windGust+" KM/h";
	windSpeed.value=data.currently.windSpeed+" KM/h";
}
