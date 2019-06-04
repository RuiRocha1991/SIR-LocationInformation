var mymap;
var directionsDisplay;
var directionsService;
var marker;
var popup;
var pos;
var typesSelected=new Array();
var locationSelected;
var radius=0;
var markerPlaces=[];
var HasDirection=false;
var GOOGLE_KEY='';

function initMap() {

	var myStyles =[
		{
			featureType: "poi",
			elementType: "labels",
			stylers: [
				  { visibility: "off" }
			]
		}
	];
	mymap=new google.maps.Map(document.getElementById('mapid'), {
		zoom: 12,
		center:  {lat: -25.363, lng: 131.044},
		mapTypeId: 'roadmap',
		styles:myStyles
	  });
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(mymap);
	google.maps.event.addListener(mymap, "click", function (event) {
		addMarker({lat:event.latLng.lat(),lng:event.latLng.lng()});
		mymap.setCenter({lat:event.latLng.lat(),lng:event.latLng.lng()});
	});
	

	geocoder = new google.maps.Geocoder;
	if (navigator.geolocation) {
	   navigator.geolocation.getCurrentPosition(function(position){
		   pos = {
			   	lat: position.coords.latitude,
				lng: position.coords.longitude          
		   };
		   addMarker(pos);
		   mymap.setCenter(pos);
		 }, function() {
		   handleLocationError(true);
		 });
   } else {
	 handleLocationError(false);
   }
	initVariables();
}

function handleLocationError(browserHasGeolocation) {
	alert("Location not found!")
}

function addMarker(location) {
	if(marker !== undefined)
		marker.setMap(null);

	getWeather(location);
	var image={
		url:'img/myLocation.png'
	}
	marker = new google.maps.Marker({
		position: location,
		map: mymap,
		icon:image
	  });
	locationSelected=location;
	getPlaces(location);
}

function  getWeather(location){
	fetch("php/darkSkyProxy.php?lat="+location.lat+"&lng="+location.lng)
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
	
	if(markerPlaces.length>0){
		removeMarkerPlace();
		markerPlaces=[];
	}
	if(typesSelected.length> 0){
		$('#places .card').remove();
		$('#places h1').remove();
		for(let i=0; i<typesSelected.length;i++){
			let type=typesSelected[i];
			fetch("php/placesProxy.php?key="+GOOGLE_KEY+"&lat="+location.lat+"&lng="+location.lng+"&type="+type+"&radius="+radius)
				.then(function(response){
					return response.text();
				})
				.then(function (response){
					return $.parseXML(response);
				})
				.then(function(data){
					getDetailsPlaceFromId(data.getElementsByTagName('result'));
				})
				.catch(function(error){
					console.log(error.message);
				})
		}
	}else{
		$('#places h1').remove();
		$('#places .card').remove();
		$('#places').append('<h1 class="placesEmpty">Select the type of interest in the settings</h1>');
	}
}

function getDetailsPlaceFromId(places){
	$('#places .card').remove();
	for (let i = 0; i < places.length; i++) {
		$.ajax({
			url: 'php/placesIdProxy.php?key='+GOOGLE_KEY+'&place='+places[i].getElementsByTagName('place_id')[0].textContent,
			method: 'GET',
			dataType: 'json',
			success: function (data) {
				fillCardsPlaces(data);
				return data;
			},
			error: function (errorMessage) {
				alert(errorMessage);
			}
		}).then(function(data){
			$('.cardPlaceDetails').hover(function(){
				getMarkerSelect($(this).data('id'));
			}, function(){
				removeHover();
			});

			$( ".cardPlaceDetails" ).click(function() {
				getDirectionsFromPosToPlace(data);
			});
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
		 	$("#descriptionCity").text(data.query.pages[Object.keys(data.query.pages)].extract);
		},
		error: function (errorMessage) {
		  alert(errorMessage);
		}
	});
}

function getDirectionsFromPosToPlace(place){
	if(!HasDirection){
		HasDirection=true;
		var request = {
			origin: pos,
			destination: place.result.geometry.location,
			travelMode: 'DRIVING'
		};
		directionsService.route(request, function(directions, status) {
		if (status == 'OK') {
			directionsDisplay.setDirections(directions);
			launchModal(place, directions);
			HasDirection=false;
		}else
			HasDirection=false;
		});
	}
}



