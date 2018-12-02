<?php
	if(isset($_GET['cityName']) ){
		$cityName=$_GET['cityName'];
		$WIKIBASEURL="http://en.wikipedia.org/w/api.php?action=query&prop=description&titles=";
		$wikiUrl=$WIKIBASEURL.$cityName."&descprefersource=central";
		echo file_get_contents("http://en.wikipedia.org/w/api.php?action=query&format=json&prop=extract&titles=London");
	}
?>