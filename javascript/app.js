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
		$('#places').append('<div class="card col-3 shadow-lg p-3 bg-white rounded m-3 d-inline-block cardPlaceDetails "><div class="view overlay"><img class="card-img-top" src="'+url+'" alt="Card image cap" height="150px"></div><div class="card-body elegant-color white-text rounded-bottom" style="height:100%"; ><h6 class="card-title teste">'+data.result.name+'</h6><hr class="hr-light"><p class="card-text white-text">'+data.result.vicinity+'</p><p>Localização: <a href="">'+data.result.geometry.location.lat +", "+data.result.geometry.location.lng +'</a></p><p style="margin-bottom: 5px";>Estado: <span>'+ (data.result.opening_hours.open_now? 'Aberto': 'Fechado') +'</span></p></div></div>');

	}
}