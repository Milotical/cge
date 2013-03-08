<?php

class MapLayer {
	private $mDataList;
	
	function __construct($pDataList = array()){
		$this->mDataList = $pDataList;
	}
	
	public function addRow($pRowData){
		array_push($this->mDataList, $pRowData);
	}
	
	public  function getLayerData(){
		return $this->mDataList;
	}
	
	public function getPointData($pX, $pY){
		if(isset($this->mDataList[$pX][$pY])){
			return $this->mDataList[$pX][$pY];
		}else{
			//TODO: Throw warning because the point is empty
			return -1;
		}
	}
	
	public function getLayerTileCountX(){
		return count($this->mDataList);
	}
	
	public function getLayerTileCountY(){
		return count($this->mDataList[0]);
	}
	
	public function layerSizeFits($pX, $pY){
		if($this->getLayerTileCountX() == $pX && $this->getLayerTileCountY() == $pY){
			return true;
		}else{
			//TODO: Throw warning because the layer size doesn't fit the map size
			return false;
		}
	}
}

?>