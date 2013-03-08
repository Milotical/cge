<?php

class Tileset{
	private $mFilepath;
	private $mWidth;
	private $mHeight;
	
	private $mTileSizeX;
	private $mTileSizeY;
	
	function __construct($pFilepath, $pTileSizeX = null, $pTileSizeY = null, $pWidth = null, $pHeight = null){
		if(file_exists($pFilepath)){
			$this->mFilepath = $pFilepath;
			
			$this->mTileSizeX = $pTileSizeX;
			$this->mTileSizeY = $pTileSizeY;
			
			$this->mWidth = $pWidth;
			$this->mHeight = $pHeight;
		}else{
			//TODO: Throw warning tileset doesn't exist
		}
	}
}

?>