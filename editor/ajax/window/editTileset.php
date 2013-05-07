<?php
require_once("../include/Tileset.php");

$cge_LoadedProject->scanTilesets();
$cge_LoadedProject->scanTilesetRes();
$projectTileset = $cge_LoadedProject->getTilesets();
$loadedTileset = Tileset::getTilesetById($projectTileset, $_GET["o"][0]);

$content = '
<div class="cge_editorForm>
	<form onsubmit="return false;">
		<div class="cge_editorFormRow">
			<label for="cge_editTilesetName" class="cge_editorLabel">' . cge_getString('Name') . '</label>
			<input type="text" id="cge_editTilesetName" name="cge_editTilesetName" class="cge_text" value="' . $loadedTileset->getName() . '" />
		</div>
		
		<div class="cge_editorFormRow">
			<label for="cge_editTilesetFile" class="cge_editorLabel">' . cge_getString('Resource') . '</label>
			<select id="cge_editTilesetFile" name="cge_editTilesetFile" class="cge_select">';

		foreach($cge_LoadedProject->getTilesetRes() as $res){
			echo '';
		}

$content .= '
			</select>
		</div>
	
		<input type="submit" class="cge_btn" value="' . cge_getString('Confirm') . '" />
	</form>
</div>
';

$tilesetWindow = new Window($_GET["w"], cge_getString('Edit') .' ' . $loadedTileset->getName(), $content, $cge_editorBasePath);
$tilesetWindow->setHeaderColor("green");
$tilesetWindow->setWidth(600);
$tilesetWindow->setPositionAnchor('center');
$tilesetWindow->printWindow();
?>