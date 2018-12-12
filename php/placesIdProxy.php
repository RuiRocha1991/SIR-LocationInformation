<?php
	if(isset($_GET['place']) && isset($_GET['key']) ){
		$place=$_GET['place'];
		$BASE_URL="https://maps.googleapis.com/maps/api/place/details/json?placeid=";
		$API_KEY ="&key=".$_GET['key'];
		$url=$BASE_URL.$place.'&fields=geometry,name,photo,place_id,url,vicinity,opening_hours,rating,price_level'.$API_KEY ;
		echo file_get_contents($url);
	}
?>