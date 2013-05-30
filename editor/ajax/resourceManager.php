<?php
$cge_editorBasePath = "../";

require_once($cge_editorBasePath . "startup.php");



require_once($cge_editorBasePath . "include/Resource.php");

$cge_ScanRes = str_replace(".", "", $_GET["res"]);

if($cge_ScanRes != ""){
	$cge_ResManagerGoUp = true;
}else{
	$cge_ResManagerGoUp = false;
}

$cge_ResManager = new Resource($cge_LoadedProject->getResPath());

$cge_ResManagerBC = array("Resource Home" => "");
$prevPathItem = "";
foreach(explode("/", $cge_ScanRes) as $bcItem){
	if($bcItem != ""){
		$cge_ResManagerBC[$bcItem] = $prevPathItem . "/" .  $bcItem;
		$prevPathItem .= "/" . $bcItem;
	}
}

$fileList = $cge_ResManager->scanRes($cge_ScanRes . "/");
require_once($cge_editorBasePath . "template/resourceManager.php");
?>