<?php 
$reversedLayer = array_reverse($cge_loadedMap["layer"]);

//if(!isset($cge_MapLayerPrintWrapperElement)){
//	$cge_MapLayerPrintWrapperElement = true;
//}

if($cge_MapLayerPrintWrapperElement):
?>
<div class="cge_MapLayerInfo cge_MapLayerActiveWrapper">
	<?php 
endif;
	foreach($reversedLayer as $layer):
		$key = $layer["nr"];
	?>
		<div class="cge_MapLayerRow" id="<?php echo $cge_loadedMap["id"]; ?>_Layer<?php echo $key; ?>_LayerRow">
			<div class="cge_MapLayerVisibility">
				<a class="cge_btn cge_btn_icon cge_layer" title="<?php cge_print('LayerToggle'); ?>" href="#"></a>
			</div>
			<div class="cge_MapLayerName">
				<a class="cge_MapLayerNameSelect" href="#"><?php echo $layer["name"]; ?></a>
			</div>
			<span class="cge_EditorData cge_layerId"><?php echo $key; ?></span>
		</div>
	<?php 
	endforeach;
	
if($cge_MapLayerPrintWrapperElement):
	?>
</div>
<?php 
endif;
?>