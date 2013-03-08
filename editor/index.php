<?php
require_once("startup.php");

include("template/pageHeading.php");

$cge_Project = Project::getProjectList();
include_once("template/projectList.php");
$projectListWindow = new Window("cge_ProjectListWindow", cge_getString('Project List'), $projectListWindowContent);
$projectListWindow->setTop(24);
$projectListWindow->setLeft(24);
$projectListWindow->setWidth(600);
$projectListWindow->setHeight(400);
$projectListWindow->setHeaderColor("blue");
$projectListWindow->center(true);
$projectListWindow->printWindow();

$logWindow = new Window("cge_Log", "Log", $cge_defaultLog->getAll(true));
$logWindow->setTop(24);
$logWindow->setLeft(24);
$logWindow->setWidth(400);
$logWindow->setHeight(300);
$logWindow->setMaxHeight(300);
$logWindow->setHeaderColor("green");
$logWindow->printWindow();

eval('$feedbackForm = \'' . file_get_contents("template/feedbackForm.php") . '\';');
$logWindow = new Window("cge_Feedback", cge_getString('Send Feedback'), $feedbackForm);
$logWindow->setTop(324 + 24);
$logWindow->setLeft(24);
$logWindow->setWidth(400);
$logWindow->setHeaderColor("blue");
$logWindow->printWindow();

include("template/pageFooter.php");
?>