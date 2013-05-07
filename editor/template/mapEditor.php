<div id="<?php echo $cge_loadedMap["id"]?>_Map" onmouseover="cge_MapToggleSelectionHelper(true);" onmouseout="cge_MapToggleSelectionHelper(false);" class="cge_Map cge_MapLoaded" style="width: <?php echo $cge_mapWidth; ?>px; height: <?php echo $cge_mapHeight;?>px; margin-left: -<?php echo $cge_mapWidth/2; ?>px; margin-top: -<?php echo $cge_mapHeight/2 + 40;?>px;">
	<span class="cge_EditorData cge_mapWidth"><?php echo $cge_loadedMap["width"]; ?></span>
	<span class="cge_EditorData cge_mapHeight"><?php echo $cge_loadedMap["height"]; ?></span>
	<span class="cge_EditorData cge_mapTileset"><?php echo $cge_loadedMap["tileset"]; ?></span>
	<span class="cge_EditorData cge_mapName"><?php echo $cge_loadedMap["name"]; ?></span>
<?php 


foreach($cge_loadedMap["layer"] as $layerKey => $mapLayer):
	unset($mapLayer["name"]);
	
?>

	<div id="<?php echo $cge_loadedMap["id"]?>_Layer<?php echo $layerKey; ?>" class="cge_MapLayer" style="width: <?php echo $cge_mapWidth; ?>px; height: <?php echo $cge_mapHeight;?>px;">
	<?php 
	foreach($mapLayer as $key => $tile):
//		if($key != "name"){
			if($tile != -1){
				$bgOffsetX = Tileset::getBackgroundOffsetX($cge_mapTileset, $tile[0]);
				$bgOffsetY = Tileset::getBackgroundOffsetX($cge_mapTileset, $tile[1]);
				$bgStyle = 'background: url(\'' . $cge_LoadedProject->getTilesetDirPath(true) . '/' . $cge_mapTileset["file"] . '\') no-repeat ' . neg($bgOffsetX) . 'px ' . neg($bgOffsetY) . 'px;';
//				echo $bgStyle;
			}else{
				$bgStyle = 'background: url(\'' . $cge_LoadedProject->getTilesetDirPath(true) . '/' . $cge_mapTileset["file"] . '\') no-repeat ' . $cge_mapTileset["tileWidth"] . 'px ' . $cge_mapTileset["tileHeight"] . 'px;';
			}
	?>
			<div id="<?php echo $cge_loadedMap["id"]?>_Layer<?php echo $layerKey; ?>_Tile<?php echo $key;?>" class="cge_MapTile" style="<?php echo $bgStyle; ?>width: <?php echo $cge_mapTileset["tileWidth"]; ?>px; height: <?php echo $cge_mapTileset["tileHeight"];?>px;">
			
			</div>
	<?php 
//		}
	endforeach;
	?>
	</div>
<?php 
	$cge_loadedMap["layer"][$layerKey]["nr"] = $layerKey;
endforeach;
?>
<div class="cge_MapGrid" style="width: <?php echo $cge_mapWidth; ?>px; height: <?php echo $cge_mapHeight;?>px;">
	<?php 
	for($i = 0; $i < Map::getTileCount($cge_loadedMap); $i++):
	?>
		<div class="cge_MapGridTile" style="width: <?php echo $cge_mapTileset["tileWidth"] - 2; ?>px; height: <?php echo $cge_mapTileset["tileHeight"] - 2;?>px;"></div>
	<?php endfor;
	?>
</div>

<div class="cge_MapSelectionHelper" style="width: 0; height: 0;">

<div class="cge_MapSelectionHelperPreview" style="background: url('<?php echo $cge_LoadedProject->getTilesetDirPath(true) . '/' . $cge_mapTileset["file"];?>') no-repeat <?php echo $cge_mapTileset["tileWidth"]; ?>px <?php echo $cge_mapTileset["tileHeight"] ?>px;">
</div>

</div>

<div onmousedown="cge_EditorStartMapEditing();" class="cge_MapEdit" style="width: <?php echo $cge_mapWidth; ?>px; height: <?php echo $cge_mapHeight;?>px;">
	<?php 
	for($i = 0; $i < Map::getTileCount($cge_loadedMap); $i++):
	?>
		<div class="cge_MapEditTile" style="width: <?php echo $cge_mapTileset["tileWidth"]; ?>px; height: <?php echo $cge_mapTileset["tileHeight"];?>px;" onmouseover="cge_MapEditorHoverTile(<?php echo $i; ?>);"></div>
	<?php endfor;
	?>
</div>

</div>