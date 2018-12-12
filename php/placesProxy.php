<?php
	if(isset($_GET['lat']) && isset($_GET['lng']) && isset($_GET['type']) && isset($_GET['key'])){
		$latitude=$_GET['lat'];
		$longitude=$_GET['lng'];
		$type=$_GET['type'];
		$radius=$_GET['radius'];
		$BASE_URL="https://maps.googleapis.com/maps/api/place/nearbysearch/xml?location=";
		$API_KEY ="&key=".$_GET['key'];
		$url=$BASE_URL.$latitude.','.$longitude."&radius=".$radius."&type=".$type.$API_KEY;
		echo file_get_contents($url);
	}
?>