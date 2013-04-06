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
	if(image != null)
		image.remove();
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

CGE_Sprites_Data.prototype.get_unique_id = function(id){
	var i = 0;
	while(this.get_image_by_id(id+i) != null){
		i++;
	}
	return (id+i);
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
	var a = this.sprites;
	var index = a.indexOf(sprite);
	this.sprites.splice(index, 1);
	//this.sprites = this.sprites.filter(function(){return true});
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
			this.sprites_data.main.trigger_data.update("collision",[chara, this.sprites[i], dir, this]);
			this.sprites_data.main.trigger_data.update("collider_"+chara.id,[this.sprites[i], dir]);
			this.sprites_data.main.trigger_data.update("collided_"+this.sprites[i].id,[chara, dir]);
			return_value = true;
		}
	}
	return return_value;
}

// =================================================================================================

/* ======================================
			CGE AREA
			----------------------------------------------------------
			Object representing a rect with position x,y and width,height
====================================== */ 
// basic object for an area
function CGE_Area(x,y,w,h,sprites_data){
	// position
	this.x = x;
	this.y = y;
	this.z = 100;
	// size
	this.width = w;
	this.height = h;
	this.sprites_data = sprites_data;
	this.spritesets = [];
	this.type = "CGE_Area";
	this.variables = {};
	
	this.show = false;
}
	
CGE_Area.prototype.set_x = function(new_x){
	this.x = new_x;
}
CGE_Area.prototype.set_y = function(new_y){
	this.y = new_y;
}
CGE_Area.prototype.set_z = function(new_z){
	this.z = new_z;
}
CGE_Area.prototype.get_hitbox = function(){
	return this;
}
// -----------------------------------------------------------------------------------
// returns display size
// -----------------------------------------------------------------------------------
CGE_Area.prototype.get_width = function(){
	return this.width;
}
CGE_Area.prototype.get_height = function(){
	return this.height;
}

// -----------------------------------------------------------------------------------
// deletes image (at next frame)
// -----------------------------------------------------------------------------------
CGE_Area.prototype.remove = function(){
	this.sprites_data.remove_image(this);
	for(var i=0; i < this.spritesets.length; i++){
		this.sprites_data.spritesets[this.spritesets[i]].remove_sprite(this);
	}
}

CGE_Area.prototype.prepare_save = function(){
	this.sprites_data = null;
}

CGE_Area.prototype.reload_save = function(main){
	this.sprites_data = main.sprites_data;
}

// -----------------------------------------------------------------------------------
// frame update template
// -----------------------------------------------------------------------------------
CGE_Area.prototype.update = function(){ }
CGE_Area.prototype.draw = function(ctx){ 
	if(this.show){
		ctx.fillStyle="rgb(0,255,0)";
		ctx.globalAlpha = 0.5;
		ctx.fillRect(this.x,this.y,this.width,this.height); 
		ctx.globalAlpha = 1;
	}
}
	
// =================================================================================================

/* ======================================
			CGE IMAGE <- AREA
			----------------------------------------------------------
			Object representing a trivial image
====================================== */ 
CGE_Image.prototype = new CGE_Area();
CGE_Image.prototype.constructor = CGE_Image;
function CGE_Image(id, sprites_data, image_source, width, height, x, y, z){
	if(x == null)
		x = 0;
	if(y == null)
		y = 0;
	if(z == null)
		z = 100;
		
	CGE_Area.call(this,x,y,width,height,sprites_data);
	
	this.id = id;
	this.image_source = image_source;	// path of used image
	this.z = z;													// the z-priority of the image
	this.zoom_x = 1.0;									// zoom factors
	this.zoom_y = 1.0;
	
	this.visible = true;									// visibility of image
	this.opacity = 1.0;										// opacity of image
	this.spritesets = [];									// list of own spriteset-ids
	
	this.type = "CGE_Image";
}

// -----------------------------------------------------------------------------------
// draws image to canvas (automatically called in sprites_draw)
// -----------------------------------------------------------------------------------
CGE_Image.prototype.draw = function(ctx){
	if(this.img == null){
		this.img = new Image();
		this.img.src = this.image_source;
	}
	if(this.visible){
		ctx.globalAlpha = this.opacity;
		ctx.drawImage(this.img, 0, 0,this.width, this.height, this.x, this.y, this.width*this.zoom_x, this.height*this.zoom_y);
	}
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
	
	this.type = "CGE_Sprite";
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
	if(this.visible){
		var width_image = this.get_width();
		var height_image = this.get_height();
		var x_image = this.col_index*width_image;
		var y_image = this.row_index*height_image;
		ctx.globalAlpha = this.opacity;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x, this.y, width_image*this.zoom_x, height_image*this.zoom_y);
	}
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
	
	this.type = "CGE_Anim_Sprite";
	this.anim_trigger = false;
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
				if(this.anim_trigger)
					this.sprites_data.main.trigger_data.update("finished_anim_"+this.id, [this]);
				if(this.clear_after_finished){
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
	if(this.visible){
		var width_image = this.get_width();
		var height_image = this.get_height();
		var x_image = this.col_index*width_image;
		var y_image = this.row_index*height_image;
		ctx.globalAlpha = this.opacity;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x, this.y, width_image*this.zoom_x, height_image*this.zoom_y);
	}
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
	this.hitbox = new CGE_Area(0,0,32,32);	// created hitbox which differs from own size
	
	this.col_spritesets = [];							// spritesets which character collides with
	this.map_collider = true;						// defines if character collides with map
	this.trough = false;									// if true the object doesnt collide anymore
	
	// show hitbox for debugging
	//this.show_hitbox = true;
	this.show_hitbox = false;
	
	this.type = "CGE_Character";
	
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
	if(this.visible){
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

/* ======================================
			CGE TEXTAREA <- AREA
			----------------------------------------------------------
			Object representing a formatted text
====================================== */ 
CGE_Text.prototype = new CGE_Area();
CGE_Text.prototype.constructor = CGE_Text;
function CGE_Text(id, text, sprites_data, width, height, x, y, z,i_source, i_cols, i_rows, i_width, i_height,f_source, f_cols, f_rows, f_width, f_height){
	if(x == null)
		x = 0;
	if(y == null)
		y = 0;
	if(z == null)
		z = 100;
	if(text == null)
		text = "";
	CGE_Area.call(this,x,y,width,height);
	this.z  = z;
	this.id = id;										
	this.zoom_x = 1.0;									
	this.zoom_y = 1.0;
	this.sprites_data = sprites_data;
	this.visible = true;								
	this.opacity = 1.0;
	this.text = text;
	this.autobreak = true;
	this.line_spacing = 5;
	this.size = 24;
	this.bold = false;
	this.italic = false;
	this.font = "Arial";
	this.i_source = i_source;
	this.i_cols = i_cols;
	this.i_rows = i_rows;
	this.i_width = i_width;
	this.i_height = i_height;
	this.color = "rgb(0,0,0)";
	this.type = "CGE_Text";
	this.f_source = f_source;
	this.f_cols = f_cols;
	this.f_rows = f_rows;
	this.f_width = f_width;
	this.f_height = f_height;
	this.refresh();
}

CGE_Text.prototype.set_text = function(new_text){
	this.text = new_text;
	this.refresh();
}

CGE_Text.prototype.create_real_words = function(text){
	var words = [];
	var all_letters = text.split("");
	var temp_words = text.split(" ");
	// format commands filter
	for(var w=0; w < temp_words.length; w++){
		var temp_word = temp_words[w];
		var letters = temp_word.split("");
		var words_in_letters = [""];
		var i = 0;
		var k = 0;
		while(i < letters.length){
			// linebreaks
			if(letters[i] == "/" && letters[i+1] == "n"){
				if(words_in_letters[k] != "") 
					k++;
				words_in_letters[k] = "/n";
				k++;
				i += 2;
				if(letters[i] != null)
					words_in_letters[k] = "";
			}
			if(letters[i] == "[" && i != 0){
				k++;
				words_in_letters[k] = "";
			}
			if(letters[i] == "]"){
				words_in_letters[k] += letters[i];
				k++;
				i++;
				if(letters[i] != null)
					words_in_letters[k] = "";
			}
			if(letters[i] != null)
				words_in_letters[k] += letters[i];
			i++;
		}
		words = words.concat(words_in_letters);
	}
	return words;
}

CGE_Text.prototype.refresh = function(){
	// split text in words
	this.words = this.create_real_words(this.text);
	this.height_image = this.i_height/this.i_rows;
	this.width_image = this.i_width/this.i_cols;
	if(this.f_source != null){
		this.height_font_image = this.f_height/this.f_rows;
		this.width_font_image = this.f_width/this.f_cols;
	}
}

CGE_Text.prototype.draw = function(ctx){
	if(this.visible){
		var up = 0;
		var down = 0;
		var mem_color = this.color;
		var mem_size = this.size;
		var mem_font = this.font;
		ctx.fillStyle = this.color;
		// show text
		var y = this.size;
		var x = 0;
		for(var j=0; j < this.words.length; j++){
			var invisible_word = false;
			var word = this.words[j];
			// forced linebreak
			if(word == "/n"){
				y += (this.size+this.line_spacing);
				x = 0;
			}
			if(this.is_format_command(word)){
				var format_word = true;
				var spl = word.split("=");
				if(spl[0] == "[c"){ // color
					if(spl[1] != null){
						mem_color = this.color;
						var rgb = spl[1].split("]")[0];
						if(rgb != null)
							this.color = "rgb("+rgb+")";
					}
					invisible_word = true;
				}else if(word == "[/c]"){
					this.color = mem_color;
					invisible_word = true;
				}else if(spl[0] == "[p"){ // picture/icon
					if(spl[1] != null){
						var spl2 = spl[1].slice(0, spl[1].length-1).split(",");
						for(var i=0; i < spl2.length; i++){
							var n = spl2[i];
							if(n != null){
								if(this.img == null){
									this.img = new Image();
									this.img.src = this.i_source;
								}
								var display_height = this.size;
								var display_width = this.width_image*display_height/this.height_image;
								var x_image = (n%this.i_cols)*this.width_image;
								var y_image = parseInt(n/this.i_cols)*this.height_image;
								if(this.width != null && x + display_width > this.width){
									if(this.autobreak){
										y += (this.size+this.line_spacing);
									}else{
										break;
									}
									x = 0;
								}
								ctx.globalAlpha = this.opacity;
								ctx.drawImage(this.img, x_image, y_image,this.width_image, this.height_image, this.x+x, this.y+y-up+down-this.size, display_width, display_height);
								x += this.width_image;
							}
						}
						if(this.f_source == null){
							x += ctx.measureText(" ").width;
						}else{
							x += this.width_font_image;
						}
					}
				}else if(word == "[b]"){
					this.bold = true;
					invisible_word = true;
				}else if(word == "[/b]"){
					this.bold = false;
					invisible_word = true;
				}else if(word == "[i]"){
					this.italic = true;
					invisible_word = true;
				}else if(word == "[/i]"){
					this.italic = false;
					invisible_word = true;
				}else if(spl[0] == "[s"){
					if(spl[1] != null){
						var s = spl[1].split("]")[0];
						if(s != null){
							mem_size = this.size;
							this.size = parseInt(s);
						}
					}
					invisible_word = true;
				}else if(word == "[/s]"){ 
					this.size = mem_size;
					invisible_word = true;
				}else if(spl[0] == "[f"){ 
					var fo = word.split("=")[1].split("]")[0];
					if(fo != null){
						mem_font = this.font;
						this.font = fo;
					}
					invisible_word = true;
				}else if(word == "[/f]"){ 
					this.font = mem_font;
					invisible_word = true;
				}else if(spl[0] == "[u"){
					if(spl[1] != null)
						up = parseInt(spl[1].split("]")[0]);
					invisible_word = true;
				}else if(word == "[/u]"){ 
					up = 0;
					invisible_word = true;
				}else if(spl[0] == "[d"){
					if(spl[1] != null)
						down = parseInt(spl[1].split("]")[0]);
					invisible_word = true;
				}else if(word == "[/d]"){
					down = 0;
					invisible_word = true;
				}else if(word == "[w]"){
					if(this.f_source == null){
						x += ctx.measureText(" ").width;
					}else{
						x += this.width_font_image;
					}
				}
			}
			// y out of range
			if(this.height != null && y+this.size > this.height){
				break;
			}
			if(word != null && word != "/n" && !this.is_format_command(word)){
				// x out of range
				if(this.check_autp_linebreak(ctx, x, word, j)){
					// auto linebreak
					if(this.autobreak){
						y += (this.size+this.line_spacing);
					}else{
						break;
					}
					x = 0;
				}
				this.set_font_parameter(ctx);
				if(this.f_source == null){
					ctx.fillStyle = this.color;
					ctx.fillText(word, this.x+x, this.y+y-up+down);
					x += ctx.measureText(word).width
				}else{
					if(this.font_img == null){
						this.font_img = new Image();
						this.font_img.src = this.f_source;
					}
					for(var l=0; l < word.length; l++){
						var n = (word.charCodeAt(l)-33);
						var display_height = this.size;
						var display_width = this.width_font_image*display_height/this.height_font_image;
						var x_image = (n%this.f_cols)*this.width_font_image;
						var y_image = parseInt(n/this.f_cols)*this.height_font_image;
						ctx.globalAlpha = this.opacity;
						ctx.drawImage(this.font_img, x_image, y_image,this.width_font_image, this.height_font_image, this.x+x, this.y+y-up+down-this.size, display_width, display_height);
						x += this.width_font_image;
					}
				}
				if(this.f_source == null){
					x += ctx.measureText(" ").width;
				}else{
					x += this.width_font_image;
				}
			}
		}
		this.color = mem_color;
		this.size = mem_size;
		this.font = mem_font;
		this.bold = false;
		this.italic = false;
	}
}

CGE_Text.prototype.check_autp_linebreak = function(ctx, x, word){
	return this.width != null &&  ((this.f_source == null && x+ctx.measureText(word).width > this.width)  || 	(this.f_source != null && x+word.length*this.width_font_image > this.width));
}

CGE_Text.prototype.set_font_parameter = function(ctx){
	var f = "";
	if(this.italic)
		f = "italic ";
	if(this.bold)
		f += "bold ";
	f += this.size+"pt ";
	ctx.font = f+this.font;
}

CGE_Text.prototype.update = function(){ }

CGE_Text.prototype.is_format_command = function(word){
	return (word.split("")[0] == "[");
}

CGE_Text.prototype.remove = function(){
	this.sprites_data.remove_image(this);
	for(var i=0; i < this.spritesets.length; i++){
		this.sprites_data.spritesets[this.spritesets[i]].remove_sprite(this);
	}
}

CGE_Text.prototype.prepare_save = function(){
	this.sprites_data = null;
	this.img = null;
	this.font_img = null;
}

CGE_Text.prototype.reload_save = function(main){
	this.sprites_data = main.sprites_data;
}

/* ======================================
			CGE FLOAT_TEXT <- TEXT
			----------------------------------------------------------
			Object representing a formatted text
====================================== */ 
CGE_Float_Text.prototype = new CGE_Text();
CGE_Float_Text.prototype.constructor = CGE_Float_Text;
function CGE_Float_Text(id, text, sprites_data, width, height, x, y, z,i_source, i_cols, i_rows, i_width, i_height,f_source, f_cols, f_rows, f_width, f_height, letter_duration){
	if(text == null)
		text = "";
	this.full_text = text;
	this.text = "";
	CGE_Text.call(this,id, this.text, sprites_data, width, height, x, y, z,i_source, i_cols, i_rows, i_width, i_height,f_source, f_cols, f_rows, f_width, f_height);
	this.frame_index = 0;
	if(letter_duration == null)
		letter_duration = 6;
	this.letter_duration = letter_duration;
	this.type = "CGE_Float_Text";
	this.skip_frames = 0;
	this.complete_trigger = false;
}

CGE_Float_Text.prototype.show_complete_text = function(){
	this.frame_index = this.full_text.length*this.letter_duration;
}

CGE_Float_Text.prototype.completed = function(){
	return this.frame_index > this.full_text.length*this.letter_duration;
}

CGE_Float_Text.prototype.complete = function(){
	this.frame_index =  this.full_text.length*this.letter_duration+1;
}

CGE_Float_Text.prototype.update = function(){
	if(this.completed() && this.complete_trigger){
		this.sprites_data.main.trigger_data.update("text_complete_"+this.id,[this]);
	}
	if(this.skip_frames == 0){
		var letter_index = parseInt(this.frame_index/this.letter_duration);
		if(this.full_text[letter_index-1] == "/" && this.full_text[letter_index] == "n"){
			letter_index += 2;
			this.frame_index += 2*this.letter_duration;
		}
		if(this.full_text[letter_index-1] == "["){
			if(this.full_text[letter_index] == "p")
				this.skip_frames = this.letter_duration*2;
			letter_index += 2;
			this.frame_index += 2*(this.letter_duration);
			while((this.full_text[letter_index-2] != "]" && !this.completed())){
				letter_index++;
				this.frame_index += (this.letter_duration);
			}
		}
		this.frame_index = parseInt(this.frame_index);
		this.text = this.full_text.slice(0, letter_index);
		this.refresh();
		this.frame_index++;
	}else{
		this.skip_frames--;
	}
}

CGE_Float_Text.prototype.refresh = function(){
	CGE_Text.prototype.refresh.call(this);
	this.full_words = this.create_real_words(this.full_text);
}

CGE_Float_Text.prototype.check_autp_linebreak = function(ctx, x, word, word_index){
	var word=this.full_words[word_index];
	return (this.f_source == null && x+ctx.measureText(word).width > this.width) || (this.f_source != null && x+word.length*this.width_font_image > this.width);
}

/* ======================================
			CGE SPEECH BUBBLE <- FLOAT TEXT
			----------------------------------------------------------
			Object representing a speech bubble
====================================== */ 
CGE_Speech_Bubble.prototype = new CGE_Float_Text();
CGE_Speech_Bubble.prototype.constructor = CGE_Speech_Bubble;
function CGE_Speech_Bubble(id, text, sprites_data, width, height, r, x0, y0, x, y, z,i_source, i_cols, i_rows, i_width, i_height,f_source, f_cols, f_rows, f_width, f_height, letter_duration){
	CGE_Float_Text.call(this,id, text, sprites_data, width, height, x, y, z,i_source, i_cols, i_rows, i_width, i_height,f_source, f_cols, f_rows, f_width, f_height, letter_duration);
	this.style = "black";
	this.line_width = 1;
	var w = parseInt(this.width);
	var h = parseInt(this.height);
	if(r > w/2)
		r = w/2;
	if(r > h/2)
		r = h/2;
	this.r = r;
	this.bg_color = "white";
	this.bg_opacity = 0.5;
	this.x0 = x0;
	this.y0 = y0;
	this.tail_base_length = 40;
	this.tail_offset = 40;
	this.tail_dir = 2;
	this.tail_style = "auto"; // autoX, autoY, fix
	this.type = "CGE_Speech_Bubble";
	this.status_img_id = null;
	this.visible = true;
}

CGE_Speech_Bubble.prototype.refresh_tail = function(){
	var x_center = this.x+this.width/2;
	var y_center = this.y+this.height/2;
	var dx = this.x0-x_center;
	var dy = this.y0-y_center;
	switch(this.tail_style){
		case "auto" :
			if(Math.abs(dx) > Math.abs(dy)){
				if(dx > 0){	
					this.tail_dir = 1;
				}else{
					this.tail_dir = 3;
				}
			}else{
				if(dy > 0){	
					this.tail_dir = 2;
				}else{
					this.tail_dir = 0;
				}
			}
			break;
		case "autoX" :
			if(dx > 0){	
				this.tail_dir = 1;
			}else{
				this.tail_dir = 3;
			}
			break;
		case "autoY" :	
			if(dy > 0){
				this.tail_dir = 2;
			}else{
				this.tail_dir = 0;
			}
			break;
	}
}

CGE_Speech_Bubble.prototype.draw = function(ctx){
	if(this.visible){
		this.refresh_tail();
		ctx.globalAlpha = this.bg_opacity;
		ctx.beginPath();
		ctx.strokeStyle = this.style;
		ctx.lineWidth = this.line_width;
		var x = parseInt(this.x - 0.29*this.r);
		var y = parseInt(this.y - 0.29*this.r);
		var w = parseInt(this.width+0.58*this.r);
		var h = parseInt(this.height+0.58*this.r);
		ctx.moveTo(x, y+this.r);
		// darw bubble:
		ctx.quadraticCurveTo(x,y,x+this.r,y);
		// top
		if(this.tail_dir == 0){
			ctx.lineTo(x+this.r+this.tail_offset, y);
			ctx.lineTo(this.x0, this.y0);
			ctx.lineTo(x+this.r+this.tail_offset+this.tail_base_length, y);
		}
		ctx.lineTo(x+w-this.r, y);
		ctx.quadraticCurveTo(x+w,y,x+w,y+this.r);
		// right
		if(this.tail_dir == 1){
			ctx.lineTo(x+w, y+this.r+this.tail_offset);
			ctx.lineTo(this.x0, this.y0);
			ctx.lineTo(x+w, y+this.r+this.tail_offset+this.tail_base_length);
		}
		ctx.lineTo(x+w, y+h-this.r);
		ctx.quadraticCurveTo(x+w,y+h,x+w-this.r,y+h);
		// down
		if(this.tail_dir == 2){
			ctx.lineTo(x+w-this.r-this.tail_offset, y+h);
			ctx.lineTo(this.x0, this.y0);
			ctx.lineTo(x+w-this.r-this.tail_offset-this.tail_base_length, y+h);
		}
		ctx.lineTo(x+this.r, y+h);
		ctx.quadraticCurveTo(x,y+h,x,y+h-this.r);
		// left
		if(this.tail_dir == 3){
			ctx.lineTo(x, y+h-this.r-this.tail_offset);
			ctx.lineTo(this.x0, this.y0);
			ctx.lineTo(x, y+h-this.r-this.tail_offset-this.tail_base_length);
		}
		ctx.lineTo(x, y+this.r);
		
		ctx.fillStyle = this.bg_color;
		ctx.fill();
		ctx.stroke();
		ctx.globalAlpha = this.opacity;
		CGE_Float_Text.prototype.draw.call(this, ctx);
	}
}

CGE_Speech_Bubble.prototype.update = function(){
	if(this.status_img_id != null){
		var i = this.sprites_data.get_image_by_id(this.status_img_id);
		if(i != null){
			i.z = this.z+1;
			i.x = this.x+this.width/2-i.get_width()/2;
			i.y = this.y+this.height-i.get_height()/2;
		}
	}
	CGE_Float_Text.prototype.update.call(this);
}

CGE_Speech_Bubble.prototype.remove = function(){
	CGE_Float_Text.prototype.remove.call(this);
	if(this.status_img_id != null){
		var i = this.sprites_data.get_image_by_id(this.status_img_id);
		if(i != null){
			i.remove();
		}
	}
}


/* ======================================
			CGE CHOICE BUBBLE <- FLOAT TEXT
			----------------------------------------------------------
			Object representing a speech bubble
====================================== */ 
CGE_Choice_Bubble.prototype = new CGE_Speech_Bubble();
CGE_Choice_Bubble.prototype.constructor = CGE_Choice_Bubble;
function CGE_Choice_Bubble(id, text, choices, sprites_data, width, height, r, x0, y0, x, y, z, choices_borders, choices_spacing, c_source, c_width, c_height, c_offsets, i_source, i_cols, i_rows, i_width, i_height,f_source, f_cols, f_rows, f_width, f_height, letter_duration){
	this.choices = choices;
	this.c_source = c_source;
	this.c_width = c_width;
	this.c_height = c_height;
	this.c_offsets = c_offsets;
	this.choices_borders = choices_borders;
	this.choices_spacing = choices_spacing;
	this.select_index = 0;
	this.choice_image_ids = [];
	CGE_Speech_Bubble.call(this, id, text, sprites_data, width, height, r, x0, y0, x, y, z,i_source, i_cols, i_rows, i_width, i_height,f_source, f_cols, f_rows, f_width, f_height, letter_duration);
	this.complete();
	for(var i=0; i < choices.length; i++){
		var x = this.x + this.choices_borders[0];
		var y  = this.y + this.choices_borders[1] + this.choices_spacing * i;
		var z = this.z + 1;
		var id = this.id+"_choice_"+i;
		var img = new CGE_Text(id, choices[i], this.sprites_data, null, null, x, y, z,i_source, i_cols, i_rows, i_width, i_height,f_source, f_cols, f_rows, f_width, f_height);
		this.choice_image_ids.push(id);
		this.sprites_data.add_image(img);
		if(this.sprites_data.main.scene_data.scene_id == "map"){
			this.sprites_data.main.map_data.images.push(img);
		}else{
			this.sprites_data.main.scene_data.images.push(img.id);
		}
	}
	if(c_source != null){
		var x = this.x + this.choices_borders[0] + this.c_offsets[0];
		var y  = this.y + this.choices_borders[1] + this.choices_spacing * this.select_index  + this.c_offsets[1];
		var z = this.z + 2;
		var id = this.id+"_cursor";
		var img = new CGE_Image(id, this.sprites_data, this.c_source, this.c_width, this.c_height, x, y, z);
		this.cursor_image_id = id;
		this.sprites_data.add_image(img);
		if(this.sprites_data.main.scene_data.scene_id == "map"){
			this.sprites_data.main.map_data.images.push(img);
		}else{
			this.sprites_data.main.scene_data.images.push(img.id);
		}
	}
}

CGE_Choice_Bubble.prototype.update = function(){
	CGE_Speech_Bubble.prototype.update.call(this);
	for(var i=0; i < this.choice_image_ids.length; i++){
		var x = this.x + this.choices_borders[0];
		var y  = this.y + this.choices_borders[1] + this.choices_spacing * i;
		var z = this.z + 1;
		var id = this.id+"_choice_"+i;
		var img = this.sprites_data.get_image_by_id(id);
		if(img != null){
			img.x = x;
			img.y = y;
			img.z = z;
		}
	}
	if(this.cursor_image_id != null){
		var x = this.x + this.choices_borders[0] + this.c_offsets[0];
		var y  = this.y + this.choices_borders[1] + this.choices_spacing * this.select_index  + this.c_offsets[1];
		var z = this.z + 2;
		var id = this.id+"_cursor";
		var img =  this.sprites_data.get_image_by_id(id);
		if(img != null){
			img.x = x;
			img.y = y;
			img.z = z;
		}
	}
}

CGE_Choice_Bubble.prototype.remove = function(){
	CGE_Speech_Bubble.prototype.remove.call(this);
	for(var i=0; i < this.choice_image_ids.length; i++){
		var img = this.sprites_data.get_image_by_id(this.choice_image_ids[i]);
		if(img != null)
			img.remove();
	}
	var id = this.id+"_cursor";
	var img =  this.sprites_data.get_image_by_id(id);
	if(img != null)
		img.remove();
}

/* ======================================
			WINDOW <- AREA
			----------------------------------------------------------
			Object representing a window with border
====================================== */ 
CGE_Window.prototype = new CGE_Area();
CGE_Window.prototype.constructor = CGE_Window;
function CGE_Window(id, sprites_data, width, height, x, y, z, windowskin, width_image, height_image){
	if(width < width_image)
		width = width_image;
	if(height < height_image)
		height = height_image;
	CGE_Area.call(this,x,y,width,height,sprites_data);
	this.z = z;
	this.windowskin = windowskin;
	this.width_image = width_image;
	this.height_image = height_image;
	this.opacity = 1.0;
	this.visible = true;
	this.type = "CGE_Window";
	this.id = id;
}

CGE_Window.prototype.draw = function(ctx){
	if(this.img == null){
		this.img = new Image();
		this.img.src = this.windowskin;
	}
	if(this.visible){
		var width_image = this.width_image/3;
		var height_image = this.height_image/3;
		ctx.globalAlpha = this.opacity;
		// Draw Background
		var x_image = width_image;
		var y_image = height_image;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x+width_image, this.y+height_image, this.width-2*width_image, this.height-2*height_image);
		// Darw Border
		// top
		var x_image = width_image;
		var y_image = 0;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x+width_image, this.y, this.width-2*width_image, height_image);
		// bottom
		var x_image = width_image;
		var y_image = 2*height_image;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x+width_image, this.y+this.height-height_image, this.width-2*width_image, height_image);
		// left
		var x_image = 0;
		var y_image = height_image;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x, this.y+height_image, width_image, this.height-2*height_image);
		// right
		var x_image = 2*width_image;
		var y_image = height_image;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x+this.width-width_image, this.y+height_image, width_image, this.height-2*height_image);
		// Draw corners
		var x_image = 0;
		var y_image = 0;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x, this.y, width_image, height_image);
		var x_image = 2*width_image;
		var y_image = 0;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x+this.width-width_image, this.y, width_image, height_image);
		var x_image = 0;
		var y_image = 2*height_image;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x, this.y+this.height-height_image, width_image, height_image);
		var x_image = 2*width_image;
		var y_image = 2*height_image;
		ctx.drawImage(this.img, x_image, y_image,width_image, height_image, this.x+this.width-width_image, this.y+this.height-height_image, width_image, height_image);
	}
}

CGE_Window.prototype.prepare_save = function(){
	this.sprites_data = null;
	this.img = null;
}

/* ======================================
			WINDOW SELECT <- WINDOW
			----------------------------------------------------------
			Object representing a window with border and a cursor
====================================== */ 
CGE_Window_Select.prototype = new CGE_Window();
CGE_Window_Select.prototype.constructor = CGE_Window_Select;
function CGE_Window_Select(id, sprites_data, width, height, x, y, z, windowskin, width_image, height_image, cursor_image_source, cursor_width, cursor_height, cursor_posi, cursor_sizes){
	CGE_Window.call(this,id, sprites_data, width, height, x, y, z, windowskin, width_image, height_image);
	this.type = "CGE_Window_Select";
	this.select_index  = 1;
	this.active = true;
	this.cursor_positions = cursor_posi;
	this.cursor_sizes = cursor_sizes;
	this.cursor_id = this.id+"_cursor";
	if(id != null){
		var img = new CGE_Image(this.cursor_id, this.sprites_data, cursor_image_source, cursor_width, cursor_height, 0, 0, this.z+1);
		this.sprites_data.add_image(img);
	}
}

CGE_Window_Select.prototype.update = function(){
	var c = this.sprites_data.get_image_by_id(this.cursor_id);
	if(c != null){
		if(this.select_index != 0){
			c.visible = this.visible;
			c.x = this.x + this.cursor_positions[this.select_index-1][0];
			c.y = this.y + this.cursor_positions[this.select_index-1][1];
			c.z = this.z + this.cursor_positions[this.select_index-1][2] + 1;
			c.zoom_x = this.cursor_sizes[this.select_index-1][0]/c.get_width();
			c.zoom_y = this.cursor_sizes[this.select_index-1][1]/c.get_height();
		}else{
			c.visible = false;
		}
	}
}


CGE_Window_Select.prototype.remove = function(){
	CGE_Window.prototype.remove.call(this);
	if(this.cursor_id != null){
		var i = this.sprites_data.get_image_by_id(this.cursor_id);
		if(i != null){
			i.remove();
		}
	}
}

/* ======================================
			WINDOW LIST <- WINDOW
			----------------------------------------------------------
			Object representing a window with a scrollable text-list
====================================== */ 
CGE_Window_List.prototype = new CGE_Window_Select();
CGE_Window_List.prototype.constructor = CGE_Window_List;
function CGE_Window_List(id ,list ,max_elements ,sprites_data, width, height, x, y, z, windowskin, width_image, height_image, cursor_image_source, cursor_width, cursor_height,cursor_offset, element_width, element_height, spacing, border,scroll_button_source, scroll_image_width, scroll_image_height, i_source, i_cols, i_rows, i_width, i_height,f_source, f_cols, f_rows, f_width, f_height){
	this.list = list;
	cursor_posi = [];
	cursor_sizes = [];
	this.max_elements = max_elements;
	this.element_width = element_width;
	this.element_height = element_height;
	this.cursor_offset = cursor_offset;
	this.border = border;
	for(var i=0; i < (this.max_elements[0]*this.max_elements[1]); i++){
		var ex = this.border[0]+(parseInt(i/this.max_elements[1]))*(spacing[0]+element_width)-cursor_offset[0];
		var ey = this.border[1]+(i%this.max_elements[1])*(element_height+spacing[1])-cursor_offset[1];
		cursor_posi[i] = [ex, ey, z+2];
		cursor_sizes[i] = [element_width+cursor_offset[0]*2, element_height+cursor_offset[1]*2];
	}
	CGE_Window_Select.call(this, id, sprites_data, width, height, x, y, z, windowskin, width_image, height_image, cursor_image_source, cursor_width, cursor_height, cursor_posi, cursor_sizes);
	this.type = "CGE_Window_List";
	this.scroll_x = 0;
	this.scroll_y = 0;
	this.element_image_ids = [];
	this.i_source = i_source;
	this.i_cols = i_cols;
	this.i_rows = i_rows;
	this.i_width = i_width;
	this.i_height = i_height;
	this.f_source = f_source;
	this.f_cols = f_cols;
	this.f_rows = f_rows;
	this.f_width = f_width;
	this.f_height = f_height;
	this.select_index = 1;
	this.scroll_button_ids = [];
	this.scroll_button_source = scroll_button_source;
	this.scroll_image_width = scroll_image_width;
	this.scroll_image_height = scroll_image_height;
	if(id != null){
		this.refresh_elements();
	}
}

CGE_Window_List.prototype.remove_element_images = function(){
	for(var i=0; i < this.element_image_ids.length; i++){
		var img = this.sprites_data.get_image_by_id(this.element_image_ids[i]);
		if(img != null){
			img.remove();
		}
	}
	for(var i=0; i < this.scroll_button_ids.length; i++){
		var img = this.sprites_data.get_image_by_id(this.scroll_button_ids[i]);
		if(img != null){
			img.remove();
		}
	}
	this.element_image_ids = [];
	this.scroll_button_ids = [];
}

CGE_Window_List.prototype.remove = function(){
	CGE_Window_Select.prototype.remove.call(this);
	this.remove_element_images();
}

CGE_Window_List.prototype.refresh_elements = function(){
	this.remove_element_images();
	for(var i=0; i < (this.max_elements[0]*this.max_elements[1]); i++){
		var x_index = parseInt(i/this.max_elements[1])+this.scroll_x;
		var y_index = (i%this.max_elements[1])+this.scroll_y;
		if(this.list[x_index] != null && this.list[x_index][ y_index] != null){
			var x = this.x+this.cursor_positions[i][0];
			var y = this.y+this.cursor_positions[i][1];
			var z = this.z+this.cursor_positions[i][2]-1;
			var w =  null;
			var h =  null;
			var id = this.id+"_element_"+i;
			this.element_image_ids.push(id);
			var img = new CGE_Text(id, this.list[x_index][ y_index], this.sprites_data, w, h, x, y, z,this.i_source, this.i_cols, this.i_rows, this.i_width, this.i_height,this.f_source, this.f_cols, this.f_rows, this.f_width, this.f_height);
			img.autobreak = false;
			this.sprites_data.add_image(img);
		}
	}
	if(this.scroll_x > 0){
		var x = this.x;
		var y = this.y+this.height/2-this.scroll_image_height/4;
		var z = this.z+1;
		var img = new CGE_Sprite(this.id+"_scroll_left", this.sprites_data, this.scroll_button_source, this.scroll_image_width, this.scroll_image_height , 2, 2, x, y, z);
		img.row_index = 1;
		img.col_index = 1;
		this.sprites_data.add_image(img);
		this.scroll_button_ids.push(img.id);
	}
	if(this.scroll_y > 0){
		var x = this.x+this.width/2-this.scroll_image_width/4;
		var y = this.y;
		var z = this.z+1;
		var img = new CGE_Sprite(this.id+"_scroll_top", this.sprites_data, this.scroll_button_source, this.scroll_image_width, this.scroll_image_height , 2, 2, x, y, z);
		img.row_index = 0;
		img.col_index = 0;
		this.sprites_data.add_image(img);
		this.scroll_button_ids.push(img.id);
	}
	if(this.scroll_x < this.list.length-this.max_elements[0]){
		var x = this.x+this.width-this.scroll_image_width/2;
		var y = this.y+this.height/2-this.scroll_image_height/4;
		var z = this.z+1;
		var img = new CGE_Sprite(this.id+"_scroll_right", this.sprites_data, this.scroll_button_source, this.scroll_image_width, this.scroll_image_height , 2, 2, x, y, z);
		img.row_index = 0;
		img.col_index = 1;
		this.sprites_data.add_image(img);
		this.scroll_button_ids.push(img.id);
	}
	if(this.scroll_y < this.list[0].length-this.max_elements[1]){
		var x = this.x+this.width/2-this.scroll_image_width/4;
		var y = this.y+this.height-this.scroll_image_height/2;
		var z = this.z+1;
		var img = new CGE_Sprite(this.id+"_scroll_bottom", this.sprites_data, this.scroll_button_source, this.scroll_image_width, this.scroll_image_height , 2, 2, x, y, z);
		img.row_index = 1;
		img.col_index = 0;
		this.sprites_data.add_image(img);
		this.scroll_button_ids.push(img.id);
	}
}

CGE_Window_List.prototype.update = function(){
	CGE_Window_Select.prototype.update.call(this);
	for(var i=0; i < this.element_image_ids.length; i++){
		var img = this.sprites_data.get_image_by_id(this.element_image_ids[i]);
		if(img != null){
			img.visible = this.visible;
			var x = this.x+this.cursor_positions[i][0]+this.cursor_offset[0];
			var y = this.y+this.cursor_positions[i][1]+this.cursor_offset[1];
			var z = this.z+this.cursor_positions[i][2]-1;
			img.x = x;
			img.y = y;
			img.z = z;
		}
	}
}