<?php
	if(isset($_GET['place']) && isset($_GET['key']) ){
        $place=$_GET['place'];
		$BASE_URL="https://maps.googleapis.com/maps/api/place/details/json?placeid=";
<<<<<<< HEAD
        $API_KEY ="&key=".$_GET['key'];
=======
        $API_KEY ="&key=AIzaSyD3_KAi8uClL6LVrkN7K0PSRxJsWuvplkY";
>>>>>>> 6a72f7a9659d17ecaf4a2d4df0ca0a609e01f23d
		$url=$BASE_URL.$place.'&fields=geometry,name,photo,place_id,url,vicinity,opening_hours,rating,price_level'.$API_KEY ;
		echo file_get_contents($url);
	}
?>