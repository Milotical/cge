<?php
	include "../src/SceneFunctions.php";

	function startScene(){
		loadMap();
	}

	function updateScene(){
		mapUpdate();
	}
	
	function endScene(){
		mapEnd();
	}
	
	executeScene();
?>