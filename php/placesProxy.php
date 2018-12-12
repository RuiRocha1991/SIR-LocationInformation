<?php
	if(isset($_GET['lat']) && isset($_GET['lng']) && isset($_GET['type']) && isset($_GET['key'])){
		$latitude=$_GET['lat'];
		$longitude=$_GET['lng'];
		$type=$_GET['type'];
		$radius=$_GET['radius'];
<<<<<<< HEAD
		$BASE_URL="https://maps.googleapis.com/maps/api/place/nearbysearch/xml?location=";
		$API_KEY ="&key=".$_GET['key'];
=======
		$BASE_URL="https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
		$API_KEY ="&key=AIzaSyD3_KAi8uClL6LVrkN7K0PSRxJsWuvplkY";
>>>>>>> 6a72f7a9659d17ecaf4a2d4df0ca0a609e01f23d
		$url=$BASE_URL.$latitude.','.$longitude."&radius=".$radius."&type=".$type.$API_KEY;
		echo file_get_contents($url);
	}
?>