<a href="#" onclick="cge_toggleContent('<?php echo $tId; ?>'); return false;" class="cge_btn cge_btn_icon_text cge_arrowDown cge_ToggleButton" id="cge_toggleButton_<?php echo $tId; ?>" title="Toggle <?php echo $tName; ?>"><?php echo $tName; ?></a>

<div class="cge_ToggleContent" id="cge_toggleContent_<?php echo $tId; ?>">
	<?php echo $tContent; ?>
</div>