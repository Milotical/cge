<?php
class Map{
	private $mMapDir;
	
	public function __construct($pMapDir){
		$this->mMapDir = $pMapDir;
	}
	
	public function getMapById($pMapId){
		$mMapList = json_decode(file_get_contents($this->mMapDir . '/mapList.json'), true);
		
		return json_decode(file_get_contents($this->mMapDir . '/' . $mMapList[$pMapId]), true);
	}
	
	public static function getTileCount($pMap){
		return $pMap["width"] * $pMap["height"];
	}
}
?>