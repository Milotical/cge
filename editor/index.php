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
}

include("template/pageHeading.php");

?>

<?php
//$logWindow = new Window("cge_Log", "Log", $cge_defaultLog->getAll(true));
//$logWindow->setTop(24);
//$logWindow->setLeft(24);
//$logWindow->setWidth(400);
//$logWindow->setHeight(300);
//$logWindow->setMaxHeight(300);
//$logWindow->setHeaderColor("green");
//$logWindow->printWindow();
//
//eval('$feedbackForm = \'' . file_get_contents("template/feedbackForm.php") . '\';');
//$logWindow = new Window("cge_Feedback", cge_getString('Send Feedback'), $feedbackForm);
//$logWindow->setTop(324 + 24);
//$logWindow->setLeft(24);
//$logWindow->setWidth(400);
//$logWindow->setHeaderColor("blue");
//$logWindow->printWindow();

include("template/pageFooter.php");
?>