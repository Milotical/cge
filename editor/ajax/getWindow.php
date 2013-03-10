<?php
$cge_editorBasePath = "../";

require_once($cge_editorBasePath . "startup.php");

if(isset($_GET["w"])){
	if($_GET["w"] == "cge_ProjectListWindow"){
		include_once("window/projectList.php");
	}else if($_GET["w"] == "cge_NewProjectWindow"){
		include_once("window/newProject.php");
	}else if($_GET["w"] == "cge_ProjectTileset"){
		include_once("window/projectTileset.php");
	}else{
		include_once("window/windowNotFound.php");
	}
}
?>