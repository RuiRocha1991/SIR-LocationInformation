<?php
	if(isset($_GET['reference']) ){
        $reference=$_GET['reference'];
		$BASE_URL="https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=";
        $API_KEY ="&key=AIzaSyAPwAin8WQ_Ous1cp9MLAKZW-SAmYHsPpQ";
		$url=$BASE_URL.$reference.$API_KEY ;
		echo file_get_contents($url);
	}
?>