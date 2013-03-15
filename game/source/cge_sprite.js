
// created sprites data object which manages images, sprites etc.
function cge_create_sprites_data(main_object){
	var o = new Object();
	o.images = [];
	o.min_z = 0;
	o.max_z = 0;
	o.min_y = 0;
	o.max_y = 0;
	o.main_object = main_object;
	o.move_interpreter = cge_create_move_interpreter(main_object.trigger_data);
	o.spritesets = [];
	
	// add image (automatically called when image etc. was created)
	o.add_image = function(image){
		this.images.push(image);
	};
	
	// remove image (automatocally called when image was removed)
	o.remove_image = function(image){
		var index = this.images.indexOf(image);
		this.images.splice(index, 1);
	};
	
	// forgets all images
	o.remove_all_images = function(){
		this.images = [];
	};
	
	o.update_images = function(){
		for(var i=0; i < this.images.length; i++){
			this.images[i].update();
		}
	};
	// draws images to canvas element
	o.draw_images = function(ctx, z_min, z_max){
		if(z_min == null)
			z_min = Number.NEGATIVE_INFINITY;
		if(z_max == null)
			z_max = Number.POSITIVE_INFINITY;
		this.images.sort(function(a,b){ 
			if(a.z != b.z){
				return a.z-b.z;
			}else{
				return a.y-b.y;
			}
		});
		for(var i=0; i < this.images.length; i++){
			if(this.images[i].z >= z_min){
				if(this.images[i].z <= z_max){
					this.images[i].draw(ctx);
				}else{
					break;
				}
			}
		}
	};
	
	o.create_spriteset = function(id){
		o.spritesets[id] = cge_create_spriteset(this.main_object.trigger_data);
	};
	
	return o;
}

function cge_create_spriteset(trigger_data){
	var o = new Object;
	o.sprites = [];
	o.trigger_data = trigger_data;
	
	o.add_sprite = function(sprite){
		this.sprites.push(sprite);
	};
	
	o.remove_sprite = function(sprite){
		var i = this.sprites.indexOf(sprite);
		delete this.sprites[i];
		this.sprites = this.sprites.filter(function(){return true});
	};
	
	o.remove_all = function(){
		this.sprites = [];
	};
	
	o.check_collision = function(new_r, chara, dir){
		var return_value = false;
		var b;
		var c = chara.get_hitbox();
		for(var i=0; i < this.sprites.length; i++){
			b = this.sprites[i].get_hitbox();
			if(!(new_r[0]+c.width <= this.sprites[i].x || new_r[0] >= this.sprites[i].x+b.width || new_r[1]+c.height <= this.sprites[i].y || new_r[1] >= this.sprites[i].y+b.height) && chara != this.sprites[i]){
				this.trigger_data.update("collision",[chara, this.sprites[i]]);
				return_value = true;
			}
		}
		return return_value;
	};
	
	return o;
};

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
	
	o.get_hitbox = function(){
		return this;
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
	o.updated = false
	
	o.set_z = function(new_z){
		this.z = new_z;
	};
	
	o.update = function(ctx){ };
	
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
		frame_sequence = [[0,0]];
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
	};
	
	o.set_sequence = function(new_sequence, repeat){
		if(repeat != null)
			this.repeat = repeat;
		this.frame_sequence = new_sequence;
		this.time_index = 0;
		this.frame_sequence_index = 0;
		var new_sequence_frame = this.frame_sequence[0];
		this.col_index = new_sequence_frame[0];
		this.row_index = new_sequence_frame[1];
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
		faceing = 2;
	var o = cge_create_anim_sprite(sprite_data_object, image_source, width, height, rows, cols, x, y, z, [[0,0]]);
	o.faceing = faceing;
	o.moves = [];
	o.clear_after_finished = false;
	o.sleep = false;
	o.repeat = true;
	o.special_sequences = [[],[],[],[]];
	o.speed = 2;
	o.map_collision = true;
	o.chara_collision_condition = "all";
	o.hitbox = cge_create_rect(0,0,32,32);
	//o.show_hitbox = true;
	o.show_hitbox = false;
	o.basic_frame_time = 10;
	o.col_spritesets = [];
	o.map_collider = true;
	o.trough = false;
	o.variables = {};
	
	o.load_sequence = function(sequence_key, faceing){
		if(faceing == null)
			faceing = this.faceing;
		this.set_sequence(this.special_sequences[this.faceing][sequence_key]);
	};
	
	o.write_sequence = function(faceing, sequence_key, sequence){
		this.special_sequences[faceing][sequence_key] = sequence;
	};
	
	o.get_hitbox = function(){
		return this.hitbox;
	};
	
	o.write_sequence(2, "stand",[[0,0]]);
	o.write_sequence(3, "stand",[[0,1]]);
	o.write_sequence(1, "stand",[[0,2]]);
	o.write_sequence(0, "stand",[[0,3]]);
	o.write_sequence(2, "walk",[[0,0],[1,0],[2,0],[3,0]]);
	o.write_sequence(3, "walk",[[0,1],[1,1],[2,1],[3,1]]);
	o.write_sequence(1, "walk",[[0,2],[1,2],[2,2],[3,2]]);
	o.write_sequence(0, "walk",[[0,3],[1,3],[2,3],[3,3]]);
	
	o.update_anim = o.update;
	o.update = function(ctx){
		if(!this.moves_ready()){
			this.moves[0].update();
		}
		this.update_anim(ctx);
	};
	
	o.moves_ready = function(){
		return (this.moves.length == 0);
	}
	
	// draws image to canvas (automatically called)
	o.draw = function(ctx){
		var img = new Image();
		img.src = this.image_source;
		var width_image = this.get_width();
		var height_image = this.get_height();
		var x_image = this.col_index*width_image;
		var y_image = this.row_index*height_image;
		ctx.drawImage(img, x_image, y_image,width_image, height_image, this.x-0.5*(this.zoom_x*width_image-this.hitbox.width), this.y-this.zoom_y*height_image+this.hitbox.height, width_image*this.zoom_x, height_image*this.zoom_y);
		if(this.show_hitbox){
			ctx.fillStyle="rgb(255,0,0)";
			ctx.globalAlpha = 0.5;
			ctx.fillRect(this.x,this.y,this.hitbox.width,this.hitbox.height); 
			ctx.globalAlpha = 1;
		}
	};
	
	o.add_move = function(move){
		this.moves.push(move);
	};
	
	o.add_col_spriteset = function(set_id){
		this.col_spritesets.push(this.sprite_data_object .spritesets[set_id]);
		this.sprite_data_object.spritesets[set_id].add_sprite(this);
	};
	
	o.load_sequence("stand");
	return o;
}