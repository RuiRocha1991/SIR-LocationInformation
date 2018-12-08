<?php
	if(isset($_GET['place']) ){
        $place=$_GET['place'];
		$BASE_URL="https://maps.googleapis.com/maps/api/place/details/json?placeid=";
        $API_KEY ="&key=AIzaSyAPwAin8WQ_Ous1cp9MLAKZW-SAmYHsPpQ";
		$url=$BASE_URL.$place.'&fields=address_component,adr_address,alt_id,formatted_address,geometry,icon,id,name,permanently_closed,photo,place_id,plus_code,scope,type,url,utc_offset,vicinity,opening_hours'.$API_KEY ;
		echo file_get_contents($url);
	}
?>