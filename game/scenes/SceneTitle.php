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
		
		addEvent("load_data", "start_scene", '[["load_database", ["items"], ["items.csv"]]]');
		
		?>
		/*var img = new CGE_Choice_Bubble("cb", "Was geht?", ["nix", "alles"], this.main.sprites_data, 200, 100, 20, 0, 0, 200, 200, 10, [30,60], 10, "res/style/cursor.png", 35, 34, [-30,0], "res/style/icons.png", 4, 3, 88, 66, null, null, null, null, null, 1);
		this.main.sprites_data.add_image(img);
		this.images.push(img.id);*/
		<?php
	}
	
	function updateScene(){
		standardUpdate();
	}
	
	function endScene(){
		standardEnd();
	}
	
	executeScene();
?>