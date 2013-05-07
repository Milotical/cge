<div id="cge_projectList">

	<a href="#" onclick="cge_loadWinodw('cge_NewProjectWindow'); return false;" class="cge_projectListItem cge_plus">New Project</a>
<?php
foreach($cge_Project as $project){
?>
	<a href="?project=<?php echo $project; ?>" onclick="cge_setLoading(true);" class="cge_projectListItem cge_folder"><?php echo $project; ?></a>
<?php 
}
?>
</div>