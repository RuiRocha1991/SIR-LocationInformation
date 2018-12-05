<?php
	if(isset($_GET['lat']) && isset($_GET['lng']) && isset($_GET['type'])){
		$latitude=$_GET['lat'];
		$longitude=$_GET['lng'];
		$type=$_GET['type'];
		$BASE_URL="https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
		$API_KEY ="&key=AIzaSyAPwAin8WQ_Ous1cp9MLAKZW-SAmYHsPpQ";
		$url=$BASE_URL.$latitude.','.$longitude."&rankby=distance&type=".$type.$API_KEY;
		echo file_get_contents($url);
	}
?>