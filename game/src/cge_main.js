/* ======================================
			CGE Main JS File
			----------------------------------------------------------
			manages and creates all data-Objects
			manages the MAIN LOOP
====================================== */ 

// -----------------------------------------------------------------------------------
// Initialises the cge_game engine
// -----------------------------------------------------------------------------------
var game;

function cge_start_game(system_info){
	var game = new CGE_Game("game_div", system_info);
	game.load_counter = 0;
	
	// create the canvas element
	game.create_canvas_element();
	
	// cross browser anim-Frame function
	var animFrame = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		null ;

	var recursive_update = function() {
		game.update();
		if(game.alive)
			animFrame( recursive_update );
		else
			game.ctx.clearRect ( 0 , 0 , game.resolution[0] , game.resolution[1] );
	};

	// start the mainloop
	animFrame( recursive_update);
}

function cge_load_game(str){
	var save_data = eval(str);
	
	var system_info = [];
	system_info["resolution"] = [640, 480];
	system_info["start_scene"] = "map";
	system_info["start_map"] = 0;
	var game = new CGE_Game("game_div", system_info);
	// create the canvas element
	game.create_canvas_element();
	if(save_data != null){
		game.load_counter = save_data.load_counter+1;
	
		game.scroll_x = save_data.scroll_x;
		game.scroll_y = save_data.scroll_y;
		game.scene_data.new_scene_id = save_data.scene_data.new_scene_id;
		//game.scene_data.order_new_scene_data(save_data.scene_data.scene_id);
		game.map_data.loaded = save_data.map_data.loaded;
		
		//if(game.map_data.loaded)
		//	game.map_data.load_new_map(save_data.map_data.map_id);
		game.map_data.map_id = save_data.map_data.map_id;
		game.scene_data.alive = save_data.scene_data.alive;
		game.scene_data.start = save_data.scene_data.start;
		game.scene_data.update = save_data.scene_data.update;
		game.scene_data.end = save_data.scene_data.end;
		
		game.map_data.images = [];
		game.map_data.events = {};
		game.sprites_data.images = [];
		game.sprites_data.id_images = {};
		game.sprites_data.spritesets = [];
		game.trigger_data.global_events = {};
		game.trigger_data.scene_events = {};
		game.trigger_data.map_events = {};
		game.trigger_data.id_events = {};
		game.event_interpreter.active_event = null;
		game.event_interpreter.parallel_events = [];
		
		game.scene_data.ctx = game.ctx_buffer;
		game.map_data.initialised = save_data.map_data.initialised;
		game.map_data.active = save_data.map_data.active;
	
		for(var i=0; i < save_data.map_data.images.length; i++){
			var save_chara = save_data.map_data.images[i];
			var chara = eval("new "+save_chara.type+"()");
			for(var c in save_chara){
				chara[c] = save_chara[c];
			}
			if(chara.type == "CGE_Character"){
				chara.moves = [];
				for(var m in save_chara.moves){
					chara.moves[m] = new CGE_Move();
					var move = save_chara.moves[m];
					for(var c in move){
						chara.moves[m][c] = move[c];
					}
				}
			}
			game.map_data.images.push(chara);
		}
		for(var i=0; i < save_data.sprites_data.images.length; i++){
			var save_image = save_data.sprites_data.images[i];
			var img = eval("new "+save_image.type+"()");
			for(var c in save_image){
				img[c] = save_image[c];
			}
			game.sprites_data.add_image(img);
		}
		for(var i in save_data.sprites_data.spritesets){
			game.sprites_data.spritesets[i] = new CGE_Spriteset();
			var spriteset = save_data.sprites_data.spritesets[i];
			for(var c in spriteset){
				game.sprites_data.spritesets[i][c] = spriteset[c];
			}
		}
		for(var i in save_data.trigger_data.scene_events){
			for(var j=0; j < save_data.trigger_data.scene_events[i].length; j++){
				var event = new CGE_Event();
				for(var c in save_data.trigger_data.scene_events[i][j]){
					event[c] = save_data.trigger_data.scene_events[i][j][c];
				}
				game.trigger_data.add_scene_event(i, event);
			}
		}
		for(var i in save_data.trigger_data.global_events){
			for(var j=0; j < save_data.trigger_data.global_events[i].length; j++){
				var event = new CGE_Event();
				for(var c in save_data.trigger_data.global_events[i][j]){
					event[c] = save_data.trigger_data.global_events[i][j][c];
				}
				game.trigger_data.add_global_event(i, event);
			}
		}
		for(var i in save_data.map_data.events){
			if(game.map_data.events[i] == null)
					game.map_data.events[i] = [];
			for(var j=0; j < save_data.map_data.events[i].length; j++){
				var event = new CGE_Event();
				for(var c in save_data.map_data.events[i][j]){
					event[c] = save_data.map_data.events[i][j][c];
				}
				game.map_data.events[i].push(event);
			}
		}
		for(var c in save_data.input_controller){
			game.input_controller[c] = save_data.input_controller[c];
		}
		game.global_variables = save_data.global_variables;
		game.data_objects = save_data.data_objects;
		game.input_controller.gathered_keys = [];
		game.input_controller.trigger_keys = save_data.input_controller.trigger_keys; 
		game.map_data.layers = save_data.map_data.layers;
		game.map_data.tileset_name = save_data.map_data.tileset_name
		game.map_data.tileset_grid_size = save_data.map_data.tileset_grid_size
		game.map_data.tileset_zoom_factor = save_data.map_data.tileset_zoom_factor;
		game.map_data.tileset_row_width = save_data.map_data.tileset_row_width;
		game.map_data.tileset_passable = save_data.map_data.tileset_passable;
		game.map_data.map_width = save_data.map_data.map_width;
		game.map_data.map_height = save_data.map_data.map_height;
		game.scene_data.images = save_data.scene_data.images;
		game.set_buffer_size(game.map_data.map_width, game.map_data.map_height);
		
		game.reload_save();
		delete save_data;
		
	}else{
		alert("Error: Save-Data invalid. Game was reseted.");
	}
	
	// cross browser anim-Frame function
	var animFrame = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		null ;
	
	game.r = Math.random();
	
	var recursive_update = function() {
		game.update();
		if(game.alive)
			animFrame( recursive_update );
		else
			game.ctx.clearRect ( 0 , 0 , game.resolution[0] , game.resolution[1] );
	};

	// start the mainloop
	animFrame( recursive_update);
}

// -----------------------------------------------------------------------------------
// creates and returns the game object itself
// this function is called to initialise the game engine
// -----------------------------------------------------------------------------------
function CGE_Game(html_id, system_info){
	// default values
	if(html_id == null)
		html_id = "game";
	if(system_info == null)
		system_info = [];
	if(system_info["resolution"] == null)
		system_info["resolution"] = [640, 480];
	if(system_info["fps"] == null)
		system_info["fps"] = 30;
	if(system_info["start_map"] == null)
		system_info["start_map"] = 0;
	if(system_info["start_scene"] == null)
		system_info["start_scene"] = "test";
	
	this.html_id = html_id; 													// id of the html-div-element (sub elements like canvas are created inside of this)
	this.resolution = system_info["resolution"]; 				// array defining the resolution (e.g. [640, 480])
	this.start_map_id = system_info["start_map"];		// start map id
	this.alive = true;																// defines if game is running (if set to false the game is terminated at the end of the frame)
	this.data_objects = {};
	this.global_variables = {};
	
	this.scroll_x = 0;
	this.scroll_y = 0;
	
	// Creating data Objects and Interpreter
	// (order is important!)
	this.sprites_data = new CGE_Sprites_Data(this);
	this.map_data = new CGE_Map_Data(this);
	this.scene_data = new CGE_Scene_Data(this);
	this.event_interpreter = new CGE_Event_Interpreter(this);
	this.trigger_data = new CGE_Trigger_Data(this);
	this.input_controller = new CGE_Input_Controller(this);
	this.move_interpreter = new CGE_Move_Interpreter(this);
	
	this.scene_data.new_scene_id = system_info["start_scene"];
	
	// Canvas-Context-Objects
	this.ctx;
	this.ctx_buffer;
	this.canv;
	this.canv_buffer;
	
	// Initilaising frame counter (for fps-display)
	this.frame_counter = 0;
	this.frame_counter_date = new Date();
	this.min_fps = null;
}

// -----------------------------------------------------------------------------------
// creates the canvas elements
// (everything is drawn to the invisible buffer-element and afterwards copied to the visible canvas element)
// -----------------------------------------------------------------------------------
CGE_Game.prototype.create_canvas_element = function(){
	var div = $('#'+this.html_id);
	var canvas_width = this.resolution[0];
	var canvas_height = this.resolution[1];
	div.html("");
	// creating canvas elements (define style of canvas)
	div.append('<canvas id="'+this.html_id+'_canvas_visible" class="game_canvas" style="border-style:solid;border-width:1px;width:100%;height:100%;">SORRY, your Browser doesn\'t supports canvas...</canvas>');
	div.append('<canvas id="'+this.html_id+'_canvas" class="game_canvas" style="visibility:hidden;width:0px;height:0px;"></canvas>');
	div.append('<br /><div id="'+this.html_id+'_fps">fps: </div>');
	div.append('<br /><div id="'+this.html_id+'_debug" style="color:red;overflow:scroll;width:800px;height:100px;"></div>');
	// set buffer parameters
	var canv = $('#'+this.html_id+'_canvas');
	canv.attr("width",canvas_width+"px");
	canv.attr("height",canvas_height+"px");
	this.canv_buffer = canv[0];
	this.ctx_buffer = canv[0].getContext('2d');
	// set visible canvas parameters
	canv = $('#'+this.html_id+'_canvas_visible');
	canv.attr("width",canvas_width+"px");
	canv.attr("height",canvas_height+"px");
	this.canv = canv[0];
	this.ctx = canv[0].getContext('2d');
}

CGE_Game.prototype.debug_m = function(msg){
	var div = $('#'+this.html_id+"_debug");
	div.prepend(msg+"<br />");
}

CGE_Game.prototype.set_buffer_size = function(w, h){
	this.canv_buffer.width = w;
	this.canv_buffer.height = h;
}

// -----------------------------------------------------------------------------------
// main loop
// 		every loop is one frame
// -----------------------------------------------------------------------------------
CGE_Game.prototype.update = function(){
	// clear canvas elements
	this.ctx_buffer.clearRect ( 0 , 0 , this.canv_buffer.width , this.canv_buffer.height );
	this.ctx.clearRect ( 0 , 0 , this.resolution[0] , this.resolution[1] );
	this.ctx_buffer.globalAlpha = 1.0;
	
	// calculating and displaying fps
	var new_date = new Date();
	if((new_date.getTime() - this.frame_counter_date) >= 1000){
		if(this.frame_counter < this.min_fps || this.min_fps == null)
			this.min_fps = this.frame_counter;
		$("#"+this.html_id+"_fps").html('fps: '+(this.frame_counter)+" / min: "+this.min_fps);
		this.frame_counter = 0;
		this.frame_counter_date = new_date;
	}
	this.frame_counter ++;
	
	// checking if scene is alive
	if(this.scene_data.alive){
		// frame update of auto-event-trigger
		this.trigger_data.update("auto");
		this.scene_data.update(); // frame update for scene
	}else{
		if(this.scene_data.new_scene_id != 0){
			this.scene_data.end(); // end scene
		}else{	
			this.alive = false;
		}
		// get new scene data from the server	
		this.scene_data.order_new_scene_data(this.new_scene_id);
	}
	
	// copy content from buffer canvas to visible canvas
	this.ctx.drawImage(this.canv_buffer, this.scroll_x, this.scroll_y);
	
	this.input_controller.update();
	this.event_interpreter.update();

}

CGE_Game.prototype.save_to_string = function(){
	var r = "";
	
	this.map_data.prepare_save();
	this.sprites_data.prepare_save();
	this.scene_data.main = null;
	this.event_interpreter.main = null;
	this.trigger_data.prepare_save();
	this.input_controller.main = null;
	this.move_interpreter.main = null;
	
	r = this.toSource();
	
	this.reload_save();
	
	this.debug_m(r);
	return r;
}

CGE_Game.prototype.reload_save = function(){
	this.sprites_data.reload_save(this);
	this.map_data.reload_save(this);
	this.scene_data.main = this;
	this.event_interpreter.main = this;
	this.trigger_data.reload_save(this);
	this.input_controller.main = this;
	this.move_interpreter.main = this;
}





