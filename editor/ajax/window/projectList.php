<?php
$cge_Project = Project::getProjectList($cge_editorBasePath . "../projects");


$tilesetWindow = new Window("cge_ProjectListWindow", cge_getString('Project List'), ""	, $cge_editorBasePath);
$tilesetWindow->setTop(24);
$tilesetWindow->setLeft(24);
$tilesetWindow->setWidth(600);
$tilesetWindow->setHeight(400);
$tilesetWindow->setHeaderColor("blue");
$tilesetWindow->setPositionAnchor('center');

$tilesetWindow->printHead();
include_once($cge_editorBasePath . "template/projectList.php");
$tilesetWindow->printFoot();
?>