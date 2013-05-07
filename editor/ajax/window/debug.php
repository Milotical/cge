<?php
require_once("../include/Tileset.php");

$tilesetWindow = new Window($_GET["w"], cge_getString('Debug'), "", $cge_editorBasePath);
$tilesetWindow->setHeaderColor("green");
$tilesetWindow->setWidth(400);
$tilesetWindow->setHeight(200);
$tilesetWindow->setLeft(348);
$tilesetWindow->setTop(24);
$tilesetWindow->setPositionAnchor('left');
$tilesetWindow->printHead();
?>

<div id="cge_EditorLogContent">

</div>

<?php 
$tilesetWindow->printFoot();
?>