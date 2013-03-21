<?php
$cge_editorBasePath = "../";

require_once($cge_editorBasePath . "startup.php");

if(isset($_GET["w"])){
	switch ($_GET["w"]) {
		case "cge_ProjectListWindow":
			include_once("window/projectList.php");
		break;
		
		case "cge_NewProjectWindow":
			include_once("window/newProject.php");
		break;
		
		case "cge_ProjectListWindow":
			include_once("window/projectList.php");
		break;
		
		case "cge_ProjectTileset":
			include_once("window/projectTileset.php");
		break;
		
		default:
			include_once("window/windowNotFound.php");
		break;
	}
}
?>