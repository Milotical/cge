<?php 
$projectListWindowContent = '<div id="cge_projectList">';

$projectListWindowContent .= '<a href="#" class="cge_projectListItem cge_plus">New Project</a>';

foreach($cge_Project as $project){
	$projectListWindowContent .= '<a href="#" class="cge_projectListItem cge_folder">' . $project . '</a>';
}

$projectListWindowContent .= '</div>';
?>