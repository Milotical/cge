<?php
function cge_getString($string){
	global $cge_defaultLog;
	
	$strings = array("title" => "Canvas Game Engine",
					 "lang" => "English",
					 "Version" => "Version",
					 "version" => "version",
					 "File" => "File",
					 "Send Feedback" => "Send Feedback"
	);
	
	if(isset($strings[$string])){
		return $strings[$string];
	}else{
		//TODO: Fix logging missing strings!
		$cge_defaultLog->logWarning("Missing string: \"" . $string . "\" (" . $strings["lang"] . ")");
		return $string;
	}
}

function cge_print($string){
	echo cge_getString($string);
}
?>