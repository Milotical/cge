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
	
$nav->addItem("View", cge_getString("View"), "javascript:()", "");
	$nav->addSubMenuToItem("View", cge_getString("Map Grid"), "cge_MapToggleGrid()", "cge_NavViewMapGrid");
	
$nav->addItem("Window", "Window", "javascript:()", "");
	$nav->addSubMenuToItem("Window", cge_getString("Project List"), "cge_loadWinodw('cge_ProjectListWindow')", "", "cge_EditorWindowHandler_cge_ProjectListWindow");
	$nav->addSubMenuToItem("Window", cge_getString("Map List"), "cge_openWindow('cge_MapListWindow')", "", "cge_EditorWindowHandler_cge_MapListWindow");
	$nav->addSubMenuToItem("Window", cge_getString("Resource Manager"), "cge_openWindow('cge_ResourceManager')", "", "cge_EditorWindowHandler_cge_ResourceManager");
	$nav->addSubMenuToItem("Window", cge_getString("Tileset"), "cge_openWindow('cge_ProjectTileset')", "", "cge_EditorWindowHandler_cge_ProjectTileset");
	$nav->addSubMenuToItem("Window", cge_getString("Layer"), "cge_openWindow('cge_MapLayer')", "", "cge_EditorWindowHandler_cge_MapLayer");
	$nav->addSubMenuToItem("Window", cge_getString("Debug"), "cge_openWindow('cge_Debug')", "", "cge_EditorWindowHandler_cge_Debug");
	$nav->addSubMenuToItem("Window", cge_getString("Send Feedback"), "cge_openWindow('cge_Feedback')", "", "cge_EditorWindowHandler_cge_Feedback");
?>