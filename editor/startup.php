<?php
#Get the settings
require_once("settings.php");

#Load the log module and create instance
require_once("include/Log.php");
$cge_defaultLog = new Log($cge_LogLevel);

#Load language file. From this point on cge_getString() and cge_print() will be available
if(file_exists("lang/cge_lang_" . $cge_Language . ".php")){
	require_once("lang/cge_lang_" . $cge_Language . ".php");	
}else{
	require_once("lang/cge_lang_en.php");
	$cge_defaultLog->logError("Language file not found: \"lang/cge_lang_" . $cge_Language . ".php\"");
}

#Load template module and create instance
require_once("include/TemplateFactory.php");
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
require_once("include/Window.php");