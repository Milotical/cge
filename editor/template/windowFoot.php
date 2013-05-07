		</div>
		<div style="clear: both;"></div>
	</div>
	
	<div class="cge_windowSettings"></div>
</div>

<script type="text/javascript">

<?php
	if($wAnchor):
	?>
	cge_positionWindow('<?php echo $wId; ?>','<?php echo $wAnchor; ?>', 40);<?php 
	endif;
	?>
	cge_setWindowHandlerState('<?php echo $wId; ?>', true);
</script>