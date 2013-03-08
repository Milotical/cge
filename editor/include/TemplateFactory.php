<?php
class TemplateFactory {
	private $templatePath = "template/";
	private $loadedTemplateList = array();
	
	private $log = false;
	
	function __construct($templatePath = "template/"){
		$this->templatePath = $templatePath;
	}
	
	public function setLog($logObj){
		$this->log = $logObj;
	}
	
	public function isTemplate($path){
		$fullPath = $this->templatePath . $path;
		
		if(file_exists($fullPath)){
			if($this->log != false){
				$this->log->logMessage("Loaded template: \"$fullPath\"");
			}
			
			return true;
		}else{
			if($this->log != false){
				$this->log->logError("Can't load template: \"$fullPath\"");
			}
			return false;
		}
	}
}
?>