<?php
$cge_Project = Project::getProjectList($cge_editorBasePath . "../projects");

include_once($cge_editorBasePath . "template/projectList.php");

$projectListWindow = new Window("cge_ProjectListWindow", cge_getString('Project List'), $projectListWindowContent, $cge_editorBasePath);
$projectListWindow->setTop(24);
$projectListWindow->setLeft(24);
$projectListWindow->setWidth(600);
$projectListWindow->setHeight(400);
$projectListWindow->setHeaderColor("blue");
$projectListWindow->setPositionAnchor('center');
$projectListWindow->printWindow();
?>