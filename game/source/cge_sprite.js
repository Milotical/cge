
// created sprites data object which manages images, sprites etc.
function cge_create_sprites_data(){
	var o = new Object();
	o.images = [];
	o.min_z = 0;
	o.max_z = 0;
	o.min_y = 0;
	o.max_y = 0;
	
	// add image (automatically called when image etc. was created)
	o.add_image = function(image){
		if(this.images[image.z] == null)
			this.images[image.z] = [];
		if(this.images[image.z][image.y] == null)
			this.images[image.z][image.y] = [];
		this.images[image.z][image.y].push(image);
		if(image.z < this.min_z)
			this.min_z = image.z;
		if(image.z > this.max_z)
			this.max_z = image.z;
		if(image.y < this.min_y)
			this.min_y = image.y;
		if(image.y > this.max_y)
			this.max_y = image.y;
	};
	
	// remove image (automatocally called when image was removed)
	o.remove_image = function(image){
		var a = this.images[image.z][image.y];
		var index = a.indexOf(image);
		a.splice(index, 1);
	};
	
	// forgets all images
	o.remove_all_images = function(){
		this.images = [];
	};
	
	// draws images to canvas element
	o.update_images = function(ctx, z_min, z_max, y_min, y_max){
		if(z_min == null)
			z_min = this.min_z;
		if(z_max == null)
			z_max = this.max_z;
		if(y_min == null)
			y_min = this.min_y;
		if(y_max == null)
			y_max = this.max_y;
		for(var z=z_min; z <= z_max; z++){
			if(this.images[z]){
				for(var y=y_min; y <= y_max; y++){
					if(this.images[z][y]){
						for (var i in this.images[z][y]){
							this.images[z][y][i].update(ctx);
						}
					}
				}
			}
		}
	};
	
	return o;
}


// basic object for an area
function cge_create_rect(x,y,w,h){
	var o = new Object;
	o.x = x;
	o.y = y;
	o.width = w;
	o.height = h;
	
	o.set_x = function(new_x){
		this.x = new_x;
	};
	o.set_y = function(new_y){
		this.y = new_y;
	};
	
	return o;
}

// object representing an image (child of cge_create_rect)
function cge_create_image(sprite_data_object, image_source, width, height, x, y, z, add_image){
	if(x == null)
		x = 0;
	if(y == null)
		y = 0;
	if(z == null)
		z = 100;
	if(add_image == null)
		add_image = true;
	var o = cge_create_rect(x,y,width,height);
	o.image_source = image_source;
	o.z = z;
	o.zoom_x = 1.0;
	o.zoom_y = 1.0;
	o.sprite_data_object = sprite_data_object;
	o.removed = false;
	o.visible = true;
	
	o.set_y = function(new_y){
		this.sprite_data_object.remove_image(this);
		this.y = new_y;
		this.sprite_data_object.add_image(this);
	};
	o.set_z = function(new_z){
		this.sprite_data_object.remove_image(this);
		this.z = new_z;
		this.sprite_data_object.add_image(this);
	};
	
	o.update = function(ctx){
		if(this.visible)
			this.draw(ctx);
	};
	
	// draws image to canvas (automatically called)
	o.draw = function(ctx){
		var img = new Image();
		img.src = this.image_source;
		ctx.drawImage(img, 0, 0,this.width, this.height, this.x, this.y, this.width*this.zoom_x, this.height*this.zoom_y);
	};
	
	// deletes image (at next frame)
	o.remove = function(){
		this.removed = true;
		this.sprite_data_object.remove_image(this);
	};
	
	if(add_image)
		o.sprite_data_object.add_image(o);
	
	return o;
}

function cge_create_sprite(sprite_data_object, image_source, width, height, rows, cols, x, y, z, add_image){
	var o = cge_create_image(sprite_data_object, image_source, width, height, x, y, z, add_image);
	if(rows == null)
		rows = 4;
	if(cols == null)
		cols = 4;	
	o.n_rows = rows; 
	o.n_cols = cols;
	o.row_index = 0;
	o.col_index = 0;
	
	o.set_index = function(x_index, y_index){
		this.row_index = x_index; 
		this.col_index = y_index;
	};
	
	// draws image to canvas (automatically called)
	o.draw = function(ctx){
		var img = new Image();
		img.src = this.image_source;
		var width_image = this.get_width();
		var height_image = this.get_height();
		var x_image = this.col_index*width_image;
		var y_image = this.row_index*height_image;
		ctx.drawImage(img, x_image, y_image,width_image, height_image, this.x, this.y, width_image*this.zoom_x, height_image*this.zoom_y);
	};
	
	o.get_width = function(){
		return this.width/this.n_cols;
	};
	o.get_height = function(){
		return this.height/this.n_rows;
	};
	
	return o;
}

function cge_create_anim_sprite(sprite_data_object, image_source, width, height, rows, cols, x, y, z, frame_sequence, add_image){
	var o = cge_create_sprite(sprite_data_object, image_source, width, height, rows, cols, x, y, z, add_image);
	if(frame_sequence == null)
		frame_seqence = [[0,0]];
	o.frame_sequence = frame_sequence;
	o.frame_sequence_index  = 0;
	o.basic_frame_time = 30;
	o.sleep = false;
	o.repeat = false;
	o.time_index  = 0;
	o.clear_after_finished = true;
	o.col_index = o.frame_sequence[0][0];
	o.row_index = o.frame_sequence[0][1];
	
	o.update = function(ctx){
		if(!this.sleep){
			this.time_index++;
			var current_sequence_frame = this.frame_sequence[this.frame_sequence_index];
			var frame_time = this.basic_frame_time;
			if(current_sequence_frame["time"] != null)
				frame_time = current_sequence_frame["time"];
			//alert("t="+this.time_index);
			if(this.time_index >= frame_time){
				var new_sequence_frame = this.frame_sequence[this.frame_sequence_index+1];
				if(new_sequence_frame != null){
					this.time_index = 0;
					this.frame_sequence_index++;
					this.col_index = new_sequence_frame[0];
					this.row_index = new_sequence_frame[1];
				}else if(this.repeat){
					new_sequence_frame = this.frame_sequence[0];
					this.time_index = 0;
					this.frame_sequence_index = 0;
					this.col_index = new_sequence_frame[0];
					this.row_index = new_sequence_frame[1];
				}else{
					if(this.clear_after_finished)
						this.visible = false;
				  this.sleep = true;
				}
			}
		}
		if(this.visible)
			this.draw(ctx);
	};
	
	// draws image to canvas (automatically called)
	o.draw = function(ctx){
		var img = new Image();
		img.src = this.image_source;
		var width_image = this.get_width();
		var height_image = this.get_height();
		var x_image = this.col_index*width_image;
		var y_image = this.row_index*height_image;
		ctx.drawImage(img, x_image, y_image,width_image, height_image, this.x, this.y, width_image*this.zoom_x, height_image*this.zoom_y);
	};
	
	return o;
}

function cge_create_character(sprite_data_object, image_source, width, height, rows, cols, x, y, z, faceing){
	if(rows == null)
		rows = 4;
	if(cols == null)
		cols = 4;
	if(faceing == null)
		faceing = 0;
	var o = cge_create_anim_sprite(sprite_data_object, image_source, width, height, rows, cols, x, y, z, frame_sequence, add_image);
	o.faceing = faceing;
	o.moves = [];
	o.repeat_moves = false;
	o.clear_after_finished = false;
	o.sleep = true;
	
	o.update_anim = o.update;
	o.update = function(ctx){
		if(this.moves.length == 0){
			this.frame_sequence = [[0,this.faceing]];
			this.repeat = false;
			this.sleep = false;
		}else{
			this.moves[0].update();
		}
		this.update_anim(ctx);
	};
	
	// draws image to canvas (automatically called)
	o.draw = function(ctx){
		var img = new Image();
		img.src = this.image_source;
		var width_image = this.get_width();
		var height_image = this.get_height();
		var x_image = this.col_index*width_image;
		var y_image = this.row_index*height_image;
		ctx.drawImage(img, x_image, y_image,width_image, height_image, this.x, this.y, width_image*this.zoom_x, height_image*this.zoom_y);
	};
	
	return o;
}