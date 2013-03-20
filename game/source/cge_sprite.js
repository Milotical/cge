/* ======================================
			CGE SPRITES DATA
			----------------------------------------------------------
			manages all images, sprites etc.
====================================== */ 

// -----------------------------------------------------------------------------------
// creates and returns sprites_data object
// -----------------------------------------------------------------------------------
function cge_create_sprites_data(main_object){
	var o = new Object();
	o.main = main_object;		// assiciation to the main object 
	o.images = [];						// array including all displayes sprites
	o.spritesets = [];					// list of all spritesets
	//o.ids = {};
	
	// -----------------------------------------------------------------------------------
	// add image (automatically called when image etc. was created)
	// -----------------------------------------------------------------------------------
	o.add_image = function(image){
		//this.ids[image.id] = this.images.length;
		this.images.push(image);
	};
	
	o.get_image_by_id = function(id){
		for(var i=0; i < this.images.length; i++){
			if(this.images[i].id == id)
				return this.images[i];
		}
		return null;
	};
	
	// -----------------------------------------------------------------------------------
	// remove image (automatocally called when image was removed)
	// -----------------------------------------------------------------------------------
	o.remove_image = function(image){
		var index = this.images.indexOf(image);
		this.images.splice(index, 1);
	};
	
	// -----------------------------------------------------------------------------------
	// forgets all images (can be called after e.g. a scene to delete all images)
	// -----------------------------------------------------------------------------------
	o.remove_all_images = function(){
		this.images = [];
		this.spritesets = [];
	};
	
	// -----------------------------------------------------------------------------------
	// frame update for all images (automatically called in main loop)
	// 	(important for animated sprites)
	// -----------------------------------------------------------------------------------
	o.update = function(){
		for(var i=0; i < this.images.length; i++){
			this.images[i].update();
		}
	};
	
	// -----------------------------------------------------------------------------------
	// draws images to canvas element (should be called in scene-frame update)
	// -----------------------------------------------------------------------------------
	o.draw_images = function(ctx, z_min, z_max){
		if(z_min == null)
			z_min = Number.NEGATIVE_INFINITY;
		if(z_max == null)
			z_max = Number.POSITIVE_INFINITY;
		// defines sort function
		this.images.sort(function(a,b){ 
			if(a.z != b.z){
				return a.z-b.z;
			}else{
				return a.y-b.y;
			}
		});
		// darws sorted images to canvas element
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
	
	// -----------------------------------------------------------------------------------
	// created spriteset with given id
	// -----------------------------------------------------------------------------------
	o.create_spriteset = function(id){
		o.spritesets[id] = cge_create_spriteset(this.main.trigger_data);
	};
	
	return o;
}

/* ======================================
			CGE SPRITESET
			----------------------------------------------------------
			a set of sprites which can check collisions
====================================== */ 
function cge_create_spriteset(trigger_data){
	var o = new Object;
	o.sprites = [];									// array with sprites of this set
	o.trigger_data = trigger_data;		// association to trigger_data
	
	// -----------------------------------------------------------------------------------
	// adds sprite to the spriteset
	// -----------------------------------------------------------------------------------
	o.add_sprite = function(sprite){
		this.sprites.push(sprite);
	};
	
	// -----------------------------------------------------------------------------------
	// removes sprite from spriteset
	// -----------------------------------------------------------------------------------
	o.remove_sprite = function(sprite){
		var i = this.sprites.indexOf(sprite);
		delete this.sprites[i];
		this.sprites = this.sprites.filter(function(){return true});
	};
	
	// -----------------------------------------------------------------------------------
	// removes all sprites from spriteset
	// -----------------------------------------------------------------------------------
	o.remove_all = function(){
		this.sprites = [];
	};
	
	// -----------------------------------------------------------------------------------
	// checks if given object has an overlap with one or more objects of this set
	//		chara				width & height are taken from this object
	//		new_r = [x,y]   position checked
	//		(dir					direction (only interesting for trigger events))
	// -----------------------------------------------------------------------------------
	o.check_collision = function(chara, new_r, dir){
		var return_value = false;
		var b;
		var c = chara.get_hitbox();
		if(new_r == null){
			new_r = [chara.x, chara.y];
		}
		for(var i=0; i < this.sprites.length; i++){
			b = this.sprites[i].get_hitbox();
			if(!(new_r[0]+c.width <= this.sprites[i].x || new_r[0] >= this.sprites[i].x+b.width || new_r[1]+c.height <= this.sprites[i].y || new_r[1] >= this.sprites[i].y+b.height) && chara != this.sprites[i]){
				this.trigger_data.update("collision",[chara, this.sprites[i], dir]);
				return_value = true;
			}
		}
		return return_value;
	};
	
	return o;
};

/* ======================================
			CGE RECT
			----------------------------------------------------------
			Object representing a rect with position x,y and width,height
====================================== */ 
// basic object for an area
function cge_create_rect(x,y,w,h){
	var o = new Object;
	
	// position
	o.x = x;
	o.y = y;
	o.z = 100;
	// size
	o.width = w;
	o.height = h;
	
	o.set_x = function(new_x){
		this.x = new_x;
	};
	o.set_y = function(new_y){
		this.y = new_y;
	};
	o.set_z = function(new_z){
		this.z = new_z;
	};
	o.get_hitbox = function(){
		return this;
	};
	
	// -----------------------------------------------------------------------------------
	// frame update template
	// -----------------------------------------------------------------------------------
	o.update = function(ctx){ };
	
	return o;
}

/* ======================================
			CGE IMAGE <- RECT
			----------------------------------------------------------
			Object representing a trivial image
====================================== */ 
function cge_create_image(id, sprites_data_object, image_source, width, height, x, y, z){
	if(x == null)
		x = 0;
	if(y == null)
		y = 0;
	if(z == null)
		z = 100;
		
	var o = cge_create_rect(x,y,width,height);
	
	o.variables = {};
	
	o.id = id;
	o.image_source = image_source;	// path of used image
	o.z = z;													// the z-priority of the image
	o.zoom_x = 1.0;									// zoom factors
	o.zoom_y = 1.0;
	o.sprites_data_object = sprites_data_object; // association to data objects (to add and remove itself)
	
	o.visible = true;									// visibility of image
	o.opacity = 1.0;										// opacity of image
	o.spritesets = [];									// list of own spriteset-ids
	
	// -----------------------------------------------------------------------------------
	// draws image to canvas (automatically called in sprites_draw)
	// -----------------------------------------------------------------------------------
	o.draw = function(ctx){
		if(this.img == null){
			this.img = new Image();
			this.img.src = this.image_source;
		}
		ctx.globalAlpha = this.opacity;
		ctx.drawImage(this.img, 0, 0,this.width, this.height, this.x, this.y, this.width*this.zoom_x, this.height*this.zoom_y);
	};
	
	// -----------------------------------------------------------------------------------
	// deletes image (at next frame)
	// -----------------------------------------------------------------------------------
	o.remove = function(){
		this.sprites_data_object.remove_image(this);
		for(var i=0; i < this.spritesets.length; i++){
			this.sprites_data_object.spritesets[this.spritesets[i]].remove_sprite(this);
		}
	};
	
	// -----------------------------------------------------------------------------------
	// returns display size
	// -----------------------------------------------------------------------------------
	o.get_width = function(){
		return this.width;
	};
	o.get_height = function(){
		return this.height;
	};
	
	return o;
}

/* ======================================
			CGE SPRITE <- IMAGE
			----------------------------------------------------------
			Object representing a tiled image = sprite
====================================== */ 
function cge_create_sprite(id, sprites_data_object, image_source, width, height, rows, cols, x, y, z){
	var o = cge_create_image(id, sprites_data_object, image_source, width, height, x, y, z);
	if(rows == null)
		rows = 4;
	if(cols == null)
		cols = 4;	
	o.n_rows = rows;		// number of rows 
	o.n_cols = cols;			// number of columns
	o.row_index = 0;			// current row
	o.col_index = 0;			// current collumn
	
	// -----------------------------------------------------------------------------------
	// sets both indices at once
	// -----------------------------------------------------------------------------------
	o.set_index = function(x_index, y_index){
		this.row_index = x_index; 
		this.col_index = y_index;
	};
	
	// -----------------------------------------------------------------------------------
	// draws image to canvas (automatically called in sprites_draw)
	// -----------------------------------------------------------------------------------
	o.draw = function(ctx){
		if(this.img == null){
			this.img = new Image();
			this.img.src = this.image_source;
		}
		var width_image = this.get_width();
		var height_image = this.get_height();
		var x_image = this.col_index*width_image;
		var y_image = this.row_index*height_image;
		ctx.globalAlpha = this.opacity;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x, this.y, width_image*this.zoom_x, height_image*this.zoom_y);
	};
	
	// -----------------------------------------------------------------------------------
	// returns display size
	// -----------------------------------------------------------------------------------
	o.get_width = function(){
		return this.width/this.n_cols;
	};
	o.get_height = function(){
		return this.height/this.n_rows;
	};
	
	return o;
}

/* ======================================
			CGE ANIM SPRITE <- SPRITE
			----------------------------------------------------------
			Object representing a animated tiled image
====================================== */ 
function cge_create_anim_sprite(id, sprites_data_object, image_source, width, height, rows, cols, x, y, z, frame_sequence){
	var o = cge_create_sprite(id, sprites_data_object, image_source, width, height, rows, cols, x, y, z);
	if(frame_sequence == null)
		frame_sequence = [[0,0]];
	o.frame_sequence = frame_sequence;	// current frame sequence e.g. [  [0,0]  ,  [0,1,15]  , ...] (each sub-array has structure [col_index, row_index, frames]) 
	o.frame_sequence_index  = 0;					// current frame index (defines which sub-array of sequence represents current state)
	o.basic_frame_time = 30;								// basic display time of one frame (used if no 3rd elemnt in sub-array)
	o.sleep = false;												// if true the current state is frezed
	o.repeat = false;												// defines if animation will be repeated	
	o.time_index  = 0;											// frame counter	
	o.clear_after_finished = true;						// defines if image is terminated after animation finished
	
	// setting col and row index
	o.col_index = o.frame_sequence[0][0];
	o.row_index = o.frame_sequence[0][1];
	
	// -----------------------------------------------------------------------------------
	// frame update (auto called)
	// -----------------------------------------------------------------------------------
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
					if(this.clear_after_finished){
						// .. trigger ...
						this.remove();
					}
				  this.sleep = true;
				}
			}
		}
	};
	
	// -----------------------------------------------------------------------------------
	// called to change sequence and stop current animation
	// -----------------------------------------------------------------------------------
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
	
	// -----------------------------------------------------------------------------------
	// draws image to canvas (automatically called in sprites_draw)
	// -----------------------------------------------------------------------------------
	o.draw = function(ctx){
		if(this.img == null){
			this.img = new Image();
			this.img.src = this.image_source;
		}
		var width_image = this.get_width();
		var height_image = this.get_height();
		var x_image = this.col_index*width_image;
		var y_image = this.row_index*height_image;
		ctx.globalAlpha = this.opacity;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x, this.y, width_image*this.zoom_x, height_image*this.zoom_y);
	};
	
	return o;
}

/* ======================================
			CGE CHARACTER <- ANIM SPRITE
			----------------------------------------------------------
			Object representing a character-sprite
			a charactrer sprite is an animated sprite with some
			basic functionallity for walking around and colliding
====================================== */ 
function cge_create_character(id, sprites_data_object, image_source, width, height, rows, cols, x, y, z, faceing){
	if(rows == null)
		rows = 4;
	if(cols == null)
		cols = 4;
	if(faceing == null)
		faceing = 2;
	var o = cge_create_anim_sprite(id, sprites_data_object, image_source, width, height, rows, cols, x, y, z, [[0,0]]);
	
	o.faceing = faceing;						// faceing of character (direction the character is looking at)
	o.moves = [];									// array with move commands
	
	// setting anim parameters
	o.clear_after_finished = false;		
	o.sleep = false;
	o.repeat = true;
	o.basic_frame_time = 10;
	
	o.special_sequences = [[],[],[],[]];  // array of special sequences that can be loaded
	o.speed = 5;										   // speed of movement
 	o.velocity = [0,0];									// current velocity
	o.hitbox = cge_create_rect(0,0,32,32);	// created hitbox which differs from own size
	
	o.col_spritesets = [];							// spritesets which character collides with
	o.map_collider = true;						// defines if character collides with map
	o.trough = false;									// if true the object doesnt collide anymore
	
	// show hitbox for debugging
	//o.show_hitbox = true;
	o.show_hitbox = false;
	
	// -----------------------------------------------------------------------------------
	// loads a special sequence
	// -----------------------------------------------------------------------------------
	o.load_sequence = function(sequence_key, faceing){
		if(faceing == null)
			faceing = this.faceing;
		if(this.special_sequences[this.faceing][sequence_key] != null)
			this.set_sequence(this.special_sequences[this.faceing][sequence_key]);
		else
			this.set_sequence(this.special_sequences[this.faceing]["stand"]);
	};
	
	// -----------------------------------------------------------------------------------
	// creates a new special sequence
	// -----------------------------------------------------------------------------------
	o.write_sequence = function(faceing, sequence_key, sequence){
		this.special_sequences[faceing][sequence_key] = sequence;
	};
	
	// -----------------------------------------------------------------------------------
	// returns hitbox
	// -----------------------------------------------------------------------------------
	o.get_hitbox = function(){
		return this.hitbox;
	};
	
	// define some basic sequences for movement
	o.write_sequence(2, "stand",[[0,0]]);
	o.write_sequence(3, "stand",[[0,1]]);
	o.write_sequence(1, "stand",[[0,2]]);
	o.write_sequence(0, "stand",[[0,3]]);
	o.write_sequence(2, "walk",[[0,0],[1,0],[2,0],[3,0]]);
	o.write_sequence(3, "walk",[[0,1],[1,1],[2,1],[3,1]]);
	o.write_sequence(1, "walk",[[0,2],[1,2],[2,2],[3,2]]);
	o.write_sequence(0, "walk",[[0,3],[1,3],[2,3],[3,3]]);
	
	// -----------------------------------------------------------------------------------
	// frame update
	// -----------------------------------------------------------------------------------
	o.update_anim = o.update;
	o.update = function(ctx){
		if(!this.moves_ready()){
			this.moves[0].update();
		}
		this.update_anim(ctx);
	};
	
	// -----------------------------------------------------------------------------------
	// defines if all move events are finished
	// -----------------------------------------------------------------------------------
	o.moves_ready = function(){
		return (this.moves.length == 0);
	}
	
	// -----------------------------------------------------------------------------------
	// draws image to canvas (automatically called in sprites_draw)
	// -----------------------------------------------------------------------------------
	o.draw = function(ctx){
		if(this.img == null){
			this.img = new Image();
			this.img.src = this.image_source;
		}
		var width_image = this.get_width();
		var height_image = this.get_height();
		var x_image = this.col_index*width_image;
		var y_image = this.row_index*height_image;
		ctx.globalAlpha = this.opacity;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x-0.5*(this.zoom_x*width_image-this.hitbox.width), this.y-this.zoom_y*height_image+this.hitbox.height, width_image*this.zoom_x, height_image*this.zoom_y);
		if(this.show_hitbox){
			ctx.fillStyle="rgb(255,0,0)";
			ctx.globalAlpha = 0.5;
			ctx.fillRect(this.x,this.y,this.hitbox.width,this.hitbox.height); 
			ctx.globalAlpha = 1;
		}
	};
	
	// -----------------------------------------------------------------------------------
	// adds a move command
	// -----------------------------------------------------------------------------------
	o.add_move = function(move){
		this.moves.push(move);
	};
	
	// -----------------------------------------------------------------------------------
	// adds a collision spriteset
	// -----------------------------------------------------------------------------------
	o.add_col_spriteset = function(set_id){
		this.col_spritesets.push(this.sprites_data_object.spritesets[set_id]);
		this.sprites_data_object.spritesets[set_id].add_sprite(this);
	};
	
	// -----------------------------------------------------------------------------------
	// deletes image (at next frame)
	// -----------------------------------------------------------------------------------
	o.remove = function(){
		this.sprites_data_object.remove_image(this);
		for(var i=0; i < this.spritesets.length; i++){
			this.sprites_data_object.spritesets[this.spritesets[i]].remove_sprite(this);
		}
		for(var i=0; i < this.col_spritesets.length; i++){
			this.sprites_data_object.spritesets[this.col_spritesets[i]].remove_sprite(this);
		}
	};
	
	// loads default sequence
	o.load_sequence("stand");
	return o;
}