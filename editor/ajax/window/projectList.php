<?php
$cge_Project = Project::getProjectList($cge_editorBasePath . "../projects");

include_once($cge_editorBasePath . "template/projectList.php");

$tilesetWindow = new Window("cge_ProjectListWindow", cge_getString('Project List'), $projectListWindowContent, $cge_editorBasePath);
$tilesetWindow->setTop(24);
$tilesetWindow->setLeft(24);
$tilesetWindow->setWidth(600);
$tilesetWindow->setHeight(400);
$tilesetWindow->setHeaderColor("blue");
$tilesetWindow->setPositionAnchor('center');
$tilesetWindow->printWindow();
?>