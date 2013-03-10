<?php

$content = cge_getString('WindowNotFound');

$projectListWindow = new Window($_GET["w"], cge_getString('Error'), $content, $cge_editorBasePath);
$projectListWindow->setWidth(400);
$projectListWindow->setHeight(80);
$projectListWindow->setHeaderColor("red");
$projectListWindow->setPositionAnchor('center');
$projectListWindow->printWindow();
?>