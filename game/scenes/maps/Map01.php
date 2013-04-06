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
		this.tileset_passable 		= [[0,0,0,0],
															[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0],
															[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
															[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
															[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
															[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
															[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
															[1,1,1,1],[1,1,1,1],[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
															[1,1,1,1],[1,1,1,1],[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
															[1,1,1,1],[1,1,1,1],[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
															[0,0,0,0],[0,0,0,0]];
		
		this.map_width 					= 21*this.tileset_zoom_factor*this.tileset_grid_size;
		this.map_height 				= 21*this.tileset_zoom_factor*this.tileset_grid_size;
		
		this.layers[0] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [39,39,39,39,39,39,39,40,9,9,9,38,39,39,39,39,9,9,9,9,9],
									 [39,39,39,39,39,39,39,40,9,9,9,38,39,39,39,39,9,9,9,9,9],
									 [39,39,39,39,39,39,39,40,9,9,9,38,39,39,39,39,9,9,9,9,9],
									 [39,39,39,39,39,53,47,48,9,9,9,38,39,39,39,39,9,9,9,9,9],
									 [39,39,39,39,39,40, 9, 9,9,9,9,38,39,39,39,39,9,9,9,9,9],
									 [47,47,47,47,47,48, 9, 9,9,9,9,38,39,39,39,39,9,9,9,9,9],
									 [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
									 [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
									 [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
									 [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
									 [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
									 [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
									 [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
									 [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]];
		
		this.layers[1] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [49,50,51,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [57,58,59,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [65,66,67,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,7,0,0],
									 [0,7,0,6,6,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,6]];
		
		this.layers[2] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [41,42,43,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
									 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		
		<?php
		// Events and characters:
		addChara("player", "res/chara/Poyo_chara.png", 230, 230, 1);
		addChara("old", "res/chara/OldPoyo_chara.png", 330, 270, 1);
		
		//addEvent("talk_old", "keynewpress_13", '[["move",-1, "turn", ["towards_chara", "player"], 1], ["speak", "old_speech", ["[s=12]Hallo, ich bins, der alte Poyo.[/s]","[s=12]Ich hoffe du erinnerst dich noch an mich.[/s]"]], ["choice","old_speech","[s=12]Erinnerst du dich?[/s]"]]', '[[[ "distance", -1, "player", function(d){ return d < 46;}], ["facing_towards", "player", -1]]]', "old");
		addEvent("talk_old", "keynewpress_13", '[["move",-1, "turn", ["towards_chara", "player"], 1], '.speakEffect('old', '["[s=12]Hallo, ich bins, der alte Poyo.[/s]","[s=12]Ich hoffe du erinnerst dich noch an mich.[/s]"]').', '.choiceEffect('old', '[s=12]Erinnerst du dich?[/s]', '["[s=12]ja","[s=12]nein"]').', ["map_variable", "frozen", function(){ return false;}]]', '[[[ "distance", -1, "player", function(d){ return d < 46;}], ["facing_towards", "player", -1]]]', "old");
		
		// scrolling
		addEvent("player_scrolling", "auto", '[["scroll", function(sx, e){ return 320-e.get_chara().x-e.get_chara().get_width()/2; }, function(sy, e){ return 240-e.get_chara().y-e.get_chara().get_height()/2; }]]', '[]', "player", "true");
		
		// player walking
		addEvent("player_move_left", "keypress_37", '[["player_move", "player", "walk", [0,3,"inf"], 1, true]]', ' [[["chara_variable","player","walking",function(v){ return v != true; }], ["map_variable","frozen",function(v){ return v != true; }]]]', "player", "true");
		addEvent("player_stop_left", "keyrelease_37", '[["player_move", "player", "stand", [], 1, false]]', '[[["facing","player",3]]]', "player", "true");
		addEvent("player_move_up", "keypress_38", '[["player_move", "player", "walk", [0,0,"inf"], 1, true]]', ' [[["chara_variable","player","walking",function(v){ return v != true; }], ["map_variable","frozen",function(v){ return v != true; }]]]', "player", "true");
		addEvent("player_stop_up", "keyrelease_38", '[["player_move", "player", "stand", [], 1, false]]', '[[["facing","player",0]]]', "player", "true");
		addEvent("player_move_right", "keypress_39", '[["player_move", "player", "walk", [0,1,"inf"], 1, true]]', ' [[["chara_variable","player","walking",function(v){ return v != true; }], ["map_variable","frozen",function(v){ return v != true; }]]]', "player", "true");
		addEvent("player_stop_right", "keyrelease_39", '[["player_move", "player", "stand", [], 1, false]]', '[[["facing","player",1]]]', "player", "true");
		addEvent("player_move_down", "keypress_40", '[["player_move", "player", "walk", [0,2,"inf"], 1, true]]', ' [[["chara_variable","player","walking",function(v){ return v != true; }], ["map_variable","frozen",function(v){ return v != true; }]]]', "player", "true");
		addEvent("player_stop_down", "keyrelease_40", '[["player_move", "player", "stand", [], 1, false]]', '[[["facing","player",2]]]', "player", "true");
		
		// teleport to other map
		addEvent("tp", "keynewpress_50", '[["change_map",2]]');
		
		addEvent("save", "keynewpress_83", '[["save_game",1]]');
		
		addTriggerKey(13);
		addTriggerKey(37);
		addTriggerKey(38);
		addTriggerKey(39);
		addTriggerKey(40);
		addTriggerKey(50);
		addTriggerKey(83);
	}
	
	executeMap();
?>