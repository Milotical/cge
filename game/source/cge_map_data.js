/* ======================================
			CGE MAP DATA
			----------------------------------------------------------
			manages all maps
			a change to another map means changeing the content of this object
====================================== */ 

function cge_create_map_data(main_object){
	var o = new Object;
	o.main = main_object;									// assiciation to the main object 
	o.sprites_data = o.main.sprites_data;		// assiciation to the sprites object 
	
	o.images = [];													// array of corresponding images
	o.events = [];													// array of corresponding events
	o.loaded = true;												// defines if map is displayed
	o.initialised = false										
	
	// -----------------------------------------------------------------------------------
	// called of new map is loaded
	// -----------------------------------------------------------------------------------
	o.load_new_map = function(new_map_id){
		this.unload();
		this.images = [];
		this.events = [];
		
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
				charas_data[i] = {"id" : 1,"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : Math.random()*640, "y" : Math.random()*480, "z" : 1, "face" : 2};
				charas_data[i]["moves"] = [["walk",[5, "random", "frames"],0], ["stand",[],0], ["wait",[30],0]];
				charas_data[i]["blocking_classes"] = ["std"];
			}
			
			var events_data = [];
			
			events_data[0] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[0]["conditions"]  = [[["chara_variable","player","walking",function(v){ return v != true; }]]];
			events_data[0]["triggers"] = ["keypress_37"];
			events_data[0]["effects"] = [["player_move", "player", "walk", [0,3,"inf"], 1, true]];
			events_data[1] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[1]["conditions"] = [[["faceing","player",3]]];
			events_data[1]["triggers"] = ["keyrelease_37"];
			events_data[1]["effects"] = [["player_move", "player", "stand", [], 1, false]];
			
			events_data[2] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[2]["conditions"]  = [[["chara_variable","player","walking",function(v){ return v != true; }]]];
			events_data[2]["triggers"] = ["keypress_38"];
			events_data[2]["effects"] = [["player_move", "player", "walk", [0,0,"inf"], 1, true]];
			events_data[3] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[3]["conditions"] = [[["faceing","player",0]]];
			events_data[3]["triggers"] = ["keyrelease_38"];
			events_data[3]["effects"] = [["player_move", "player", "stand", [], 1, false]];
			
			events_data[4] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[4]["conditions"]  = [[["chara_variable","player","walking",function(v){ return v != true; }]]];
			events_data[4]["triggers"] = ["keypress_39"];
			events_data[4]["effects"] = [["player_move", "player", "walk", [0,1,"inf"], 1, true]];
			events_data[5] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[5]["conditions"] = [[["faceing","player",1]]];
			events_data[5]["triggers"] = ["keyrelease_39"];
			events_data[5]["effects"] = [["player_move", "player", "stand", [], 1, false]];
			
			events_data[6] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[6]["conditions"]  = [[["chara_variable","player","walking",function(v){ return v != true; }]]];
			events_data[6]["triggers"] = ["keypress_40"];
			events_data[6]["effects"] = [["player_move", "player", "walk", [0,2,"inf"], 1, true]];
			events_data[7] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[7]["conditions"] = [[["faceing","player",2]]];
			events_data[7]["triggers"] = ["keyrelease_40"];
			events_data[7]["effects"] = [["player_move", "player", "stand", [], 1, false]];
			
			events_data[8] = {"id" : 8, "parallel" : true, "chara" : 0};
			events_data[8]["conditions"] = [];
			events_data[8]["triggers"] = ["auto"];
			events_data[8]["effects"] = [["scroll", function(sx, e){ return 320-e.chara.x-e.chara.get_width()/2; }, function(sy, e){ return 240-e.chara.y-e.chara.get_height()/2; }]];
		
			events_data[9] = {"id" : 0, "parallel" : true, "chara" : 0};
			events_data[9]["conditions"] = [];
			events_data[9]["triggers"] = ["keynewpress_13"];
			events_data[9]["effects"] = [["play_music", "bgm", "Poyo.wav", 0.5, true]];
			
			events_data[10] = {"id" : 0, "parallel" : true, "chara" : 0};
			events_data[10]["conditions"] = [];
			events_data[10]["triggers"] = ["keynewpress_32"];
			events_data[10]["effects"] = [["stop_music", "bgm"]];
			
			this.main.input_controller.add_trigger_key(13);
			this.main.input_controller.add_trigger_key(32);
			this.main.input_controller.add_trigger_key(37);
			this.main.input_controller.add_trigger_key(38);
			this.main.input_controller.add_trigger_key(39);
			this.main.input_controller.add_trigger_key(40);
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
	};
	
	// -----------------------------------------------------------------------------------
	// adds character to map (automatically adds to sprite data)
	// -----------------------------------------------------------------------------------
	o.add_chara = function(chara_data){
		var chara_sprite = cge_create_character(chara_data["id"], this.sprites_data, chara_data["source"], chara_data["width"], chara_data["height"], chara_data["rows"], chara_data["cols"], chara_data["x"], chara_data["y"], chara_data["z"], chara_data["face"]);
		if(chara_data["moves"] != null){
			for(var i=0; i < chara_data["moves"].length; i++){
				var m = cge_create_move(this.main.move_interpreter , chara_data["moves"][i][0], chara_sprite, chara_data["moves"][i][1], chara_data["moves"][i][2]);
				chara_sprite.add_move(m);
			}
		}
		if(chara_data["blocking_classes"] != null){
			for(var i=0; i < chara_data["blocking_classes"].length; i++){
				if(this.sprites_data.spritesets[chara_data["blocking_classes"][i]] == null)
					this.sprites_data.create_spriteset(chara_data["blocking_classes"][i]); 
				chara_sprite.add_col_spriteset(chara_data["blocking_classes"][i]);
			}
		}
		this.images.push(chara_sprite);
		this.sprites_data.add_image(chara_sprite);
	};
	
	o.add_event = function(event_data){
		var event = cge_create_event(event_data["id"], this.main.event_interpreter, event_data["effects"], event_data["conditions"], event_data["parallel"], this.images[event_data["chara"]]);
		for(var i=0; i < event_data["triggers"].length; i++){
			this.main.trigger_data.add_map_event(event_data["triggers"][i], event);
		}
		this.events.push(event);
	};
	
	// -----------------------------------------------------------------------------------
	// unloads map (if other scene is called)
	// -----------------------------------------------------------------------------------
	o.unload = function(){
		for (var i in this.images){
			this.images[i].remove();
		}
		this.main.trigger_data.remove_all_map_events();
		this.loaded = false;
	};
	
	// -----------------------------------------------------------------------------------
	// reloads map
	// -----------------------------------------------------------------------------------
	o.reload = function(){
		if(this.images_deleted){
			for (var i in this.images){
				this.sprites_data.add_image(i);
			}
		}
		this.main.trigger_data.map_events = this.events.slice(0);
		this.loaded = true;
	};
	
	// -----------------------------------------------------------------------------------
	// frame update
	// -----------------------------------------------------------------------------------
	o.update = function(ctx){
		this.draw_tiled_map(ctx);
	};
	
	// -----------------------------------------------------------------------------------
	// draws tiled map
	// -----------------------------------------------------------------------------------
	o.draw_tiled_map = function(ctx){
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
			this.sprites_data.draw_images(ctx, z, z);
		}
	};
	
	// -----------------------------------------------------------------------------------
	// returns if position on map is massable
	// -----------------------------------------------------------------------------------
	o.passable = function(x, y, dir){
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
	};
	
	return o;
}

