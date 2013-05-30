<?php
class cge_String{
	public static function toId($pString){
		return 'cge_' . preg_replace('/[^a-zA-Z0-9_]/','',ucwords(strtolower(strip_tags($pString))));
	}
	
	public static function stripExtension($pFilename){
		return preg_replace("/\.[^$]*/","",$filename);
	}
	
	public static function getDate($date){
		return date("d.m.y", $date);
	}
}
?>