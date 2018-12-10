 function initVariables(){
	 
    $(document).ready(function(){
		$("#mapid").css("height","250px");
    	$('#mapid').hover(function(){
			$('#mapid').css("height","835px");
			},function(){
				$('#mapid').css("height","250px");
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
			}else{
				$(this).find('.icon').addClass('iconHover');
				typesSelected.push($(this).find('i')[0].id);
				getPlaces(locationSelected);
			}			
		});
		var slider = document.getElementById("controlRadius");
		document.getElementById('labelRange').innerHTML=slider.value+' meters';
		radius=slider.value;
		slider.oninput = function() {
			document.getElementById('labelRange').innerHTML=this.value+' meters';
			radius=this.value;
			getPlaces(locationSelected);
		}
	})
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
	var weekday = new Array(7);
		weekday[0] =  "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";
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
		$('#places').append('<div class="card col-3 shadow-lg p-3 bg-white rounded m-3 d-inline-block cardPlaceDetails "><div class="view overlay"><img class="card-img-top" src="'+url+'" alt="Card image cap" height="150px"></div><div class="card-body elegant-color white-text rounded-bottom align-bottom"><h6 class="card-title">'+data.result.name+'</h6><hr class="hr-light"><p class="card-text white-text">'+data.result.vicinity+'</p><br><span class="align-bottom">Estado: '+ span+' </span></div> <span id="loc" style="visibility: hidden;" >'+data.result.geometry.location.lat +','+data.result.geometry.location.lng+'</span></div>');
		addMarkerPlaces(data.result.geometry.location);
	}
}


function addMarkerPlaces(location) {
	markerPlaces.push(new L.marker(location));
	mymap.addLayer(markerPlaces[markerPlaces.length-1]);
}

function removeMarkerPlace(){
	for(i=0;i<markerPlaces.length;i++) {
		mymap.removeLayer(markerPlaces[i]);
	} 
}

function getMarkerSelect(location){
	for(let i=0; i<markerPlaces.length;i++){
		var loc=markerPlaces[i]._latlng.lat+','+markerPlaces[i]._latlng.lng;
		if(location==loc){
			markerPlaces[i]._shadow.height=60;
		}
	}
}