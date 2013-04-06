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
	this.start_map = function(){};							// dummy for function called when map was loaded
	this.map_id;														   // current map id
}
	
// -----------------------------------------------------------------------------------
// called of new map is loaded
// -----------------------------------------------------------------------------------
CGE_Map_Data.prototype.load_new_map = function(new_map_id){
	this.main.trigger_data.update("end_map");
	this.main.input_controller.refresh();
	this.unload();
	this.images = [];
	this.events = {};
	this.map_id = new_map_id;
	this.map_variables = {};
	
	// AJAX call for map data
	var map_id = this.map_id;
	var map_data = this;
	var main = this.main;
	$.post("src/LoadMap.php", { mapID : map_id } ,
		function(data){
			//main.debug_m(data);
			eval(data);
			map_data.start_map();
			main.set_buffer_size(map_data.map_width, map_data.map_height);
			map_data.loaded = true;
			map_data.initialised = true;
		}, "text"
	);
	
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
		if(this.images[i].spritesets != null){
			for(var j=0; j < this.images[i].spritesets.length; j++){
				this.main.sprites_data.spritesets[this.images[i].spritesets[j]].add_sprite(this.images[i]);
			}
		}
		if(this.images[i].col_spritesets != null){
			for(var j=0; j < this.images[i].col_spritesets.length; j++){
				this.main.sprites_data.spritesets[this.images[i].col_spritesets[j]].add_sprite(this.images[i]);
			}
		}
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

CGE_Map_Data.prototype.remove_image = function(img){
	var a = this.images;
	var index = a.indexOf(img);
	this.images.splice(index, 1);
}

CGE_Map_Data.prototype.remove_image_by_id = function(id){
	var img = this.main.sprites_data.get_image_by_id(id);
	if(img != null)
		this.remove_image(img);
}