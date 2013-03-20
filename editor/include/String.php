<?php
class cge_String{
	public static function toId($pString){
		return 'cge_' . preg_replace('/\W+/','',ucwords(strtolower(strip_tags($pString))));
	}
}
?>