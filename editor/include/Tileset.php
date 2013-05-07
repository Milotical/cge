<?php
class Tileset{
	private $mFilepath;
	private $mFilename;
	private $mId;

	private $mName;
	
	private $mWidth;
	private $mHeight;
	
	private $mTileSizeX;
	private $mTileSizeY;
	
	private $mTile;
	
	function __construct($pFilepath, $pFilename, $pName, $pTileSizeX = null, $pTileSizeY = null, $pWidth = null, $pHeight = null){
		if(file_exists($pFilepath)){
			$this->mFilepath = $pFilepath . $pFilename;
			$this->mFilename = $pFilename;
			$this->mName = $pName;
			
			$this->mTileSizeX = $pTileSizeX;
			$this->mTileSizeY = $pTileSizeY;
			
			$this->mWidth = $pWidth;
			$this->mHeight = $pHeight;
			
			$this->mId = cge_String::toId($this->mName);
			
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
	
	public function getCeiledWidth(){
		return $this->getColumns() * $this->mTileSizeY;
	}

	public function getCeiledHeight(){
		return $this->getRows() * $this->mTileSizeX;
	}
	
	
	public function getTileCount(){
		return $this->getRows() * $this->getColumns();
	}
	
	public function getRows() {
		return ceil($this->mHeight / $this->mTileSizeY);
	}
	
	public function getColumns() {
		return ceil($this->mWidth / $this->mTileSizeX);
	}
	
	
	public function getName(){
		return $this->mName;
	}
	
	/**
	 * @return the $mFilepath
	 */
	public function getFilepath() {
		return $this->mFilepath;
	}

	/**
	 * @return the $mWidth
	 */
	public function getWidth() {
		return $this->mWidth;
	}

	/**
	 * @return the $mHeight
	 */
	public function getHeight() {
		return $this->mHeight;
	}

	/**
	 * @return the $mTileSizeX
	 */
	public function getTileSizeX() {
		return $this->mTileSizeX;
	}

	/**
	 * @return the $mTileSizeY
	 */
	public function getTileSizeY() {
		return $this->mTileSizeY;
	}

	/**
	 * @return the $mTile
	 */
	public function getTile() {
		return $this->mTile;
	}

	/**
	 * @param string $mFilepath
	 */
	public function setFilepath($mFilepath) {
		$this->mFilepath = $mFilepath;
	}

	/**
	 * @param int $mWidth
	 */
	public function setWidth($mWidth) {
		$this->mWidth = $mWidth;
	}

	/**
	 * @param int $mHeight
	 */
	public function setHeight($mHeight) {
		$this->mHeight = $mHeight;
	}

	/**
	 * @param int $mTileSizeX
	 */
	public function setTileSizeX($mTileSizeX) {
		$this->mTileSizeX = $mTileSizeX;
	}

	/**
	 * @param int $mTileSizeY
	 */
	public function setTileSizeY($mTileSizeY) {
		$this->mTileSizeY = $mTileSizeY;
	}

	/**
	 * @param array $mTile
	 */
	public function setTile($mTile) {
		$this->mTile = $mTile;
	}
	
	/**
	 * @return the $mFilename
	 */
	public function getFilename() {
		return $this->mFilename;
	}

	/**
	 * @param String $mFilename
	 */
	public function setFilename($mFilename) {
		$this->mFilename = $mFilename;
	}

	/**
	 * @return the Id
	 */
	public function getId() {
		return $this->mId;
	}
	
	
	
	
	public static function getTilesetById($pTilesetList, $pTilesetId){
		if(is_array($pTilesetList) && !empty($pTilesetList)){
			foreach($pTilesetList as $tileset){
				if(is_a($tileset, "Tileset")){
					if($tileset->getId() == $pTilesetId){
						return $tileset;
					}else{
						//TODO: Throw warning because list contains none-tilesets
					}
				}
			}
		}else{
			//TODO: Throw warning
		}
	}
	
	public static function getTilesetByIdNew($pTilesetId, $pTilesetPath){
		$mTilesetList = json_decode(file_get_contents($pTilesetPath . '/tileset.json'), true);
		return $mTilesetList[$pTilesetId];
	}
	
	public static function getBackgroundOffsetX($pTileset, $pTileX){
		return $pTileset["tileWidth"] * $pTileX;
	}
	
	public static function getBackgroundOffsetY($pTileset, $pTileY){
		return $pTileset["tileHeight"] * $pTileY;
	}
}

?>