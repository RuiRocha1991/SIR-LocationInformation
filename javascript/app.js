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
	var template = document.getElementById("carouselTemplate").innerHTML;
	Mustache.parse(template);   // optional, speeds up future uses
	var rendered = Mustache.render(template, data);
	var membercontent = document.getElementById("carouselContentID");
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