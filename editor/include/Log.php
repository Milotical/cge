<?php
class Log{
	//TODO: Implement file support
	
	private $logLevel = 2;
	private $logFile;
	private $message = array();
	
	private $logType = array("0" => "Error",
						   "1" => "Warning",
						   "2" => "Message",
						   "3" => "Debug");
	
	public function __construct($logLevel = 2, $writeToFile = false, $logFile = ""){
		$this->logLevel = $logLevel;
	}
	
	public function logError($message){
		$this->addLog($message, 0);
	}
	
	public function logWarning($message){
		$this->addLog($message, 1);
	}
	
	public function logMessage($message){
		$this->addLog($message, 2);
	}
	
	public function logD($message){
		$this->addLog($message, 3);
	}
	
	public function getAll($pWrapHTML = false, $pMaxLevel = 3){
		$out = "";
		foreach($this->message as $l){
			if($pMaxLevel >= $l["level"]){
				if($pWrapHTML){
					$out .= '<span class="cge_Log cge_Log' . $this->logType[$l["level"]] . '">';
				}
				
				$out .= "[" . $l["time"] . "] (" . $this->logType[$l["level"]] . "): " . $l["message"] . "\n";
				
				if($pWrapHTML){
					$out .= '</span>';
				}
			}
		}
		
		return $out;
	}
	
	public function printAll($pWrapHTML = false, $pMaxLevel = 3){
		echo $this->getAll($pWrapHTML, $pMaxLevel);
	}
	
	private function addLog($message, $level){
		if($this->logLevel >= $level){
			$newLogMessage = array(
				"message" => $message,
				"level" => $level,
				"time" => date("d.m.Y h:i:s")
			);
			
			array_push($this->message, $newLogMessage);
		}
	}
}
?>