<?php
$cge_editorBasePath = "../";

require_once($cge_editorBasePath . "startup.php");

require_once($cge_editorBasePath . "include/Tileset.php");

$cge_LoadedProject->scanTilesets();
$projectTileset = $cge_LoadedProject->getTilesets();

$loadedTileset = Tileset::getTilesetById($projectTileset, $_GET["t"]);
include_once($cge_editorBasePath . "template/tileset.php");
echo $cge_loadedTilesetOutput;
?>