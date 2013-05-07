<div class="cge_editorForm">
	<form onsubmit="cge_MapNewLayerCreate(); return false;">
		<div class="cge_editorFormRow">
			<label for="cge_newLayerName" class="cge_editorLabel"><?php cge_print('Name'); ?></label>
			<input type="text" id="cge_newLayerName" name="cge_newLayerName" class="cge_text" value="" />
		</div>
	
		<input type="submit" class="cge_btn" value="<?php cge_print('Confirm'); ?>" />
	</form>
</div>

<div class="cge_EditorData">

<?php 
$cge_MapLayerPrintWrapperElement = false;

$cge_loadedMap = array("id" => "CGE_MAP_TEMPLATE_NAME", "layer" => array("0" => array("id" => "-1", "name" => "CGE_LAYER_TEMPLATE_NAME", "nr" => "CGE_LAYER_TEMPLATE_KEY")));

require_once($cge_editorBasePath . "template/mapLayer.php");
?>

</div>