<?php
	if(array_key_exists("sceneID", $_POST)){
		switch($_POST["sceneID"]){
			case "title" :
				include("../scenes/SceneTitle.php");
				break;
			case "map" :
				include("../scenes/SceneMap.php");
				break;
		}
	}
?>