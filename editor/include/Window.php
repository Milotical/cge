<?php
class Window{
	private $top, $left, $right, $bottom;
	
	private $id, $title, $content;
	
	private $width, $height, $maxWidth, $maxHeight, $minWidth, $minHeight;
	
	private $mPositionAnchor = false;
	
	private $headerColor;
	
	private $mBasePath;
	
	function __construct($pId, $pTtitle, $pContent, $pBasePath = ""){
		$this->id = $pId;
		$this->title = $pTtitle;
		$this->content = $pContent;
		
		$this->mBasePath = $pBasePath;
	}
	
	public function printWindow(){
		$style = '';
		
		$wId = $this->id;
		$wTitle = $this->title;
		$wContent = $this->content;
		
		if(isset($this->top)){
			$style .= 'top: ' . $this->top . 'px;';
		}
		
		if(isset($this->left)){
			$style .= 'left: ' . $this->left . 'px;';
		}
		
		if(isset($this->right)){
			$style .= 'right: ' . $this->right . 'px;';
		}
		
		if(isset($this->bottom)){
			$style .= 'bottom: ' . $this->bottom . 'px;';
		}
		
		if(isset($this->width)){
			$style .= 'width: ' . $this->width . 'px;';
		}
		
		if(isset($this->height)){
			$style .= 'height: ' . $this->height . 'px;';
		}
		
		if(isset($this->maxWidth)){
			$style .= 'max-width: ' . $this->maxWidth . 'px;';
		}
		
		if(isset($this->maxHeight)){
			$style .= 'max-height: ' . $this->maxHeight . 'px;';
		}
		
		if(isset($this->minWidth)){
			$style .= 'min-width: ' . $this->minWidth . 'px;';
		}
		
		if(isset($this->minHeight)){
			$style .= 'min-height: ' . $this->minHeight . 'px;';
		}
		
		$wContentWrapperHeight = $this->height - 38;
		$wStyles = ' style="' . $style . '"';
		$wHeaderColorClass = "";
		if(isset($this->headerColor)){
			$wHeaderColorClass = " cge_EditorWindowHeader_" . $this->headerColor;
		}
		
		$wAnchor = $this->mPositionAnchor;
		
		include($this->mBasePath . "template/window.php");
	}
	
	public function setPositionAnchor($pAnchor, $pMargin = 26){
		$this->mPositionAnchor = $pAnchor;
	}
	
	public function center($pCenter = null){
		if($pCenter === null){
			return $this->mCenter;
		}else{
			$this->mCenter = $pCenter;
		}
	}
	
	/**
	 * @return the $top
	 */
	public function getTop() {
		return $this->top;
	}

	/**
	 * @return the $left
	 */
	public function getLeft() {
		return $this->left;
	}

	/**
	 * @return the $right
	 */
	public function getRight() {
		return $this->right;
	}

	/**
	 * @return the $bottom
	 */
	public function getBottom() {
		return $this->bottom;
	}

	/**
	 * @return the $id
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * @return the $title
	 */
	public function getTitle() {
		return $this->title;
	}

	/**
	 * @return the $content
	 */
	public function getContent() {
		return $this->content;
	}

	/**
	 * @return the $width
	 */
	public function getWidth() {
		return $this->width;
	}

	/**
	 * @return the $height
	 */
	public function getHeight() {
		return $this->height;
	}

	/**
	 * @return the $maxWidth
	 */
	public function getMaxWidth() {
		return $this->maxWidth;
	}

	/**
	 * @return the $maxHeight
	 */
	public function getMaxHeight() {
		return $this->maxHeight;
	}

	/**
	 * @return the $minWidth
	 */
	public function getMinWidth() {
		return $this->minWidth;
	}

	/**
	 * @return the $minHeight
	 */
	public function getMinHeight() {
		return $this->minHeight;
	}

	/**
	 * @return the $headerColor
	 */
	public function getHeaderColor() {
		return $this->headerColor;
	}
	
	/**
	 * @param float $top
	 */
	public function setTop($top) {
		$this->top = $top;
	}

	/**
	 * @param float $left
	 */
	public function setLeft($left) {
		$this->left = $left;
	}

	/**
	 * @param float $right
	 */
	public function setRight($right) {
		$this->right = $right;
	}

	/**
	 * @param float $bottom
	 */
	public function setBottom($bottom) {
		$this->bottom = $bottom;
	}

	/**
	 * @param float $id
	 */
	public function setId($id) {
		$this->id = $id;
	}

	/**
	 * @param string $title
	 */
	public function setTitle($title) {
		$this->title = $title;
	}

	/**
	 * @param string $content
	 */
	public function setContent($content) {
		$this->content = $content;
	}

	/**
	 * @param float $width
	 */
	public function setWidth($width) {
		$this->width = $width;
	}

	/**
	 * @param float $height
	 */
	public function setHeight($height) {
		$this->height = $height;
	}

	/**
	 * @param float $maxWidth
	 */
	public function setMaxWidth($maxWidth) {
		$this->maxWidth = $maxWidth;
	}

	/**
	 * @param float $maxHeight
	 */
	public function setMaxHeight($maxHeight) {
		$this->maxHeight = $maxHeight;
	}

	/**
	 * @param float $minWidth
	 */
	public function setMinWidth($minWidth) {
		$this->minWidth = $minWidth;
	}

	/**
	 * @param float $minHeight
	 */
	public function setMinHeight($minHeight) {
		$this->minHeight = $minHeight;
	}

	/**
	 * @param string $headerColor
	 */
	public function setHeaderColor($headerColor) {
		$this->headerColor = $headerColor;
	}


}
?>