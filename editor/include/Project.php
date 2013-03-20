<?php
class Project{
	private $mDirectory = "../projects";
	private $mName = "";

	private $mResDir = "res";
	private $mTilesetDir = "tileset";
	
	private $mScene = array();

	private $mTileset = array();
	
	function __construct($pName, $pDirectory = "../projects"){
		$this->mName =  $pName;
		
		if(Project::dirIsProject($pName, $pDirectory)){
			$this->mDirectory = $pDirectory . '/' . $pName;
		}else{
			echo "ERROR";
			//TODO: Throw error!
		}
	}
	
	public function scanTilesets(){
		$cge_tilesetdirPath = $this->mDirectory . "/" . $this->mResDir . "/" . $this->mTilesetDir;
		if(is_dir($cge_tilesetdirPath)){
			$tilesetDir = opendir($cge_tilesetdirPath);
			
			while(($file = readdir($tilesetDir)) !== false){
				
				if(strstr($file, ".php")){
					
					$cge_activeTilesetObj = null;
					include($cge_tilesetdirPath . "/" . $file);
					if($cge_activeTilesetObj != null){
						array_push($this->mTileset, $cge_activeTilesetObj);
					}else{
						//TODO: Throw error: Corrupt tileset file!
					}
				}
			}
		}else{
			//TODO: Throw error!
		}
	}
	
	public function getTilesets(){
		return $this->mTileset;
	}
	
	public function getName(){
		return $this->mName;
	}
	
	/*========================================================================================*\
	 * Static context
	\*========================================================================================*/
	public static function getProjectList($pProjectDirectory = "../projects"){
		$projectList = array();
		
		$projectDir = opendir($pProjectDirectory);
		
		while(($file = readdir($projectDir)) !== false){
			if(Project::dirIsProject($file, $pProjectDirectory)){
				array_push($projectList, $file);
			}
		}
		
		return $projectList;
	}
	
	public static function dirIsProject($pDirName, $pProjectDirectory = "../projects"){
		//echo $pProjectDirectory. "/" . $pDirName . "/cge_ProjectConfig.php";
		if(file_exists($pProjectDirectory. "/" . $pDirName . "/cge_ProjectConfig.php")){
			return true;
		}else{
			return false;
		}
	}
}
?>