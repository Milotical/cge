<?php
$cge_editorBasePath = "../";

require_once($cge_editorBasePath . "startup.php");

require_once($cge_editorBasePath . "/include/Map.php");
require_once($cge_editorBasePath . "/include/Tileset.php");

$cge_mapObj = new Map($cge_LoadedProject->getMapDirPath());

$cge_loadedMap = $cge_mapObj->getMapById($_GET["id"]);

$cge_mapTileset = Tileset::getTilesetByIdNew($cge_loadedMap["tileset"], $cge_LoadedProject->getTilesetDirPath());
$cge_mapWidth =  $cge_loadedMap["width"] * $cge_mapTileset["tileWidth"];
$cge_mapHeight =  $cge_loadedMap["height"] * $cge_mapTileset["tileHeight"];

function neg($i){
	if($i > 0){
		return -$i;
	}else{
		return $i;
	}
}

require_once($cge_editorBasePath . "/template/mapEditor.php");

$cge_MapLayerPrintWrapperElement = true;

require_once($cge_editorBasePath . "/template/mapLayer.php");
?>