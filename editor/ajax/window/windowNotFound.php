<?php

$content = cge_getString('WindowNotFound');

$tilesetWindow = new Window($_GET["w"], cge_getString('Error'), $content, $cge_editorBasePath);
$tilesetWindow->setWidth(400);
$tilesetWindow->setHeight(80);
$tilesetWindow->setHeaderColor("red");
$tilesetWindow->setPositionAnchor('center');
$tilesetWindow->printWindow();
?>