/* ======================================
			CGE MAP DATA
			----------------------------------------------------------
			manages all maps
			a change to another map means changeing the content of this object
====================================== */ 

function CGE_Map_Data(main_object){
	this.main = main_object;									// assiciation to the main object 
	this.initialised = false;
	this.images = [];													// array of corresponding images
	this.events ={};													// array of corresponding events
	this.loaded = true;												// defines if map is displayed
	
	this.map_id;
}	
	
// -----------------------------------------------------------------------------------
// called of new map is loaded
// -----------------------------------------------------------------------------------
CGE_Map_Data.prototype.load_new_map = function(new_map_id){
	this.main.input_controller.refresh();
	this.unload();
	this.images = [];
	this.events = {};
	this.map_id = new_map_id;
	this.initialised = true;
	
	var charas_data = [];
	var events_data = [];
	// AJAX call for map data
	// ................
	if(new_map_id == 1){
		this.layers = [];
		this.layers[0] = [[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]];
		this.layers[1] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],[0,7,0,6,6,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,6]];
		this.layers[2] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,7,7,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0]];
		this.tileset_name = "Testset.png";
		this.tileset_grid_size = 32;
		this.tileset_zoom_factor = 1.0;
		this.tileset_row_width = 8;
		this.tileset_passable = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1],[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
		this.map_width = 21*this.tileset_zoom_factor*this.tileset_grid_size;
		this.map_height = 21*this.tileset_zoom_factor*this.tileset_grid_size;
	}
	if(new_map_id == 0){
		this.layers = [];
		this.layers[0] = [[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]];
		this.layers[1] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],[0,7,0,6,6,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,6]];
		this.layers[2] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,7,7,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0]];
		this.tileset_name = "Testset.png";
		this.tileset_grid_size = 32;
		this.tileset_zoom_factor = 1.0;
		this.tileset_row_width = 8;
		this.tileset_passable = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1],[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
		this.map_width = 21*this.tileset_zoom_factor*this.tileset_grid_size;
		this.map_height = 21*this.tileset_zoom_factor*this.tileset_grid_size;
		
		var charas_data = [];
		charas_data[0] = {"id" : "player","source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : 434, "y" : 30, "z" : 1, "face" : 2};
		charas_data[0]["moves"] = [];//[["wait",[10]],["walk",[1,1,"frames"]],["stand"]];
		charas_data[0]["blocking_classes"] = ["std"];
		
		for(var i=1; i < 0; i++){
			charas_data[i] = {"id" : i,"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : Math.random()*640, "y" : Math.random()*480, "z" : 1, "face" : 2};
			charas_data[i]["moves"] = [["walk",[5, "random", "frames"],0], ["stand",[],0], ["wait",[30],0]];
			charas_data[i]["blocking_classes"] = ["std"];
		}
		
		var events_data = [];
		
		events_data[0] = {"id" : 0, "parallel" : true, "chara" : "player"};
		events_data[0]["conditions"]  = [[["chara_variable","player","walking",function(v){ return v != true; }]]];
		events_data[0]["trigger"] = "keypress_37";
		events_data[0]["effects"] = [["player_move", "player", "walk", [0,3,"inf"], 1, true]];
		events_data[1] = {"id" : 1, "parallel" : true, "chara" : "player"};
		events_data[1]["conditions"] = [[["facing","player",3]]];
		events_data[1]["trigger"] = "keyrelease_37";
		events_data[1]["effects"] = [["player_move", "player", "stand", [], 1, false]];
		
		events_data[2] = {"id" : 2, "parallel" : true, "chara" : "player"};
		events_data[2]["conditions"]  = [[["chara_variable","player","walking",function(v){ return v != true; }]]];
		events_data[2]["trigger"] = "keypress_38";
		events_data[2]["effects"] = [["player_move", "player", "walk", [0,0,"inf"], 1, true]];
		events_data[3] = {"id" : 3, "parallel" : true, "chara" : "player"};
		events_data[3]["conditions"] = [[["facing","player",0]]];
		events_data[3]["trigger"] = "keyrelease_38";
		events_data[3]["effects"] = [["player_move", "player", "stand", [], 1, false]];
		
		events_data[4] = {"id" : 4, "parallel" : true, "chara" : "player"};
		events_data[4]["conditions"]  = [[["chara_variable","player","walking",function(v){ return v != true; }]]];
		events_data[4]["trigger"] = "keypress_39";
		events_data[4]["effects"] = [["player_move", "player", "walk", [0,1,"inf"], 1, true]];
		events_data[5] = {"id" : 5, "parallel" : true, "chara" : "player"};
		events_data[5]["conditions"] = [[["facing","player",1]]];
		events_data[5]["trigger"] = "keyrelease_39";
		events_data[5]["effects"] = [["player_move", "player", "stand", [], 1, false]];
		
		events_data[6] = {"id" : 6, "parallel" : true, "chara" : "player"};
		events_data[6]["conditions"]  = [[["chara_variable","player","walking",function(v){ return v != true; }]]];
		events_data[6]["trigger"] = "keypress_40";
		events_data[6]["effects"] = [["player_move", "player", "walk", [0,2,"inf"], 1, true]];
		events_data[7] = {"id" : 7, "parallel" : true, "chara" : "player"};
		events_data[7]["conditions"] = [[["facing","player",2]]];
		events_data[7]["trigger"] = "keyrelease_40";
		events_data[7]["effects"] = [["player_move", "player", "stand", [], 1, false]];
		
		events_data[8] = {"id" : 8, "parallel" : true, "chara" : "player"};
		events_data[8]["conditions"] = [];
		events_data[8]["trigger"] = "auto";
		events_data[8]["effects"] = [["scroll", function(sx, e){ return 320-e.get_chara().x-e.get_chara().get_width()/2; }, function(sy, e){ return 240-e.get_chara().y-e.get_chara().get_height()/2; }]];
	
		events_data[9] = {"id" : 9, "parallel" : true, "chara" : "player"};
		events_data[9]["conditions"] = [];
		events_data[9]["trigger"] = "keynewpress_13";
		events_data[9]["effects"] = [["save_game"], ["kill_game"]];
		
		events_data[10] = {"id" : 10, "parallel" : false, "chara" : 0};
		events_data[10]["conditions"] = [];
		events_data[10]["trigger"] = "keynewpress_50";
		events_data[10]["effects"] = [["change_map",2],["teleport","player",function(x){ return 0; },function(y){ return 0; }]];
		
		events_data[11] = {"id" : 11, "parallel" : false, "chara" : 0};
		events_data[11]["conditions"] = [];
		events_data[11]["trigger"] = "keynewpress_49";
		events_data[11]["effects"] = [["change_scene","title"]];
		
		this.main.input_controller.add_trigger_key(13);
		this.main.input_controller.add_trigger_key(49);
		this.main.input_controller.add_trigger_key(50);
		this.main.input_controller.add_trigger_key(37);
		this.main.input_controller.add_trigger_key(38);
		this.main.input_controller.add_trigger_key(39);
		this.main.input_controller.add_trigger_key(40);
	}
	if(new_map_id == 2){
		this.layers = [];
		this.layers[0] = [[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]];
		this.layers[1] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6],[6,6,6,6,6,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,6],[0,7,0,6,6,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,6]];
		this.layers[2] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,7,7,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0]];
		this.tileset_name = "Testset.png";
		this.tileset_grid_size = 32;
		this.tileset_zoom_factor = 1.0;
		this.tileset_row_width = 8;
		this.tileset_passable = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1],[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
		this.map_width = 21*this.tileset_zoom_factor*this.tileset_grid_size;
		this.map_height = 21*this.tileset_zoom_factor*this.tileset_grid_size;
		
		charas_data[0] = {"id" : "player","source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : 434, "y" : 30, "z" : 1, "face" : 2};
		charas_data[0]["moves"] = [];
		charas_data[0]["blocking_classes"] = ["std"];
		
		events_data[0] = {"id" : 0, "parallel" : false, "chara" : "player"};
		events_data[0]["conditions"]  = [[["chara_variable","player","walking",function(v){ return v != true; }]]];
		events_data[0]["trigger"] = "keypress_37";
		events_data[0]["effects"] = [["player_move", "player", "walk", [0,3,"inf"], 1, true]];
		events_data[1] = {"id" : 1, "parallel" : false, "chara" : "player"};
		events_data[1]["conditions"] = [[["facing","player",3]]];
		events_data[1]["trigger"] = "keyrelease_37";
		events_data[1]["effects"] = [["player_move", "player", "stand", [], 1, false]];
		
		events_data[2] = {"id" : 2, "parallel" : false, "chara" : "player"};
		events_data[2]["conditions"]  = [[["chara_variable","player","walking",function(v){ return v != true; }]]];
		events_data[2]["trigger"] = "keypress_38";
		events_data[2]["effects"] = [["player_move", "player", "walk", [0,0,"inf"], 1, true]];
		events_data[3] = {"id" : 3, "parallel" : false, "chara" : "player"};
		events_data[3]["conditions"] = [[["facing","player",0]]];
		events_data[3]["trigger"] = "keyrelease_38";
		events_data[3]["effects"] = [["player_move", "player", "stand", [], 1, false]];
		
		events_data[4] = {"id" : 4, "parallel" : false, "chara" : "player"};
		events_data[4]["conditions"]  = [[["chara_variable","player","walking",function(v){ return v != true; }]]];
		events_data[4]["trigger"] = "keypress_39";
		events_data[4]["effects"] = [["player_move", "player", "walk", [0,1,"inf"], 1, true]];
		events_data[5] = {"id" : 5, "parallel" : false, "chara" : "player"};
		events_data[5]["conditions"] = [[["facing","player",1]]];
		events_data[5]["trigger"] = "keyrelease_39";
		events_data[5]["effects"] = [["player_move", "player", "stand", [], 1, false]];
		
		events_data[6] = {"id" : 6, "parallel" : false, "chara" : "player"};
		events_data[6]["conditions"]  = [[["chara_variable","player","walking",function(v){ return v != true; }]]];
		events_data[6]["trigger"] = "keypress_40";
		events_data[6]["effects"] = [["player_move", "player", "walk", [0,2,"inf"], 1, true]];
		events_data[7] = {"id" : 7, "parallel" : false, "chara" : "player"};
		events_data[7]["conditions"] = [[["facing","player",2]]];
		events_data[7]["trigger"] = "keyrelease_40";
		events_data[7]["effects"] = [["player_move", "player", "stand", [], 1, false]];
		
		events_data[8] = {"id" : 8, "parallel" : true, "chara" : "player"};
		events_data[8]["conditions"] = [];
		events_data[8]["trigger"] = "auto";
		events_data[8]["effects"] = [["scroll", function(sx, e){ return 320-e.get_chara().x-e.get_chara().get_width()/2; }, function(sy, e){ return 240-e.get_chara().y-e.get_chara().get_height()/2; }]];
	
		events_data[9] = {"id" : 9, "parallel" : true, "chara" : "player"};
		events_data[9]["conditions"] = [];
		events_data[9]["trigger"] = "keynewpress_13";
		events_data[9]["effects"] = [["save_game"], ["kill_game"]];
		
		events_data[10] = {"id" : 10, "parallel" : true, "chara" : 0};
		events_data[10]["conditions"] = [];
		events_data[10]["trigger"] = "keynewpress_50";
		events_data[10]["effects"] = [["change_map",0],["teleport","player",function(x){ return 0; },function(y){ return 0; }]];
		
	}
	
	for(var chara in charas_data){
		this.add_chara(charas_data[chara]);
	}
	for(var event in events_data){
		this.add_event(events_data[event]);
	}
	// ..................
	this.main.set_buffer_size(this.map_width, this.map_height);
	this.loaded = true;
}

// -----------------------------------------------------------------------------------
// adds character to map (automatically adds to sprite data)
// -----------------------------------------------------------------------------------
CGE_Map_Data.prototype.add_chara = function(chara_data){
	var chara_sprite = new CGE_Character(chara_data["id"], this.main.sprites_data, chara_data["source"], chara_data["width"], chara_data["height"], chara_data["rows"], chara_data["cols"], chara_data["x"], chara_data["y"], chara_data["z"], chara_data["face"]);
	if(chara_data["moves"] != null){
		for(var i=0; i < chara_data["moves"].length; i++){
			var m = new CGE_Move(this.main.move_interpreter , chara_data["moves"][i][0], chara_data["moves"][i][1], chara_data["moves"][i][2]);
			chara_sprite.add_move(m);
		}
	}
	if(chara_data["blocking_classes"] != null){
		for(var i=0; i < chara_data["blocking_classes"].length; i++){
			if(this.main.sprites_data.spritesets[chara_data["blocking_classes"][i]] == null){
				this.main.sprites_data.create_spriteset(chara_data["blocking_classes"][i]); 
			}
			chara_sprite.add_col_spriteset(chara_data["blocking_classes"][i]);
		}
	}
	this.images.push(chara_sprite);
	this.main.sprites_data.add_image(chara_sprite);
}

CGE_Map_Data.prototype.add_event = function(event_data){
	var event = new CGE_Event(event_data["id"], this.main.event_interpreter, event_data["effects"], event_data["conditions"], event_data["parallel"], event_data["chara"]);
	this.main.trigger_data.add_map_event(event_data["trigger"], event);
	if(this.events[event_data["trigger"]] == null)
		this.events[event_data["trigger"]] = [];
	this.events[event_data["trigger"]].push(event);
}

// -----------------------------------------------------------------------------------
// unloads map (if other scene is called)
// -----------------------------------------------------------------------------------
CGE_Map_Data.prototype.unload = function(){
	for (var i in this.images){
		this.images[i].remove();
	}
	this.main.trigger_data.remove_all_map_events();
	this.loaded = false;
}

// -----------------------------------------------------------------------------------
// reloads map
// -----------------------------------------------------------------------------------
CGE_Map_Data.prototype.reload = function(){
	for (var i in this.images){
		this.main.sprites_data.add_image(this.images[i]);
	}
	for(var i in this.events){
		for(var j in this.events[i]){
			this.main.trigger_data.add_map_event(i, this.events[i][j]);
		}
	}
	this.loaded = true;
}

// -----------------------------------------------------------------------------------
// frame update
// -----------------------------------------------------------------------------------
CGE_Map_Data.prototype.update = function(ctx){
	this.draw_tiled_map(ctx);
}

// -----------------------------------------------------------------------------------
// draws tiled map
// -----------------------------------------------------------------------------------
CGE_Map_Data.prototype.draw_tiled_map = function(ctx){
	if(this.img == null){
		this.img = new Image();
		this.img.src = this.tileset_name;
	}
	for(var z=0; z < this.layers.length; z++){
		for(var y=0; y < this.layers[z].length; y++){
			for(var x=0; x < this.layers[z][y].length; x++){
				if(this.layers[z][y][x] != 0){
					var x_tileset = ((this.layers[z][y][x]-1)%this.tileset_row_width)*this.tileset_grid_size;
					var y_tileset = (parseInt((this.layers[z][y][x]-1)/this.tileset_row_width))*this.tileset_grid_size;
					var size_display = this.tileset_grid_size*this.tileset_zoom_factor;
					var x_display = x*size_display;
					var y_display = y*size_display;
					ctx.globalAlpha = 1.0;
					ctx.drawImage(this.img, x_tileset, y_tileset, this.tileset_grid_size, this.tileset_grid_size, x_display, y_display, size_display, size_display);
				}
			}
		}
		this.main.sprites_data.draw_images(ctx, z, z);
	}
}

// -----------------------------------------------------------------------------------
// returns if position on map is massable
// -----------------------------------------------------------------------------------
CGE_Map_Data.prototype.passable = function(x, y, dir){
	var gs = this.tileset_grid_size*this.tileset_zoom_factor;
	x = parseInt(x/gs);
	y = parseInt(y/gs);
	for(var z=0; z < this.layers.length; z++){
		if(this.layers[z] != null && this.layers[z][y] != null && this.layers[z][y][x] != null){
			if(this.tileset_passable[this.layers[z][y][x]] != null && this.tileset_passable[this.layers[z][y][x]][dir]==1){
				return false;
			}
		}
	}
	return true;
}

CGE_Map_Data.prototype.prepare_save = function(){
	if(this.loaded){
		this.unload();
		this.loaded = true;
	}
	for(var i=0; i < this.images.length; i++){
		this.images[i].prepare_save();
	}
	for(var i=0; i < this.events.length; i++){
		this.events[i].prepare_save();
	}
	this.main = null;
}

CGE_Map_Data.prototype.reload_save = function(main){
	for(var i=0; i < this.images.length; i++){
		this.images[i].reload_save(main);
	}
	for(var i in this.events){
		for(var j=0; j < this.events[i].length; j++){
			this.events[i][j].reload_save(main);
		}
	}
	this.main = main;
	if(this.loaded){
		this.reload();		
	}
}