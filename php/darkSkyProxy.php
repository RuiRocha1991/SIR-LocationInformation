<?php
	if(isset($_GET['lat']) && isset($_GET['lng'])){
		$latitude=$_GET['lat'];
		$longitude=$_GET['lng'];
		$DARKSKY_BASE_URL="https://api.darksky.net/forecast/";
		$DARKSKY_API_KEY ="";
		$darksky_url=$DARKSKY_BASE_URL.$DARKSKY_API_KEY.'/'.$latitude.','.$longitude."?units=si";
		echo file_get_contents($darksky_url);
	}
?>

