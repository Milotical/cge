<?php
$tId = $_GET["w"];
$tName = "Error Details";
$tContent = 'Window id: "' . $_GET["w"] . '"<br />
Caused by: "editor/ajax/getWindow.php"<br />
Time: ' . date("d.m.Y") . ' at ' . date("H:i:s");

if(isset($_GET["o"])){
	$tContent .= '<br />
Options: ';
	$first = true;
	foreach($_GET["o"] as $key => $val){
		if($first){
			$first = false;
		}else{
			$tContent .= '; ';
		}
		$tContent .= '"' . $key . '" => ' . $val;
	}
}

$tilesetWindow = new Window($_GET["w"], cge_getString('Error'), "", $cge_editorBasePath);
$tilesetWindow->setWidth(600);
$tilesetWindow->setHeaderColor("red");
$tilesetWindow->setPositionAnchor('center');
$tilesetWindow->printHead();
cge_print('WindowNotFound');
require_once($cge_editorBasePath . "template/toggle.php");
$tilesetWindow->printFoot();
?>