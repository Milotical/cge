<?php
require_once("startup.php");

include("template/pageHeading.php");

$logWindow = new Window("cge_Log", "Log", $cge_defaultLog->getAll());
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