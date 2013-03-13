

function cge_create_map_data_object(map_data, sprite_data_object){
	var o = new Object;
	o.layers = map_data["layers"];
	o.tileset_name = map_data["tileset_name"];
	o.tileset_grid_size = map_data["tileset_grid_size"];
	o.tileset_zoom_factor = map_data["tileset_zoom_factor"];
	o.tileset_row_width = map_data["tileset_row_width"];
	o.tileset_passable = map_data["tileset_passable"];
	o.sprites_data = sprite_data_object;
	o.sprites_data.move_interpreter.map_data = o;
	o.scroll_x = 0;
	o.scroll_y = 0;
	o.images_deleted = false;
	o.images = [];
	o.events = [];
	o.loaded = true;
	
	o.add_chara = function(chara_data){
		var chara_sprite = cge_create_character(this.sprites_data, chara_data["source"], chara_data["width"], chara_data["height"], chara_data["rows"], chara_data["cols"], chara_data["x"], chara_data["y"], chara_data["z"], chara_data["face"]);
		if(chara_data["moves"] != null){
			for(var i=0; i < chara_data["moves"].length; i++){
				var m = cge_create_move(this.sprites_data.move_interpreter , chara_data["moves"][i][0], chara_sprite, chara_data["moves"][i][1], chara_data["moves"][i][2]);
				chara_sprite.add_move(m);
			}
		}
		//var m;
		//m = cge_create_move(this.sprites_data.move_interpreter , "wait", chara_sprite, [60]);
		//chara_sprite.add_move(m);
	//	m = cge_create_move(this.sprites_data.move_interpreter , "walk", chara_sprite, [300,[-0.7,0.7]]);
	//	chara_sprite.add_move(m);
		/*m = cge_create_move(this.sprites_data.move_interpreter , "walk", chara_sprite, [600,3]);
		chara_sprite.add_move(m);
		m = cge_create_move(this.sprites_data.move_interpreter , "wait", chara_sprite, [60]);
		chara_sprite.add_move(m);
		m = cge_create_move(this.sprites_data.move_interpreter , "turn", chara_sprite, [1]);
		chara_sprite.add_move(m);*/
		this.images.push(chara_sprite);
	};
	
	for(var chara in map_data["chara"]){
		o.add_chara(map_data["chara"][chara]);
	}
	
	o.restore_images = function(){
		if(this.images_deleted){
			for (var i in this.images){
				this.sprites_data.add_image(i);
			}
		}
	};
	
	o.delete_images = function(){
		for (var i in this.images){
			i.remove();
		}
		this.images_deleted = true;
	};
	
	o.update = function(ctx){
		this.draw_tiled_map(ctx, this.scroll_x, this.scroll_y);
	};
	
	o.draw_tiled_map = function(ctx, scroll_x, scroll_y){
		var img = new Image();
		img.src = this.tileset_name;
		//ctx.drawImage(img, x_on_image, y_on_image, width_on_image, height_on_image, x, y, width, height)
		for(var z=0; z < this.layers.length; z++){
			for(var y=0; y < this.layers[z].length; y++){
				for(var x=0; x < this.layers[z][y].length; x++){
					if(this.layers[z][y][x] != 0){
						var x_tileset = ((this.layers[z][y][x]-1)%this.tileset_row_width)*this.tileset_grid_size;
						var y_tileset = (parseInt((this.layers[z][y][x]-1)/this.tileset_row_width))*this.tileset_grid_size;
						var size_display = this.tileset_grid_size*this.tileset_zoom_factor;
						var x_display = x*size_display-scroll_x;
						var y_display = y*size_display-scroll_y;
						ctx.drawImage(img, x_tileset, y_tileset, this.tileset_grid_size, this.tileset_grid_size, x_display, y_display, size_display, size_display);
					}
				}
			}
			this.sprites_data.update_images(ctx, z, z);
		}
	};
	
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

