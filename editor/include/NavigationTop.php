<?php
class NavigationTop{
	private $item = array();
	
	function __construct(){
		
	}
	
	public function addItem($pInterntIdentifierName, $pName, $pClickEvent, $pClass = null, $pId = null){
		$this->item[$pInterntIdentifierName] = array(	"name" => $pName,
														"event" => $pClickEvent,
														"class" => $pClass,
														"id" => $pId,
														"sub" => array()
		);
	}
	
	public function addSubMenuToItem($pItemInterntIdentifierName, $pName, $pClickEvent, $pClass = null, $pId = null){
		$subItem = array("name" => $pName,
						 "event" => $pClickEvent,
						 "class" => $pClass,
						 "id" => $pId
		);
		
		array_push($this->item[$pItemInterntIdentifierName]["sub"], $subItem);
	}

	
	public function printList(){
		//var_dump($this->item);
		
		echo '<ul>';
		
		foreach($this->item as $ident => $item){
			if($item["id"] == null){
				$id = "cge_NavItem" . $ident;
			}else{
				$id = $item["id"];
			}
			echo '<li>';
			
			echo '<a href="#" onclick="' . $item["event"] . '; return false;" id="' . $id . '" class="' . $item["class"] . '">' . $item["name"] . '</a>';
			
			if(!empty($item["sub"]) && is_array($item["sub"])){
				echo '<ul class="topBarSubNavigation">';
				foreach($item["sub"] as $sub){
					echo '<li>';
					echo '<a id="' . $sub["id"] . '" href="#" onclick="' . $sub["event"] . '; return false;" class="' . $sub["class"] . '">' . $sub["name"] . '</a>';
					echo '</li>';
				}
				echo '</ul>';
			}
			
			echo '</li>';
		}
		
		echo '</ul>';
	}
}
?>