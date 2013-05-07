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
		
		case "cge_editTileset":
			include_once("window/editTileset.php");
		break;
		
		case "cge_ProjectMapList":
			include_once("window/mapList.php");
		break;
		
		case "cge_MapLayer":
			include_once("window/mapLayer.php");
		break;

		case "cge_MapNewLayer":
			include_once("window/mapNewLayer.php");
		break;
		
		case "cge_Debug":
			include_once("window/debug.php");
		break;
		
		default:
			include_once("window/windowNotFound.php");
		break;
	}
}
?>