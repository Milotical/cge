<div id="<?php echo $wId; ?>" class="cge_EditorWindow"<?php echo $wStyles; ?>>
	<header class="cge_EditorWindowHeader<?php echo $wHeaderColorClass; ?>">
		<h2 class="cge_EditorWindowHeaderTitle"><?php echo $wTitle; ?></h2>
		<div class="cge_EditorWindowControlPane">
			<a href="javascript: cge_maximizeWindow('<?php echo $wId; ?>');" class="cge_btn cge_btn_icon cge_maximize" title="Maximize <?php echo $wTitle; ?>"></a><a href="javascript: cge_closeWindow('<?php echo $wId; ?>');" class="cge_btn cge_btn_icon cge_close" title="Close <?php echo $wTitle; ?>"></a>
		</div>
	</header>
	
	<div class="cge_EditorWindowContent">
		<?php echo $wContent; ?>
	</div>
	
	<div class="cge_windowSettings"></div>
</div>

<script type="text/javascript">

<?php
	if($wAnchor):
	?>
	cge_positionWindow('<?php echo $wId; ?>','<?php echo $wAnchor; ?>', 26);<?php 
	endif;
	?>
	cge_setWindowHandlerState('<?php echo $wId; ?>', true);
</script>