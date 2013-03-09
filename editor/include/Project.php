<?php
class Project{

	public static function getProjectList($pProjectDirectory = "../projects"){
		$projectList = array();
		
		$projectDir = opendir($pProjectDirectory);
		
		while(($file = readdir($projectDir)) !== false){
			if(file_exists($pProjectDirectory. "/" . $file . "/cge_ProjectConfig.php")){
				array_push($projectList, $file);
			}
		}
		
		return $projectList;
	}
	
	public static function dirIsProject($pDirName, $pProjectDirectory = "../projects"){
		if(file_exists($pProjectDirectory. "/" . $pDirName . "/cge_ProjectConfig.php")){
			return true;
		}else{
			return false;
		}
	}
}
?>