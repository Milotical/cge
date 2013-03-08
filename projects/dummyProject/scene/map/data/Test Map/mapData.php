<?php
/*========================================================================================*\
 * Test Map
\*========================================================================================*/
$cge_mapGeneratorVersion = 0;
$cge_mapLastChangeDate = "08.03.2013";
$cge_mapLastChangeTime = "16:44:03";

$cge_activeTileset = "Testset";
require_once("res/tileset/$cge_activeTileset.php");

$cge_activeMapData = new MapData("Test Map", 4, 4);
$cge_activeMapData->setTileset($cge_activeTilesetObj);


/*========================================================================================*\
 * Layer 
\*========================================================================================*/
$cge_mapLayer0 = new MapLayer();
$cge_mapLayer0->addRow(array(1, 0), array(1, 0), array(1, 0), array(1, 0));
$cge_mapLayer0->addRow(array(1, 0), array(1, 0), array(1, 0), array(1, 0));
$cge_mapLayer0->addRow(array(1, 0), array(1, 0), array(1, 0), array(1, 0));
$cge_mapLayer0->addRow(array(1, 0), array(1, 0), array(1, 0), array(1, 0));

$cge_activeMapData->addLayer($cge_mapLayer0);

$cge_mapLayer1 = new MapLayer();
$cge_mapLayer1->addRow(array(0, 5), array(0, 0), array(0, 0), array(0, 0));
$cge_mapLayer1->addRow(array(0, 0), array(0, 0), array(0, 0), array(0, 0));
$cge_mapLayer1->addRow(array(0, 0), array(0, 0), array(0, 0), array(0, 0));
$cge_mapLayer1->addRow(array(0, 0), array(0, 0), array(0, 0), array(0, 0));


/*========================================================================================*\
 * Objects/Sprites
\*========================================================================================*/
?>