<?php

$errorMessage = '
The requested window "' . $_GET["w"] . '" could not be found.<br />
If you think this is an error please contact us.
';

$projectListWindow = new Window("cge_WindowNotFound" . $_GET["w"], cge_getString('Error'), $errorMessage, $cge_editorBasePath);
$projectListWindow->setWidth(400);
$projectListWindow->setHeight(100);
$projectListWindow->setHeaderColor("red");
$projectListWindow->setPositionAnchor('center');
$projectListWindow->printWindow();
?>