<?php 
function mapListAppend($pVar, $id){
	$out = "";
	if(!isset($pVar["folderName"])){
		foreach($pVar as $map){
			$id++;
			if(isset($map["name"])){
				$out .= '
				<li onclick="cge_EditorLoadMap(\'' . $map["id"] . '\');">' . $map["name"] . '</li>';
			}else if(isset($map[0]["folderName"])){
				$out .= '<ul class="cge_MapList cge_MapListFolder" id="cge_mapList' . $id . '"><span onclick="cge_EditorMapListToggle(\'' . $id . '\');">' . $map[0]["folderName"] . '</span>';
				unset($map[0]);
				$out .= mapListAppend($map, ($id+1));
				$out .= '</ul>';
			}
		}
	}
	
	return $out;
}

?>
<ul class="cge_MapList"><?php echo mapListAppend($mapList["root"], 0); ?></ul>