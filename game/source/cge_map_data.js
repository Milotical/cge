

function cge_create_map_data_object(scene_data, sprite_data_object){
	var o = new Object;
	o.layers = scene_data["layers"];
	o.tileset_name = scene_data["tileset_name"];
	o.tileset_grid_size = scene_data["tileset_grid_size"];
	o.tileset_zoom_factor = scene_data["tileset_zoom_factor"];
	o.tileset_row_width = scene_data["tileset_row_width"];
	o.sprites = scene_data["sprites"];
	o.sprite_data_object = sprite_data_object;
	
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
		}
	};
	
	return o;
}

