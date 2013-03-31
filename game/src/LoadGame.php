<?php

if(array_key_exists("saveID", $_POST)){ 
	$filename = "cge_test_".$_POST["saveID"].".sav";
	$data = file_get_contents("../".$filename);
	echo $data;
}
?>