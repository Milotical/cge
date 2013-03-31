<?php
	if(array_key_exists("mapID", $_POST)){
		switch($_POST["mapID"]){
			case "1" :
				include("../scenes/maps/Map01.php");
				break;
			case "2" :
				include("../scenes/maps/Map02.php");
				break;
		}
	}
?>