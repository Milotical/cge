/* ======================================
			CGE SPRITES DATA
			----------------------------------------------------------
			manages all images, sprites etc.
====================================== */ 

// -----------------------------------------------------------------------------------
// creates and returns sprites_data object
// -----------------------------------------------------------------------------------
function CGE_Sprites_Data(main_object){
	this.main = main_object;		// assiciation to the main object 
	this.images = [];						// array including all displayes sprites
	this.spritesets = {};					// list of all spritesets
	this.id_images = {};				// list of sprites sorted my ids
}	
	
// -----------------------------------------------------------------------------------
// add image (automatically called when image etc. was created)
// -----------------------------------------------------------------------------------
CGE_Sprites_Data.prototype.add_image = function(image){
	this.id_images[image.id] = image;
	this.images.push(image);
}

CGE_Sprites_Data.prototype.get_image_by_id = function(id){
	return this.id_images[id];
}

// -----------------------------------------------------------------------------------
// remove image by its id
// -----------------------------------------------------------------------------------
CGE_Sprites_Data.prototype.remove_image_id = function(image_id){
	var image = this.get_image_by_id(image_id);
	this.remove_image(image);
}

// -----------------------------------------------------------------------------------
// remove image (automatocally called when image was removed)
// -----------------------------------------------------------------------------------
CGE_Sprites_Data.prototype.remove_image = function(image){
	var index = this.images.indexOf(image);
	delete this.id_images[image.id];
	this.images.splice(index, 1);
}

// -----------------------------------------------------------------------------------
// forgets all images (can be called after e.g. a scene to delete all images)
// -----------------------------------------------------------------------------------
CGE_Sprites_Data.prototype.remove_all_images = function(){
	this.images = [];
	this.id_images = {};
	this.spritesets = [];
}

// -----------------------------------------------------------------------------------
// frame update for all images (automatically called in main loop)
// 	(important for animated sprites)
// -----------------------------------------------------------------------------------
CGE_Sprites_Data.prototype.update = function(){
	for(var i=0; i < this.images.length; i++){
		this.images[i].update();
	}
}

// -----------------------------------------------------------------------------------
// draws images to canvas element (should be called in scene-frame update)
// -----------------------------------------------------------------------------------
CGE_Sprites_Data.prototype.draw_images = function(ctx, z_min, z_max){
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
}

// -----------------------------------------------------------------------------------
// created spriteset with given id
// -----------------------------------------------------------------------------------
CGE_Sprites_Data.prototype.create_spriteset = function(id){
	this.spritesets[id] = new CGE_Spriteset(this);
}

CGE_Sprites_Data.prototype.prepare_save = function(){
	for(var i=0; i < this.images.length; i++){
		this.images[i].prepare_save();
	}
	for(var i=0; i < this.spritesets.length; i++){
		this.spritesets[i].prepare_save();
	}
	this.id_images = {};
	this.main = null;
}

CGE_Sprites_Data.prototype.reload_save = function(main){
	for(var i=0; i < this.images.length; i++){
		this.images[i].reload_save(main);
		this.id_images[this.images[i].id] = this.images[i];
	}
	for(var i in this.spritesets){
		this.spritesets[i].reload_save(main);
	}
	this.main = main;
}

// =================================================================================================

/* ======================================
			CGE SPRITESET
			----------------------------------------------------------
			a set of sprites which can check collisions
====================================== */ 
function CGE_Spriteset(sprites_data){
	this.sprites = [];									// array with sprites of this set
	this.sprites_data = sprites_data;		// association to trigger_data
}	
	
// -----------------------------------------------------------------------------------
// adds sprite to the spriteset
// -----------------------------------------------------------------------------------
CGE_Spriteset.prototype.add_sprite = function(sprite){
	this.sprites.push(sprite.id);
}

// -----------------------------------------------------------------------------------
// removes sprite from spriteset
// -----------------------------------------------------------------------------------
CGE_Spriteset.prototype.remove_sprite = function(sprite){
	delete this.sprites[sprite.id];
	this.sprites = this.sprites.filter(function(){return true});
}

// -----------------------------------------------------------------------------------
// removes all sprites from spriteset
// -----------------------------------------------------------------------------------
CGE_Spriteset.prototype.remove_all = function(){
	this.sprites = [];
}

CGE_Spriteset.prototype.prepare_save = function(){
	this.sprites_data = null;
}

CGE_Spriteset.prototype.reload_save = function(main){
	this.sprites_data = main.sprites_data;
}


// -----------------------------------------------------------------------------------
// checks if given object has an overlap with one or more objects of this set
//		chara				width & height are taken from this object
//		new_r = [x,y]   position checked
//		(dir					direction (only interesting for trigger events))
// -----------------------------------------------------------------------------------
CGE_Spriteset.prototype.check_collision = function(chara, new_r, dir){
	var return_value = false;
	var b, s;
	var c = chara.get_hitbox();
	if(new_r == null){
		new_r = [chara.x, chara.y];
	}
	for(var i=0; i < this.sprites.length; i++){
		b = this.sprites_data.get_image_by_id(this.sprites[i]).get_hitbox();
		s = this.sprites_data.get_image_by_id(this.sprites[i]);
		if(!(new_r[0]+c.width <= s.x || new_r[0] >= s.x+b.width || new_r[1]+c.height <= s.y || new_r[1] >= s.y+b.height) && chara != s){
			this.sprites_data.main.trigger_data.update("collision",[chara, this.sprites[i], dir]);
			return_value = true;
		}
	}
	return return_value;
}

// =================================================================================================

/* ======================================
			CGE RECT
			----------------------------------------------------------
			Object representing a rect with position x,y and width,height
====================================== */ 
// basic object for an area
function CGE_Rect(x,y,w,h){
	// position
	this.x = x;
	this.y = y;
	this.z = 100;
	// size
	this.width = w;
	this.height = h;
}
	
CGE_Rect.prototype.set_x = function(new_x){
	this.x = new_x;
}
CGE_Rect.prototype.set_y = function(new_y){
	this.y = new_y;
}
CGE_Rect.prototype.set_z = function(new_z){
	this.z = new_z;
}
CGE_Rect.prototype.get_hitbox = function(){
	return this;
}

// -----------------------------------------------------------------------------------
// frame update template
// -----------------------------------------------------------------------------------
CGE_Rect.prototype.update = function(ctx){ }
	
// =================================================================================================

/* ======================================
			CGE IMAGE <- RECT
			----------------------------------------------------------
			Object representing a trivial image
====================================== */ 
CGE_Image.prototype = new CGE_Rect();
CGE_Image.prototype.constructor = CGE_Image;
function CGE_Image(id, sprites_data, image_source, width, height, x, y, z){
	if(x == null)
		x = 0;
	if(y == null)
		y = 0;
	if(z == null)
		z = 100;
		
	CGE_Rect.call(this,x,y,width,height);
	
	this.variables = {};
	
	this.id = id;
	this.image_source = image_source;	// path of used image
	this.z = z;													// the z-priority of the image
	this.zoom_x = 1.0;									// zoom factors
	this.zoom_y = 1.0;
	this.sprites_data = sprites_data; // association to data objects (to add and remove itself)
	
	this.visible = true;									// visibility of image
	this.opacity = 1.0;										// opacity of image
	this.spritesets = [];									// list of own spriteset-ids
}
	
// -----------------------------------------------------------------------------------
// draws image to canvas (automatically called in sprites_draw)
// -----------------------------------------------------------------------------------
CGE_Image.prototype.draw = function(ctx){
	if(this.img == null){
		this.img = new Image();
		this.img.src = this.image_source;
	}
	ctx.globalAlpha = this.opacity;
	ctx.drawImage(this.img, 0, 0,this.width, this.height, this.x, this.y, this.width*this.zoom_x, this.height*this.zoom_y);
}

// -----------------------------------------------------------------------------------
// deletes image (at next frame)
// -----------------------------------------------------------------------------------
CGE_Image.prototype.remove = function(){
	this.sprites_data.remove_image(this);
	for(var i=0; i < this.spritesets.length; i++){
		this.sprites_data.spritesets[this.spritesets[i]].remove_sprite(this);
	}
}

// -----------------------------------------------------------------------------------
// returns display size
// -----------------------------------------------------------------------------------
CGE_Image.prototype.get_width = function(){
	return this.width;
}
CGE_Image.prototype.get_height = function(){
	return this.height;
}

CGE_Image.prototype.prepare_save = function(){
	this.sprites_data = null;
	this.img = null;
}

CGE_Image.prototype.reload_save = function(main){
	this.sprites_data = main.sprites_data;
}

// =================================================================================================

/* ======================================
			CGE SPRITE <- IMAGE
			----------------------------------------------------------
			Object representing a tiled image = sprite
====================================== */ 
CGE_Sprite.prototype = new CGE_Image();
CGE_Sprite.prototype.constructor = CGE_Sprite;

function CGE_Sprite(id, sprites_data, image_source, width, height, rows, cols, x, y, z){
	CGE_Image.call(this, id, sprites_data, image_source, width, height, x, y, z);
	if(rows == null)
		rows = 4;
	if(cols == null)
		cols = 4;	
	this.n_rows = rows;		// number of rows 
	this.n_cols = cols;			// number of columns
	this.row_index = 0;			// current row
	this.col_index = 0;			// current collumn
}	
	
// -----------------------------------------------------------------------------------
// sets both indices at once
// -----------------------------------------------------------------------------------
CGE_Sprite.prototype.set_index = function(x_index, y_index){
	this.row_index = x_index; 
	this.col_index = y_index;
}

// -----------------------------------------------------------------------------------
// draws image to canvas (automatically called in sprites_draw)
// -----------------------------------------------------------------------------------
CGE_Sprite.prototype.draw = function(ctx){
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
}

// -----------------------------------------------------------------------------------
// returns display size
// -----------------------------------------------------------------------------------
CGE_Sprite.prototype.get_width = function(){
	return this.width/this.n_cols;
}
CGE_Sprite.prototype.get_height = function(){
	return this.height/this.n_rows;
}

// =================================================================================================

/* ======================================
			CGE ANIM SPRITE <- SPRITE
			----------------------------------------------------------
			Object representing a animated tiled image
====================================== */ 
CGE_Anim_Sprite.prototype = new CGE_Sprite();
CGE_Anim_Sprite.prototype.constructor = CGE_Anim_Sprite;

function CGE_Anim_Sprite(id, sprites_data, image_source, width, height, rows, cols, x, y, z, frame_sequence){
	CGE_Sprite.call(this, id, sprites_data, image_source, width, height, rows, cols, x, y, z);
	if(frame_sequence == null)
		frame_sequence = [[0,0]];
	this.frame_sequence = frame_sequence;	// current frame sequence e.g. [  [0,0]  ,  [0,1,15]  , ...] (each sub-array has structure [col_index, row_index, frames]) 
	this.frame_sequence_index  = 0;					// current frame index (defines which sub-array of sequence represents current state)
	this.basic_frame_time = 30;								// basic display time of one frame (used if no 3rd elemnt in sub-array)
	this.sleep = false;												// if true the current state is frezed
	this.repeat = false;												// defines if animation will be repeated	
	this.time_index  = 0;											// frame counter	
	this.clear_after_finished = true;						// defines if image is terminated after animation finished
	
	// setting col and row index
	this.col_index = this.frame_sequence[0][0];
	this.row_index = this.frame_sequence[0][1];
	
}
	
// -----------------------------------------------------------------------------------
// frame update (auto called)
// -----------------------------------------------------------------------------------
CGE_Anim_Sprite.prototype.update = function(ctx){
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
}

// -----------------------------------------------------------------------------------
// called to change sequence and stop current animation
// -----------------------------------------------------------------------------------
CGE_Anim_Sprite.prototype.set_sequence = function(new_sequence, repeat){
	if(repeat != null)
		this.repeat = repeat;
	this.frame_sequence = new_sequence;
	this.time_index = 0;
	this.frame_sequence_index = 0;
	var new_sequence_frame = this.frame_sequence[0];
	this.col_index = new_sequence_frame[0];
	this.row_index = new_sequence_frame[1];
}

// -----------------------------------------------------------------------------------
// draws image to canvas (automatically called in sprites_draw)
// -----------------------------------------------------------------------------------
CGE_Anim_Sprite.prototype.draw = function(ctx){
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
}

// =================================================================================================

/* ======================================
			CGE CHARACTER <- ANIM SPRITE
			----------------------------------------------------------
			Object representing a character-sprite
			a charactrer sprite is an animated sprite with some
			basic functionallity for walking around and colliding
====================================== */ 
CGE_Character.prototype = new CGE_Anim_Sprite();
CGE_Character.prototype.constructor = CGE_Character;

function CGE_Character(id, sprites_data, image_source, width, height, rows, cols, x, y, z, facing){
	if(rows == null)
		rows = 4;
	if(cols == null)
		cols = 4;
	if(facing == null)
		facing = 2;
	CGE_Anim_Sprite.call(this, id, sprites_data, image_source, width, height, rows, cols, x, y, z, [[0,0]]);
	
	this.facing = facing;						// facing of character (direction the character is looking at)
	this.moves = [];									// array with move commands
	
	// setting anim parameters
	this.clear_after_finished = false;		
	this.sleep = false;
	this.repeat = true;
	this.basic_frame_time = 10;
	
	this.special_sequences = [{},{},{},{}];  // array of special sequences that can be loaded
	this.speed = 5;										   // speed of movement
 	this.velocity = [0,0];									// current velocity
	this.hitbox = new CGE_Rect(0,0,32,32);	// created hitbox which differs from own size
	
	this.col_spritesets = [];							// spritesets which character collides with
	this.map_collider = true;						// defines if character collides with map
	this.trough = false;									// if true the object doesnt collide anymore
	
	// show hitbox for debugging
	//this.show_hitbox = true;
	this.show_hitbox = false;
	
	// define some basic sequences for movement
	this.write_sequence(2, "stand",[[0,0]]);
	this.write_sequence(3, "stand",[[0,1]]);
	this.write_sequence(1, "stand",[[0,2]]);
	this.write_sequence(0, "stand",[[0,3]]);
	this.write_sequence(2, "walk",[[0,0],[1,0],[2,0],[3,0]]);
	this.write_sequence(3, "walk",[[0,1],[1,1],[2,1],[3,1]]);
	this.write_sequence(1, "walk",[[0,2],[1,2],[2,2],[3,2]]);
	this.write_sequence(0, "walk",[[0,3],[1,3],[2,3],[3,3]]);
	
	// loads default sequence
	this.load_sequence("stand");
}
	
// -----------------------------------------------------------------------------------
// loads a special sequence
// -----------------------------------------------------------------------------------
CGE_Character.prototype.load_sequence = function(sequence_key, facing){
	if(facing == null)
		facing = this.facing;
	if(this.special_sequences[this.facing][sequence_key] != null)
		this.set_sequence(this.special_sequences[this.facing][sequence_key]);
	else
		this.set_sequence(this.special_sequences[this.facing]["stand"]);
}

// -----------------------------------------------------------------------------------
// creates a new special sequence
// -----------------------------------------------------------------------------------
CGE_Character.prototype.write_sequence = function(facing, sequence_key, sequence){
	this.special_sequences[facing][sequence_key] = sequence;
}

// -----------------------------------------------------------------------------------
// returns hitbox
// -----------------------------------------------------------------------------------
CGE_Character.prototype.get_hitbox = function(){
	return this.hitbox;
}

// -----------------------------------------------------------------------------------
// frame update
// -----------------------------------------------------------------------------------
//o.update_anim = o.update;
CGE_Character.prototype.update = function(ctx){
	if(!this.moves_ready()){
		this.moves[0].update(this);
	}
	CGE_Anim_Sprite.prototype.update.call(this, ctx);
}

// -----------------------------------------------------------------------------------
// defines if all move events are finished
// -----------------------------------------------------------------------------------
CGE_Character.prototype.moves_ready = function(){
	return (this.moves.length == 0);
}

// -----------------------------------------------------------------------------------
// draws image to canvas (automatically called in sprites_draw)
// -----------------------------------------------------------------------------------
CGE_Character.prototype.draw = function(ctx){
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
}

// -----------------------------------------------------------------------------------
// adds a move command
// -----------------------------------------------------------------------------------
CGE_Character.prototype.add_move = function(move){
	this.moves.push(move);
}

// -----------------------------------------------------------------------------------
// adds a collision spriteset
// -----------------------------------------------------------------------------------
CGE_Character.prototype.add_col_spriteset = function(set_id){
	this.col_spritesets.push(set_id);
	this.sprites_data.spritesets[set_id].add_sprite(this);
}

// -----------------------------------------------------------------------------------
// deletes image (at next frame)
// -----------------------------------------------------------------------------------
CGE_Character.prototype.remove = function(){
	this.sprites_data.remove_image(this);
	for(var i=0; i < this.spritesets.length; i++){
		this.sprites_data.spritesets[this.spritesets[i]].remove_sprite(this);
	}
	for(var i=0; i < this.col_spritesets.length; i++){
		this.sprites_data.spritesets[this.col_spritesets[i]].remove_sprite(this);
	}
}

CGE_Character.prototype.prepare_save = function(){
	CGE_Anim_Sprite.prototype.prepare_save.call(this);
	for(var m=0; m < this.moves.length; m++){
		this.moves[m].move_interpreter = null;
	}
}

CGE_Character.prototype.reload_save = function(main){
	CGE_Anim_Sprite.prototype.reload_save.call(this, main);
	for(var m=0; m < this.moves.length; m++){
		this.moves[m].move_interpreter = main.move_interpreter;
	}
}
