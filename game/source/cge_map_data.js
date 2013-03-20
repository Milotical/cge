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
		if(new_map_id == 0){
			this.layers = [];
			this.layers[0] = [[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]];
			this.layers[1] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,7,0,6,6,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0]];
			this.layers[2] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,7,7,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0]];
			this.tileset_name = "Testset.png";
			this.tileset_grid_size = 32;
			this.tileset_zoom_factor = 1.0;
			this.tileset_row_width = 8;
			this.tileset_passable = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1],[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
			var charas_data = [];
			charas_data[0] = {"id" : 0,"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : 434, "y" : 30, "z" : 1, "face" : 2};
			charas_data[0]["moves"] = [];//[["wait",[10]],["walk",[1,1,"frames"]],["stand"]];
			charas_data[0]["blocking_classes"] = ["std"];
			charas_data[1] = {"id" : 1,"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : 234, "y" : 330, "z" : 1, "face" : 2};
			charas_data[1]["moves"] = [["walk",[5, "random", "frames"],0], ["stand",[],0], ["wait",[30],0]];
			charas_data[1]["blocking_classes"] = ["std"];
			
			var events_data = [];
			
			events_data[0] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[0]["conditions"] = [[["faceing",-1,3,function(f, p){ return f != p; }]], [["chara_variable",-1,"walking",function(v){ return v != true; }]]];
			events_data[0]["triggers"] = ["keypress_37"];
			events_data[0]["effects"] = [["player_move", -1, "walk", [0,3,"inf"], 1, true]];
			events_data[1] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[1]["conditions"] = [[["faceing",-1,3]]];
			events_data[1]["triggers"] = ["keyrelease_37"];
			events_data[1]["effects"] = [["player_move", -1, "stand", [], 1, false]];
			
			events_data[2] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[2]["conditions"] = [[["faceing",-1,0,function(f, p){ return f != p; }]], [["chara_variable",-1,"walking",function(v){ return v != true; }]]];
			events_data[2]["triggers"] = ["keypress_38"];
			events_data[2]["effects"] = [["player_move", -1, "walk", [0,0,"inf"], 1, true]];
			events_data[3] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[3]["conditions"] = [[["faceing",-1,0]]];
			events_data[3]["triggers"] = ["keyrelease_38"];
			events_data[3]["effects"] = [["player_move", -1, "stand", [], 1, false]];
			
			events_data[4] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[4]["conditions"]  = [[["faceing",-1,1,function(f, p){ return f != p; }]], [["chara_variable",-1,"walking",function(v){ return v != true; }]]];
			events_data[4]["triggers"] = ["keypress_39"];
			events_data[4]["effects"] = [["player_move", -1, "walk", [0,1,"inf"], 1, true]];
			events_data[5] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[5]["conditions"] = [[["faceing",-1,1]]];
			events_data[5]["triggers"] = ["keyrelease_39"];
			events_data[5]["effects"] = [["player_move", -1, "stand", [], 1, false]];
			
			events_data[6] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[6]["conditions"]  = [[["faceing",-1,2,function(f, p){ return f != p; }]], [["chara_variable",-1,"walking",function(v){ return v != true; }]]];
			events_data[6]["triggers"] = ["keypress_40"];
			events_data[6]["effects"] = [["player_move", -1, "walk", [0,2,"inf"], 1, true]];
			events_data[7] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[7]["conditions"] = [[["faceing",-1,2]]];
			events_data[7]["triggers"] = ["keyrelease_40"];
			events_data[7]["effects"] = [["player_move", -1, "stand", [], 1, false]];
			
			events_data[8] = {"id" : 0, "parallel" : false, "chara" : 0};
			events_data[8]["conditions"] = [];
			events_data[8]["triggers"] = ["keypress_13"];
			events_data[8]["effects"] = [["set_fullscreen"]];
			
			this.main.input_controller.add_trigger_key(13);
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
		this.loaded = true;
	};
	
	// -----------------------------------------------------------------------------------
	// adds character to map (automatically adds to sprite data)
	// -----------------------------------------------------------------------------------
	o.add_chara = function(chara_data){
		var chara_sprite = cge_create_character(this-chara_data["id"], this.sprites_data, chara_data["source"], chara_data["width"], chara_data["height"], chara_data["rows"], chara_data["cols"], chara_data["x"], chara_data["y"], chara_data["z"], chara_data["face"]);
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
		var img = new Image();
		img.src = this.tileset_name;
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
						ctx.drawImage(img, x_tileset, y_tileset, this.tileset_grid_size, this.tileset_grid_size, x_display, y_display, size_display, size_display);
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

