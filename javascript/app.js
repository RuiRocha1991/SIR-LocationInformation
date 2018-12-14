var isHover=false;
var markeTemp;
var weekday = new Array();
	weekday[0] =  "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";

function initVariables(){
    $(document).ready(function(){
		$("#mapid").css("height","290px");
    	$('#mapid').hover(function(){
			$('#mapid').css("height","835px");
			},function(){
				$('#mapid').css("height","290px");
		});
		
		$('.panel').hover(function(){
			$(this).find('.icon').addClass('paneHover');
			},function(){
				$(this).find('.icon').removeClass('paneHover');
		});

		$( ".panel" ).click(function() {
			if( $(this).find('.icon').hasClass('iconHover')){
				$(this).find('.icon').removeClass('iconHover');
				typesSelected.splice(typesSelected.indexOf($(this).find('i')[0].id),1);
				getPlaces(locationSelected);
				directionsDisplay.setDirections({routes: []});
			}else{
				$(this).find('.icon').addClass('iconHover');
				typesSelected.push($(this).find('i')[0].id);
				getPlaces(locationSelected);
				directionsDisplay.setDirections({routes: []});
			}			
		});
		document.getElementById('labelRange').innerHTML=(document.getElementById("controlRadius").value /1000)+' Km';
		radius=document.getElementById("controlRadius").value;
		document.getElementById("controlRadius").oninput = function() {
			document.getElementById('labelRange').innerHTML=(this.value /1000)+' Km';
			radius=this.value;
			getPlaces(locationSelected);
		}
	})
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
		dat= date.addDays(i);
		object={
			"day": formatDate(dat),
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
	var template = document.getElementById("carouselTemplateWeatherWeek").innerHTML;
	Mustache.parse(template);   // optional, speeds up future uses
	var rendered = Mustache.render(template, data);
	var membercontent = document.getElementById("carouselContentIDWeatherWeek");
	membercontent.innerHTML=rendered; 
	var t =document.getElementsByClassName("carousel-item");
	$(t[0]).toggleClass('active');    
  }

function formatDate(date) {
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	
	return weekday[date.getDay()] +', '+day + '/' + (monthIndex+1) + '/' + year;
}

function getNameCity(name){
	let city='';
	for(let i=0; i<name.length;i++){
		if(name[i] == ',')
			break;
		city+=name[i];
	}
	return city;
}

function getCountry(name){
	var countryInverse='';
	var country='';
	let length=name.length;
	while(length>0 && name[length]!=','){
		countryInverse+=name[length-1];
		length--;
	}
	length=countryInverse.length;
	while(length>0){
		country+=countryInverse[length-1];
		length--;
	}
	return country;
}

function fillCardsPlaces(data){
	if(data.result.photos!==undefined && data.result.opening_hours!==undefined){
		var url='https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference='+data.result.photos[0].photo_reference+'&sensor=true&key=AIzaSyAPwAin8WQ_Ous1cp9MLAKZW-SAmYHsPpQ';

		if(data.result.opening_hours.open_now){
			var span='<span class="open">'+ (data.result.opening_hours.open_now? 'Open': 'Close') +'</span>';
		}else{
			var span='<span class="closed">'+ (data.result.opening_hours.open_now? 'Open': 'Close') +'</span>';
		}

		var rating='';
		for(var i=0; i<Math.round(data.result.rating); i++){
			rating+='<img src="img/starRating.png"/>';
		}
		var levelPrice='';
		if(data.result.price_level!==undefined){
			levelPrice='<span style="font-size: 16px;">Price level: '+data.result.price_level +'</span><br>'
		}

		$('#places').append('<div data-target="#myModal" data-toggle="modal" class="card col-3 shadow-lg p-3 bg-white rounded m-3 d-inline-block cardPlaceDetails " data-id='+data.result.place_id+'><div class="view overlay"><img class="card-img-top" src="'+url+'" alt="Card image cap" height="150px"></div><div class="card-body elegant-color white-text rounded-bottom align-bottom"><h6 class="card-title">'+data.result.name+'</h6><hr class="hr-light"><span class="card-text white-text">'+data.result.vicinity+'</span><br><br><span class="align-bottom">Estado: '+ span+'</span><div style="font-size: 16px; margin-top:16px;>'+levelPrice+'<span style="font-size: 16px;">Rating: </span>'+rating+'</div></div></div>');
		addMarkerPlaces(data.result.geometry.location, data.result.place_id);
	}
}

function addMarkerPlaces(location, id) {
	var markerPlace=new google.maps.Marker({
		position: location,
		map: mymap
	});
	markerPlace.set("id", id);
	markerPlaces.push(markerPlace);
}

function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
	  markers[i].setMap(map);
	}
}

function removeMarkerPlace(){
	for(i=0;i<markerPlaces.length;i++) {
		markerPlaces[i].setMap(null);
	} 
}

function getMarkerSelect(id){
	for(let i=0; i<markerPlaces.length;i++){
		if(markerPlaces[i].id==id && !isHover){
			markerPlaces[i].setAnimation(google.maps.Animation.BOUNCE);
			isHover=true;
			markeTemp=markerPlaces[i];
		}
	}
}

function removeHover(){
	isHover=false;
	markeTemp.setAnimation(null);
}

function launchModal(place, directions) {
	$('#myModal .modal-dialog').remove();
	$('#myModal').append('<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">'+place.result.name+'</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><h6 class="h6Modal"> Origin:</h6><p class="pModal">'+directions.routes[0].legs[0].start_address+'</p><br><h6 class="h6Modal"> Destination:</h6> <p class="pModal">'+directions.routes[0].legs[0].end_address+'</p><br><h6 class="h6Modal"> Distance: </h6><p class="pModal">'+directions.routes[0].legs[0].distance.text+'</p><h6 class="h6Modal"> Duration: </h6><p class="pModal">'+directions.routes[0].legs[0].duration.text+'</p></div><div class="modal-footer"><a  class="btn btn-primary" target="_blank" rel="noopener noreferrer" href="'+place.result.url+'">Link</a><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div></div></div>');
}