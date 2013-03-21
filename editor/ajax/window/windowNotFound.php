<?php

$content = '' . cge_getString('WindowNotFound') . '';

$tId = $_GET["w"];
$tName = "Error details";
$tContent = 'Window id: "' . $_GET["w"] . '"<br />
Caused by: "editor/ajax/getWindow.php"<br />
Time: ' . date("d.m.Y") . ' at ' . date("H:i:s");
eval('$content .= \'' . file_get_contents($cge_editorBasePath . "template/toggle.php") . '\';');

$tilesetWindow = new Window($_GET["w"], cge_getString('Error'), $content, $cge_editorBasePath);
$tilesetWindow->setWidth(600);
$tilesetWindow->setHeaderColor("red");
$tilesetWindow->setPositionAnchor('center');
$tilesetWindow->printWindow();
?>