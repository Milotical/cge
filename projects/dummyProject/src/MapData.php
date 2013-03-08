<?php
class MapData {
	private $mName;
	private $mX, $mY;
	private $mLayer = array();
	private $mTileset;
	
	/**
	 * Create a MapData-object
	 * @param String $pName name of the map
	 * @param int $pX width of the map (in tiles)
	 * @param int $pY height of the map (in tiles)
	 */
	function __construct($pName, $pX, $pY){
		$this->mName = $pName;
		$this->mX = $pX;
		$this->mY = $pY;
	}
	
	public function addLayer($pLayer, $pLayerId = null){
		if(is_a($pLayer, "MapLayer")){
			if($pLayer->layerSizeFits($this->mX, $this->mY)){
				if($pLayerId === null){
					array_push($this->mLayer, $pLayer);
					return true;
				}else{
					if(!isset($this->mLayer[$pLayerId])){
						$this->mLayer[$pLayerId] = $pLayer;
						return true;
					}else{
						//TODO: Throw warning because you'd overwrite an existing layer
						return false;
					}
				}
			}else{
				//TODO: Throw warning because layer couldn't be added due to it's size not fitting
				return false;
			}
		}else{
			//TODO: Throw warning because the given object is no instance of MapLayer
			return false;
		}
	}
	
	public function setTileset($pTileset){
		if(is_a($pTileset, "Tileset")){
			$this->mTileset = $pTileset;
		}else{
			//TODO: Throw warning because the given object is no instance of Tileset
			return false;
		}
	}
	
	public function getLayer($pLayerId){
		if(isset($this->mLayer[$pLayerId])){
			return $this->mLayer[$pLayerId];
		}else{
			//TODO: Throw warning trying to get a non-existant layer
			return false;
		}
	}
	
	public function getLayerCount(){
		return count($this->mLayer);
	}
	
	public function setTilesetPath($pPath){
		$this->mTilesetPath = $pPath;
	}
}

?>