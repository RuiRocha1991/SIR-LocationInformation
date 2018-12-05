var mymap;
var marker;
var popup;
var pos;

function initMap() {
	mymap = L.map('mapid').setView([-104.99404, 39.75621], 40);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', 
		{ 
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
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
      // Browser doesn't support Geolocation
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

function getNameCity(location) {
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
	        				getInfoCity(name); 
        				}
        			}else
        				if(results[i].types[x]=="administrative_area_level_1"){
	        				getInfoCity(results[i].formatted_address);  
    					}	
        } else 
          window.alert('No results found');
	} else 
	window.alert('Geocoder failed due to: ' + status);
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

function convertWeatherJsonToDailyJson(data){
	Date.prototype.addDays = function(days) {
		var date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		return date;
	}
	var dat;
	var date = new Date();

	let jsonComplete={};
	var jsonRows=[]
	jsonComplete.data=jsonRows;

	for(let i=0; i<data.daily.data.length; i++){
		dat=date.addDays(i);
		object={
			"day": dat,
			"icon": "https://darksky.net/images/weather-icons/"+data.daily.data[i]['icon']+".png",
			"summary": data.daily.data[i]['summary'],
			"temperatureMax": data.daily.data[i]['temperatureMax']+'ºC',
			"temperatureMin": data.daily.data[i]['temperatureMin']+'ºC',
			"windGust": data.daily.data[i]['windGust']+'Km/h',
			"windSpeed": data.daily.data[i]['windSpeed']+'Km/h',
			"cloudCover": data.daily.data[i]['cloudCover']*100+'%',
			"dewPoint": data.daily.data[i]['dewPoint']+'ºC',
			"humidity": data.daily.data[i]['humidity']*100+'%',
			"visibility": data.daily.data[i]['visibility']+'Km'
		}

		jsonComplete.data.push(object);


	}
	createWeatherTo8Days(jsonComplete);
}


function createWeatherTo8Days(data) {
	var template = document.getElementById("carouselTemplate").innerHTML;
	Mustache.parse(template);   // optional, speeds up future uses
	var rendered = Mustache.render(template, data);
	var membercontent = document.getElementById("carouselContentID");
	membercontent.innerHTML=rendered; 
	var t =document.getElementsByClassName("carousel-item");
	$(t[0]).toggleClass('active');    
  }