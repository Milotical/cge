<?php
$additionalClass = "";

if($wAutoSizeWidth){
	$additionalClass .= " cge_WindowAutoSizeWidth";
}

if($wAutoSizeHeight){
	$additionalClass .= " cge_WindowAutoSizeHeight";
}
?><div id="<?php echo $wId; ?>" class="cge_EditorWindow<?php echo $additionalClass; ?>"<?php echo $wStyles; ?>>
	<header class="cge_EditorWindowHeader<?php echo $wHeaderColorClass; ?>">
		<h2 class="cge_EditorWindowHeaderTitle"><?php echo $wTitle; ?></h2>
		<div class="cge_EditorWindowControlPane">
			<?php echo $wControls;?><a href="javascript: cge_maximizeWindow('<?php echo $wId; ?>');" class="cge_btn cge_btn_icon cge_maximize" title="Maximize <?php echo $wTitle; ?>"></a><a href="javascript: cge_closeWindow('<?php echo $wId; ?>');" class="cge_btn cge_btn_icon cge_close" title="Close <?php echo $wTitle; ?>"></a>
		</div>
	</header>
	
	<div class="cge_EditorWindowContentWrapper" style="height: <?php echo $wContentWrapperHeight; ?>;">
		<div class="cge_EditorWindowContent">