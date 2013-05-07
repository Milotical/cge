<?php
class Project{
	private $mDirectory = "../projects";
	private $mName = "";

	private $mResDir = "res";
	private $mSceneDir = "scene";
	private $mTilesetDir = "tileset";
	private $mMapDir = "map/data";
	
	private $mScene = array();

	private $mTileset = array();
	private $mTilesetRes = array();
	private $mMap = array();
	
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
		$cge_tilesetDirPath = $this->mDirectory . "/" . $this->mResDir . "/" . $this->mTilesetDir;
		if(is_dir($cge_tilesetDirPath)){
			$tilesetDir = opendir($cge_tilesetDirPath);
			
			while(($file = readdir($tilesetDir)) !== false){
				
				if(strstr($file, ".php")){
					
					$cge_activeTilesetObj = null;
					include($cge_tilesetDirPath . "/" . $file);
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
	
	public function scanTilesetRes(){
		$cge_tilesetDirPath = $this->mDirectory . "/" . $this->mResDir . "/" . $this->mTilesetDir;
		if(is_dir($cge_tilesetDirPath)){
			$tilesetDir = opendir($cge_tilesetDirPath);
			
			while(($file = readdir($tilesetDir)) !== false){
				if(strstr($file, ".png") || strstr($file, ".jpg") || strstr($file, ".gif")){
					array_push($this->mTilesetRes, $file);
				}
			}
		}else{
			//TODO: Throw error!
		}
	}
	
	public function scanMaps(){
		$cge_mapDirPath = $this->getMapDirPath();
		
		$this->mMap = json_decode(file_get_contents($cge_mapDirPath . '/structure.json'), true);
		return $this->mMap;
	}
	
	public function getMapDirPath(){
		return $this->mDirectory . "/" . $this->mSceneDir . "/" . $this->mMapDir;
	}
	
	public function getTilesetDirPath($stripDir = false){
		if(!$stripDir){
			return $this->mDirectory . "/" . $this->mResDir . "/" . $this->mTilesetDir;
		}else{
			$returnDir = str_replace("../../", "../", $this->mDirectory);
			return $returnDir . "/" . $this->mResDir . "/" . $this->mTilesetDir;
		}
	}
	
	public function getTilesets(){
		return $this->mTileset;
	}
	
	public function getTilesetRes(){
		return $this->mTilesetRes;
	}
	
	public function getMaps(){
		return $this->mMap;
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