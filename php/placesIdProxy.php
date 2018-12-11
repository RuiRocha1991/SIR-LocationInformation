<?php
	if(isset($_GET['place']) ){
        $place=$_GET['place'];
		$BASE_URL="https://maps.googleapis.com/maps/api/place/details/json?placeid=";
        $API_KEY ="&key=AIzaSyD3_KAi8uClL6LVrkN7K0PSRxJsWuvplkY";
		$url=$BASE_URL.$place.'&fields=geometry,name,photo,place_id,url,vicinity,opening_hours,rating,price_level'.$API_KEY ;
		echo file_get_contents($url);
	}
?>