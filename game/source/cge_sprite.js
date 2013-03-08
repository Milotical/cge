
/*function create_sprite_object(id, image_source, width, height){
	o = new Object;
	o.x = 0;
	o.y = 0;
	o.z = 2
	o.image_source = image_source;
	o.width = width;
	o.height = height;
	o.number_x_frames = 4;
	o.number_y_frames = 4;
	o.x_index = 0;
	o.y_index = 0;
	o.zoom_x = 1.0;
	o.zoom_y = 1.0;
	o.id = id;
	
	o.draw = function(ctx, display_grid_size){
		var img = new Image();
		img.src = this.image_source;
		var width_image = this.width/this.number_x_frames;
		var height_image = this.width/this.number_y_frames;
		var x_image = this.x_index*width_image-(width_image-display_grid_size)*0.5;
		var y_image = this.y_index*height_image-(height_image-display_grid_size);
		ctx.drawImage(img, x_image, y_image, width_image, height_image, x, y, width_image*this.x_zoom, height_image*this.y_zoom);
	}
	
	return o;
}*/