<?php
#Start a session
session_start();

if(!isset($cge_editorBasePath)){
	$cge_editorBasePath = "";
}

#Load string module
require_once($cge_editorBasePath . "include/String.php");

#Load project module
require_once($cge_editorBasePath . "include/Project.php");

#Load a selected project
if(isset($_GET["project"]) && !isset($_SESSION["cge_loadedProject"])){
	if(Project::dirIsProject($_GET["project"])){
		$_SESSION["cge_loadedProject"] = $_GET["project"];
	}
}

#Load the project
if(isset($_SESSION["cge_loadedProject"])){
	include_once($cge_editorBasePath . "../projects/" . $_SESSION["cge_loadedProject"] . "/cge_ProjectConfig.php");
	
	$cge_LoadedProject = new Project($cge_ProjectName, $cge_editorBasePath . "../projects");
}

#Get the settings
require_once($cge_editorBasePath . "settings.php");

#Load the log module and create instance
require_once($cge_editorBasePath . "include/Log.php");
$cge_defaultLog = new Log($cge_LogLevel);

#Load language file. From this point on cge_getString() and cge_print() will be available
if(file_exists("lang/cge_lang_" . $cge_Language . ".php")){
	require_once("lang/cge_lang_" . $cge_Language . ".php");	
}else{
	require_once("lang/cge_lang_en.php");
	$cge_defaultLog->logError("Language file not found: \"lang/cge_lang_" . $cge_Language . ".php\"");
}

#Load template module and create instance
require_once($cge_editorBasePath . "include/TemplateFactory.php");
$cge_TemplateFactory = new TemplateFactory();
$cge_TemplateFactory->setLog($cge_defaultLog);

#Load database module and set up an object of it
require_once("include/Database.php");

$cge_defaultDatabase = new Database($cge_DatabaseServer, 
									$cge_DatabaseUser, 
									$cge_DatabasePassword, 
									$cge_DatabaseName);
$cge_defaultDatabase->setLog($cge_defaultLog);
$cge_defaultDatabase->connect();

#Load window module
require_once($cge_editorBasePath . "include/Window.php");

#Setup variables
$cge_startScript = "";