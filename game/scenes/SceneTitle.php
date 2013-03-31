<?php
	include "../src/SceneFunctions.php";

	function startScene(){
		addImage("bg", "res/img/testtitle_bg.png", 0, 0, 1);
		addImage("title", "res/img/testtitle.png", 25, 25, 2);
		addListWindow("win", '[["New Game","Load Game", "Options"]]', "[1,3]", 210, 160, 200, 280, 2, 170, 30);
		
		addEvent("win_up","keynewpress_38" ,'[["change_select_index","win",function(ix){ return (ix+1)%3+1; }]]');
		addEvent("win_down","keynewpress_40" ,'[["change_select_index","win",function(ix){ return (ix)%3+1; }]]');
		addTriggerKey(40);
		addTriggerKey(38);
		
		addEvent("confirm","keynewpress_13" ,'[["if",  [[["select_index",-1 ,function(ix){ return ix == 1;}]]]  ], ["change_scene","map"], ["else"], ["load_game", 1], ["end"]]', "[]", "win");
		addTriggerKey(13);
	}
	
	function updateScene(){
		standardUpdate();
	}
	
	function endScene(){
		standardEnd();
	}
	
	executeScene();
?>