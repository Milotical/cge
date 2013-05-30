<?php
class Resource{
	private $mResPath;
	
	public function __construct($pResPath){
		$this->mResPath = $pResPath;
	}
	
	public function __toString(){
		return $this->mResPath;
	}
	
	public function scanRes($pSubDir = ""){
		$fileList = array();
		$dirPath = $this->mResPath . "/" . $pSubDir;
		
		if($handle = opendir($dirPath)){
			while(false !== ($file = readdir($handle))){
				if($file != "." && $file != ".."){
					$tmpStat = stat($dirPath . $file);
					$tmpArray = array(	"name" => $file, 
										"pathinfo" => pathinfo($dirPath . $file),
										"size" => $this->ByteToKB($tmpStat["size"]), 
										"changed" => $tmpStat["mtime"], 
										"type" => filetype($dirPath . $file)
									);
					array_push($fileList, $tmpArray);
				}
			}
		closedir($handle);
		}
		
		return $fileList;
	}
	
	public static function GetFileIcon($file){
		if($file["type"] != "dir"){
			$ext = $file["pathinfo"]["extension"];
			
			if(in_array($ext, array("php", "html", "js", "css", "htm"))){
				return "config";
			}
			
			if(in_array($ext, array("png", "bmp", "jpg", "gif", "tga"))){
				return "image";
			}
			
			if($ext == "json"){
				return "data";
			}
		}else{
			return "folder";
		}
		
		return "new";
	}
	
		public static function GetFileTypeDescription($file){
			if($file["type"] == "dir"){
				return "directory";
			}
			
			$ext = $file["pathinfo"]["extension"];
			
			if(in_array($ext, array("png", "bmp", "jpg", "gif", "tga"))){
				return "image";
			}
			
			if(in_array($ext, array("php", "html", "js", "css", "htm"))){
				return "script";
			}
			
			if($ext == "json"){
				return "data";
			}
			
			if($ext == "txt"){
				return "text";
			}
			
			return "file";
		}
	
	public static function ByteToMB($pByte){
		return $pByte/1048576;
	}
	
	public static function ByteToKB($pByte){
		return $pByte/1024;
	}
}
?>