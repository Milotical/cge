<?php
require_once("startup.php");

#Set up the navigation
require_once("include/NavigationTop.php");
require_once("template/NavigationTopDefault.php");

if(!isset($_SESSION["cge_loadedProject"])){
	$cge_startScript .= 'cge_loadWinodw(\'cge_ProjectListWindow\');
';
}else{
	$cge_startScript .= '
			cge_loadWinodw(\'cge_ProjectTileset\');';
	$cge_startScript .= '
			cge_loadWinodw(\'cge_ProjectMapList\');';
	$cge_startScript .= '
			cge_loadWinodw(\'cge_MapLayer\');';
	$cge_startScript .= '
			cge_loadWinodw(\'cge_Debug\');';
	$cge_startScript .= '
			cge_MapToggleGrid();';
}

include("template/pageHeading.php");

include("template/pageFooter.php");
?>