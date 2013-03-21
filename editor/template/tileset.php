<?php
$cge_loadedTilesetOutput = 
'<div id="cge_tilesetContainer_' . $loadedTileset->getId() . '" class="cge_tilesetContainerWrapper cge_tilesetActive" style="width: ' . $loadedTileset->getCeiledWidth() . 'px; height:  ' . $loadedTileset->getCeiledHeight() . 'px;">
	<div class="cge_tilesetContainer" style="background: url(\'../projects/' . $cge_LoadedProject->getName() . '/res/tileset/' . $loadedTileset->getFilename() . '\') no-repeat; width: ' . $loadedTileset->getCeiledWidth() . 'px; height:  ' . $loadedTileset->getCeiledHeight() . 'px;">';	

$cge_loadedTilesetOutput .= '<div class="cge_tilesetSelectionHelper" style="width: ' . $loadedTileset->getCeiledWidth() . 'px; height:  ' . $loadedTileset->getCeiledHeight() . 'px;">';
for($y = 0; $y < $loadedTileset->getRows(); $y++){
	for($x = 0; $x < $loadedTileset->getColumns(); $x++){
		$cge_loadedTilesetOutput .= '
		<span class="cge_tilesetSelectTile" style="width: ' . $loadedTileset->getTileSizeX() . 'px; height: ' . $loadedTileset->getTileSizeY() . 'px;">
			<span class="cge_tilesetTileInfo">' . $x . ';' . $y . ';</span>
		</span>';
	}	
}
$cge_loadedTilesetOutput .= '</div>
<div class="cge_tilesetGrid" style="width: ' . ($loadedTileset->getCeiledWidth() + 2). 'px; height:  ' . $loadedTileset->getCeiledHeight() . 'px;">
';

for($y = 0; $y < $loadedTileset->getRows(); $y++){
	for($x = 0; $x < $loadedTileset->getColumns(); $x++){
		$cge_loadedTilesetOutput .= '
		<div class="cge_tilesetTile" style="width: ' . $loadedTileset->getTileSizeX() . 'px; height: ' . $loadedTileset->getTileSizeY() . 'px;"></div>';
	}	
}


$cge_loadedTilesetOutput .= '
		</div>
	</div>
	
	<span class="cge_EditorData cge_tilesizeX">' . $loadedTileset->getTileSizeX() . '</span>
	<span class="cge_EditorData cge_tilesizeY">' . $loadedTileset->getTileSizeY() . '</span>
</div>
';
?>