<?php

$content = '
Blaaah
';


$projectListWindow = new Window("cge_ProjectTileset", cge_getString('Tileset'), $content, $cge_editorBasePath);
$projectListWindow->setTop(24);
$projectListWindow->setLeft(24);
$projectListWindow->setWidth(300);
$projectListWindow->setHeight(600);
$projectListWindow->setHeaderColor("green");
//$projectListWindow->setPositionAnchor('center');
$projectListWindow->printWindow();
?>