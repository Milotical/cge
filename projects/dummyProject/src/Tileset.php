<?php

class Tileset{
	private $mFilepath;
	private $mWidth;
	private $mHeight;
	
	private $mTileSizeX;
	private $mTileSizeY;
	
	private $mTile;
	
	function __construct($pFilepath, $pTileSizeX = null, $pTileSizeY = null, $pWidth = null, $pHeight = null){
		if(file_exists($pFilepath)){
			$this->mFilepath = $pFilepath;
			
			$this->mTileSizeX = $pTileSizeX;
			$this->mTileSizeY = $pTileSizeY;
			
			$this->mWidth = $pWidth;
			$this->mHeight = $pHeight;
			
			if($pWidth && $pHeight){
				$this->generatePathing();
			}
		}else{
			//TODO: Throw warning tileset doesn't exist
		}
	}
	
	/**
	 * Get pathing of a given tile
	 * @param int $pTileX
	 * @param int $pTileY
	 */
	public function getTilePathing($pTileX, $pTileY){
		return $this->mTile[$pTileX][$pTileY];
	}
	
	public function setTilePathing($pTileX, $pTileY, $pInTop, $pInRight, $pInBottom, $pInLeft, $pOutTop, $pOutRight, $pOutBottom, $pOutLeft){
		$this->setTilePathingIn($pTileX, $pTileY, $pInTop, $pInRight, $pInBottom, $pInLeft);
		$this->setTilePathingOut($pTileX, $pTileY, $pOutTop, $pOutRight, $pOutBottom, $pOutLeft);
		
		return $this->mTile[$pTileX][$pTileY];
	}
	
	public function setTilePathingIn($pTileX, $pTileY, $pTop, $pRight, $pBottom, $pLeft){
		$this->mTile[$pTileX][$pTileY]["in"] = array($pTop, $pRight, $pBottom, $pLeft);
		
		$this->mTile[$pTileX][$pTileY];
	}
	
	public function setTilePathingOut($pTileX, $pTileY, $pTop, $pRight, $pBottom, $pLeft){
		$this->mTile[$pTileX][$pTileY]["out"] = array($pTop, $pRight, $pBottom, $pLeft);
		
		$this->mTile[$pTileX][$pTileY];
	}
	
	private function generatePathing(){
		if($this->mWidth % $this->mTileSizeX != 0){
			//TODO: Throw warning due to not fitting sizes
		}
		
		$tileCountX = $this->mWidth / $this->mTileSizeX;
		
		if($this->mHeight % $this->mTileSizeY != 0){
			//TODO: Throw warning due to not fitting sizes
		}
		
		$tileCountY = $this->mHeight / $this->mTileSizeY;
		
		for($x = 0; $x < $tileCountX; $x++){
			for($y = 0; $y < $tileCountY; $y++){
				$this->mTile[$x][$y]["in"] = array(0, 0, 0, 0);
				$this->mTile[$x][$y]["out"] = array(0, 0, 0, 0);
			}
		}
	}
	
	/**
	 * @return the $mFilepath
	 */
	public function getMFilepath() {
		return $this->mFilepath;
	}

	/**
	 * @return the $mWidth
	 */
	public function getMWidth() {
		return $this->mWidth;
	}

	/**
	 * @return the $mHeight
	 */
	public function getMHeight() {
		return $this->mHeight;
	}

	/**
	 * @return the $mTileSizeX
	 */
	public function getMTileSizeX() {
		return $this->mTileSizeX;
	}

	/**
	 * @return the $mTileSizeY
	 */
	public function getMTileSizeY() {
		return $this->mTileSizeY;
	}

	/**
	 * @return the $mTile
	 */
	public function getMTile() {
		return $this->mTile;
	}

	/**
	 * @param string $mFilepath
	 */
	public function setMFilepath($mFilepath) {
		$this->mFilepath = $mFilepath;
	}

	/**
	 * @param int $mWidth
	 */
	public function setMWidth($mWidth) {
		$this->mWidth = $mWidth;
	}

	/**
	 * @param int $mHeight
	 */
	public function setMHeight($mHeight) {
		$this->mHeight = $mHeight;
	}

	/**
	 * @param int $mTileSizeX
	 */
	public function setMTileSizeX($mTileSizeX) {
		$this->mTileSizeX = $mTileSizeX;
	}

	/**
	 * @param int $mTileSizeY
	 */
	public function setMTileSizeY($mTileSizeY) {
		$this->mTileSizeY = $mTileSizeY;
	}

	/**
	 * @param array $mTile
	 */
	public function setMTile($mTile) {
		$this->mTile = $mTile;
	}

}

?>