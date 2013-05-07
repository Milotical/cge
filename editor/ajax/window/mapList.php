<?php
$mapList = $cge_LoadedProject->scanMaps();

$tilesetWindow = new Window("cge_MapListWindow", cge_getString('Map List'), "", $cge_editorBasePath);
$tilesetWindow->setHeaderColor("blue");
$tilesetWindow->setWidth(300);
$tilesetWindow->setHeight(600);
$tilesetWindow->setLeft(24);
$tilesetWindow->setTop(24);
$tilesetWindow->printHead();
require_once($cge_editorBasePath . "template/mapList.php");
$tilesetWindow->printFoot();
?>