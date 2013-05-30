<?php
$tilesetWindow = new Window($_GET["w"], cge_getString('Resource Manager'), "", $cge_editorBasePath);
$tilesetWindow->setWidth(800);
$tilesetWindow->setHeaderColor("yellow");
$tilesetWindow->setPositionAnchor('center');
$tilesetWindow->printHead();

require_once($cge_editorBasePath . "include/Resource.php");

$cge_ResManager = new Resource($cge_LoadedProject->getResPath());

$cge_ScanRes = "";
$fileList = $cge_ResManager->scanRes($cge_ScanRes);

$cge_ResManagerGoUp = false;

$cge_ResManagerBC = array("Resource Home" => "");
require_once($cge_editorBasePath . "template/resourceManager.php");

$tilesetWindow->printFoot();
?>