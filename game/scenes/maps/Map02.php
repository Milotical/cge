<?php
	include "../src/SceneFunctions.php";

	function startMap(){
		// Map and Tileset Data:
		?>
		this.layers = [];
		this.tileset_name		 		= "res/tilesets/Testset.png";
		this.tileset_grid_size 		= 32;
		this.tileset_zoom_factor  = 1.0;
		this.tileset_row_width 		= 8;
		this.tileset_passable 		= [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1],[1,1,1,1],[0,0,0,0],
															[0,0,0,0],[0,0,0,0]];
		
		this.map_width 					= 21*this.tileset_zoom_factor*this.tileset_grid_size;
		this.map_height 				= 21*this.tileset_zoom_factor*this.tileset_grid_size;
		
		this.layers[0] = [[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
									 [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
									 [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]];
									 
		this.layers[1] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],
									 [6,6,6,6,6,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,6],
									 [0,7,0,6,6,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,6]];
		
		this.layers[2] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,7,7,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0]];
		
		<?php
		// Events and characters:
		addChara("player", "res/chara/Poyo_chara.png", 430, 30, 1);
		
		// scrolling
		addEvent("player_scrolling", "auto", '[["scroll", function(sx, e){ return 320-e.get_chara().x-e.get_chara().get_width()/2; }, function(sy, e){ return 240-e.get_chara().y-e.get_chara().get_height()/2; }]]', '[]', "player", "true");
		
		// player walking
		addEvent("player_move_left", "keypress_37", '[["player_move", "player", "walk", [0,3,"inf"], 1, true]]', ' [[["chara_variable","player","walking",function(v){ return v != true; }]]]', "player", "true");
		addEvent("player_stop_left", "keyrelease_37", '[["player_move", "player", "stand", [], 1, false]]', '[[["facing","player",3]]]', "player", "true");
		addEvent("player_move_up", "keypress_38", '[["player_move", "player", "walk", [0,0,"inf"], 1, true]]', ' [[["chara_variable","player","walking",function(v){ return v != true; }]]]', "player", "true");
		addEvent("player_stop_up", "keyrelease_38", '[["player_move", "player", "stand", [], 1, false]]', '[[["facing","player",0]]]', "player", "true");
		addEvent("player_move_right", "keypress_39", '[["player_move", "player", "walk", [0,1,"inf"], 1, true]]', ' [[["chara_variable","player","walking",function(v){ return v != true; }]]]', "player", "true");
		addEvent("player_stop_right", "keyrelease_39", '[["player_move", "player", "stand", [], 1, false]]', '[[["facing","player",1]]]', "player", "true");
		addEvent("player_move_down", "keypress_40", '[["player_move", "player", "walk", [0,2,"inf"], 1, true]]', ' [[["chara_variable","player","walking",function(v){ return v != true; }]]]', "player", "true");
		addEvent("player_stop_down", "keyrelease_40", '[["player_move", "player", "stand", [], 1, false]]', '[[["facing","player",2]]]', "player", "true");
		
		addEvent("tp", "keynewpress_50", '[["change_map",1]]');
		
		addTriggerKey(37);
		addTriggerKey(38);
		addTriggerKey(39);
		addTriggerKey(40);
	}
	
	executeMap();
?>