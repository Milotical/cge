<?php
	if(array_key_exists("sources", $_POST) && array_key_exists("ids", $_POST)){
		foreach($_POST["ids"] as $i => $id){
			$source = $_POST["sources"][$i];
			echo 'main.database["'.$id.'"] = [];';
			if(file_exists("../data/".$source)){
				$file = file("../data/".$source);
				$attributes = explode(";", $file[0]);
				for($i=1; $i < sizeof($file); $i++){
					$line = $file[$i];
					$csv = explode(";", $file[$i]);
					echo 'var o = new Object;';
					for($j=0; $j < sizeof($attributes)-1; $j++){
						echo 'o.'.$attributes[$j].' = "'.$csv[$j].'";';
					}
					echo 'main.database["'.$id.'"].push(o);';
				}
			}
		}
	}
?>