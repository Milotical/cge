/* ======================================
			CGE Main JS File
			----------------------------------------------------------
			manages and creates all data-Objects
			manages the MAIN LOOP
====================================== */ 

// -----------------------------------------------------------------------------------
// creates and returns the game object itself
// this function is called to initialise the game engine
// -----------------------------------------------------------------------------------
function create_game_object(html_id, system_infos){
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
	
	var o = new Object;
	o.html_id = html_id; 													// id of the html-div-element (sub elements like canvas are created inside of this)
	o.resolution = system_info["resolution"]; 				// array defining the resolution (e.g. [640, 480])
	o.frame_duration = 1000.0/system_info["fps"];	// defines the waiting time between 2 frames from the fps
	o.start_map_id = system_info["start_map"];		// start map id
	o.alive = true;																// defines if game is running (if set to false the game is terminated at the end of the frame)
	
	// Creating data Objects and Interpreter
	o.sprites_data = cge_create_sprites_data(o);
	o.map_data = cge_create_map_data(o);
	o.scene_data = cge_create_scene_data(o);
	o.event_interpreter = cge_create_event_interpreter(o);
	o.trigger_data = cge_create_trigger_data(o);
	o.move_interpreter = cge_create_move_interpreter(o);
	
	o.scene_data.new_scene_id = system_info["start_scene"];
	
	// Canvas-Context-Objects
	o.ctx;
	o.ctx_buffer;
	o.canv;
	o.canv_buffer;
	
	// Initilaising frame counter (for fps-display)
	o.frame_counter = 0;
	o.frame_counter_date = new Date();
	
	// -----------------------------------------------------------------------------------
	// creates the canvas elements
	// (everything is drawn to the invisible buffer-element and afterwards copied to the visible canvas element)
	// -----------------------------------------------------------------------------------
	o.create_canvas_element = function(){
		var div = $('#'+this.html_id);
		var canvas_width = this.resolution[0];
		var canvas_height = this.resolution[1];
		// creating canvas elements (define style of canvas)
		div.append('<canvas id="'+html_id+'_canvas_visible" class="game_canvas" style="border-style:solid;border-width:10px;"></canvas>');
		div.append('<canvas id="'+html_id+'_canvas" class="game_canvas" style="visibility:hidden;width:0px;height:0px;"></canvas>');	
		div.append('<br /><div id="'+o.html_id+'_fps">fps: </div>');
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
		this.ctx = canv[0].getContext('2d');
	};
	
	// -----------------------------------------------------------------------------------
	// main loop
	// 		every loop is one frame
	// -----------------------------------------------------------------------------------
	o.update = function(){
		// clear canvas elements
		this.ctx_buffer.clearRect ( 0 , 0 , this.resolution[0] , this.resolution[1] );
		this.ctx.clearRect ( 0 , 0 , this.resolution[0] , this.resolution[1] );
		this.ctx_buffer.globalAlpha = 1.0;
		
		// calculating and displaying fps
		var new_date = new Date();
		if((new_date.getTime() - this.frame_counter_date) >= 1000){
			$("#"+this.html_id+"_fps").html('fps: '+(this.frame_counter));
			this.frame_counter = 0;
			this.frame_counter_date = new_date;
		}
		this.frame_counter ++;
		
		// checking if scene is alive
		if(this.scene_data.alive){
			this.scene_data.update(); // frame update for scene
		}else{
			if(this.scene_data.new_scene_id != 0)
				this.scene_data.end(); // end scene
			else	
				this.alive = false;
			// get new scene data from the server	
			this.scene_data.order_new_scene_data(this.new_scene_id);
		}
		
		// copy content from buffer canvas to visible canvas
		this.ctx.drawImage(this.canv_buffer, 0,0);
		
		// frame update of auto-event-trigger
		this.trigger_data.update("auto");
		this.event_interpreter.update();
		
		// terminate engine if not alive
		if(!this.alive){
			clearInterval(this.interval_id);
			this.trigger_data.update("end_game");
		}	
	};

	// create the canvas element
	o.create_canvas_element();
	
	// create Keyboard-Trigger Event-Listener
	$(document).bind('keypress', function(e) {
		var code = e.keyCode ? e.keyCode : e.which;
		o.trigger_data.update("keypress_"+code);
	});
	$(document).bind('keyup', function(e) {
		var code = e.keyCode ? e.keyCode : e.which;
		o.trigger_data.update("keyup_"+code);
	});
	$(document).bind('keydown', function(e) {
		var code = e.keyCode ? e.keyCode : e.which;
		o.trigger_data.update("keydown_"+code);
	});
	
	o.trigger_data.update("start_game"); // call start-game-trigger
	
	// initialise main loop
	o.interval_id = setInterval(function(){o.update()}, o.frame_duration);
	
	return o;
}