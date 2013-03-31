<?php

function checkSaveAllowed(){
	return true;
}


if(array_key_exists("saveID", $_POST) && array_key_exists("saveData", $_POST) && checkSaveAllowed($_POST["saveID"])){ 
	$filename = "cge_test_".$_POST["saveID"].".sav";
	$data = $_POST["saveData"];
	$file = fopen("../".$filename, "w");
	fwrite($file, $data);
}
?>