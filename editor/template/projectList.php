<?php 
$projectListWindowContent = '<div id="cge_projectList">';

$projectListWindowContent .= '<a href="#" onclick="cge_loadWinodw(\'cge_NewProjectWindow\'); return false;" class="cge_projectListItem cge_plus">New Project</a>';

foreach($cge_Project as $project){
	$projectListWindowContent .= '<a href="?project=' . $project . '" onclick="cge_setLoading(true);" class="cge_projectListItem cge_folder">' . $project . '</a>';
}

$projectListWindowContent .= '</div>';
?>