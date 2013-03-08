function cge_create_sprites_data(){
	var o = new Object();
	o.images = [];
	
	o.draw_images = function(ctx){
		for(var i=0; i < this.images.length; i++){
			this.images[i].draw(ctx);
		}
	};
	
	o.draw_images_below(ctx, max_z){
		for(var i=0; i < this.images.length; i++){
			if(){
				this.images[i].draw(ctx);
			}
		}
	};
	
	return o;
}



function cge_create_rect(x,y,w,h){
	var o = new Object;
	o.x = x;
	o.y = y;
	o.width = w;
	o.height = h;
	
	o.check_hit = function(x ,y){
		return (x > this.x and x < this.x+this.width and y > this.y and y < this.y+this.height);
	};
	
	return o;
}


function cge_create_image(id, image_source, width, height){
	var o = cge_create_rect(0,0,width,height);
	o.image_source = image_source;
	o.z = 1;
	o.zoom_x = 1.0;
	o.zoom_y = 1.0;
	o.id = id;
	
	o.draw = function(ctx){
		var img = new Image();
		img.src = this.image_source;
		ctx.drawImage(img, 0, 0, this.width, this.height, this.x, this.y, this.width*this.x_zoom, this.height*this.y_zoom);
	};
	
	return o;
}


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