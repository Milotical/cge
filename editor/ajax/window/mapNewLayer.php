<?php
$tilesetWindow = new Window($_GET["w"], cge_getString('NewLayer'), "", $cge_editorBasePath);

$tilesetWindow->setHeaderColor("purple");
$tilesetWindow->setWidth(400);
$tilesetWindow->setPositionAnchor('center');
$tilesetWindow->printHead();

require_once($cge_editorBasePath . "template/mapNewLayer.php");

$tilesetWindow->printFoot();
?>