<?php
require_once("../include/Tileset.php");

$content = '
<select id="cge_projectTilesetSelect" class="cge_select" onchange="cge_changeSelectedTileset(this.value);">';

$cge_LoadedProject->scanTilesets();
$projectTileset = $cge_LoadedProject->getTilesets();

foreach($projectTileset as $tileset){
	if(is_a($tileset, "Tileset")){
		$content .='
		<option value="' . $tileset->getId() . '">' . $tileset->getName() . '</option>
		';
	}
}

$content .= '</select>
<script type="text/javascript">
	cge_changeSelectedTileset(\'' . $projectTileset["0"]->getId() . '\');
</script>
';

$tilesetWindowControl = '<a href="javascript: cge_addNewTileset();" class="cge_btn cge_btn_icon cge_plus" title="Add Tileset"></a>';
$tilesetWindowControl .= '<a href="javascript: cge_editActiveTileset();" class="cge_btn cge_btn_icon cge_config" title="Configurate"></a>';
$tilesetWindowControl .= '<a href="javascript: cge_tilesetToggleGrid();" class="cge_btn cge_btn_icon cge_grid" title="Show/Hide Grid"></a>';

$tilesetWindow = new Window("cge_ProjectTileset", cge_getString('Tileset'), $content, $cge_editorBasePath);
$tilesetWindow->setTop(24);
$tilesetWindow->setLeft(24);
//$tilesetWindow->setHeight(500);
$tilesetWindow->setMinWidth(250);
$tilesetWindow->setHeaderColor("green");
$tilesetWindow->setWindowControl($tilesetWindowControl);
//$projectListWindow->setPositionAnchor('center');
$tilesetWindow->printWindow();
?>