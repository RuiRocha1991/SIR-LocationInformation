<?php
	if(isset($_GET['place']) ){
        $place=$_GET['place'];
        echo "<script>console.log( 'Debug Objects: " . $place . "' );</script>";
		$BASE_URL="https://maps.googleapis.com/maps/api/place/details/json?placeid=";
		$API_KEY ="&key=AIzaSyAPwAin8WQ_Ous1cp9MLAKZW-SAmYHsPpQ";
		$url=$BASE_URL.$place."&fields=name,rating,formatted_phone_number".$API_KEY;
		echo file_get_contents($url);
	}
?>