<?php

$content = '
<div class="cge_editorForm>
	<form onsubmit="return false;">
		<div class="cge_editorFormRow">
			<label for="cge_newProjectName" class="cge_editorLabel">' . cge_getString('Name') . '</label>
			<input type="text" id="cge_newProjectName" name="cge_newProjectName" class="cge_text" />
		</div>
		
		<div class="cge_editorFormRow">
			<label for="cge_newProjectAuthor" class="cge_editorLabel">' . cge_getString('Author') . '</label>
			<input type="text" id="cge_newProjectAuthor" name="cge_newProjectAuthor" class="cge_text" />
		</div>
	
		<input type="submit" class="cge_btn" value="' . cge_getString('Create Project') . '" />
	</form>
</div>
';


$tilesetWindow = new Window("cge_NewProjectWindow", cge_getString('New Project'), $content, $cge_editorBasePath);
$tilesetWindow->setTop(24);
$tilesetWindow->setLeft(24);
$tilesetWindow->setWidth(500);
$tilesetWindow->setHeaderColor("blue");
$tilesetWindow->setPositionAnchor('center');
$tilesetWindow->printWindow();
?>