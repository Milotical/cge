<?php 
$nav = new NavigationTop();
$nav->addItem("Project", cge_getString("Project"), "javascript:()", "");
	$nav->addSubMenuToItem("Project", cge_getString("New"), "cge_loadWinodw('cge_NewProjectWindow')", "cge_new");
	$nav->addSubMenuToItem("Project", cge_getString("Properties"), "cge_loadWinodw('cge_ProjectProperties')", "cge_config");
	$nav->addSubMenuToItem("Project", cge_getString("Close"), "cge_unloadProject()", "cge_close");
	
$nav->addItem("Map", cge_getString("Map"), "javascript:()", "");
	$nav->addSubMenuToItem("Map", cge_getString("New Map"), "javascript:()", "cge_new");
	$nav->addSubMenuToItem("Map", cge_getString("Delete Map"), "javascript:()", "cge_delete");
	$nav->addSubMenuToItem("Map", cge_getString("Close Map"), "javascript:()", "cge_close");
	
$nav->addItem("Window", "Window", "javascript:()", "");
	$nav->addSubMenuToItem("Window", cge_getString("Log"), "cge_openWindow('cge_Log')", "", "cge_EditorWindowHandler_cge_Log");
	$nav->addSubMenuToItem("Window", cge_getString("Project List"), "cge_loadWinodw('cge_ProjectListWindow')", "", "cge_EditorWindowHandler_cge_ProjectListWindow");
	$nav->addSubMenuToItem("Window", cge_getString("Tileset"), "cge_openWindow('cge_ProjectTileset')", "", "cge_EditorWindowHandler_cge_ProjectTileset");
	$nav->addSubMenuToItem("Window", cge_getString("Send Feedback"), "cge_openWindow('cge_Feedback')", "", "cge_EditorWindowHandler_cge_Feedback");
?>