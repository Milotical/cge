<?php

$errorMessage = '
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


$projectListWindow = new Window("cge_NewProjectWindow", cge_getString('New Project'), $errorMessage, $cge_editorBasePath);
$projectListWindow->setTop(24);
$projectListWindow->setLeft(24);
$projectListWindow->setWidth(600);
$projectListWindow->setHeight(400);
$projectListWindow->setHeaderColor("blue");
$projectListWindow->setPositionAnchor('center');
$projectListWindow->printWindow();
?>