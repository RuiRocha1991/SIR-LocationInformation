<?php
	if(isset($_GET['lat']) && isset($_GET['lng']) && isset($_GET['type'])){
		$latitude=$_GET['lat'];
		$longitude=$_GET['lng'];
		$type=$_GET['type'];
		$radius=$_GET['radius'];
		$BASE_URL="https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
		$API_KEY ="&key=AIzaSyD3_KAi8uClL6LVrkN7K0PSRxJsWuvplkY";
		$url=$BASE_URL.$latitude.','.$longitude."&radius=".$radius."&type=".$type.$API_KEY;
		echo file_get_contents($url);
	}
?>