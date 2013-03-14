/* ======================================
			CGE Main JS File
====================================== */ 

// creates the game object
function create_game_object(html_id, system_infos){
	var o = new Object;
	o.html_id = html_id; 												// id of the html-div-element
	o.resolution = system_info["resolution"]; 			// array defining the resolution
	o.alive = true;															// defines if game is running
	o.frame_duration = 1000.0/system_info["fps"];		// defines the waiting time between 2 frames
	o.trigger_data = cge_create_trigger_data();
	o.scene = cge_create_scene(o);
	o.death_timer_date = new Date();
	o.death_timer = system_info["death_timer"];
	
	// creates the canvas element
	o.create_canvas_element = function(){
		var div = $('#'+this.html_id);
		var canvas_width = this.resolution[0];
		var canvas_height = this.resolution[1];
		div.append('<canvas id="'+html_id+'_canvas" class="game_canvas" style="border-style:solid;border-width:10px;"></canvas>');
		this.frame_counter = 0;
		this.frame_counter_date = new Date();
		div.append('<br /><div id="'+o.html_id+'_fps">fps: </div>');
		canv = $('#'+this.html_id+'_canvas');
		canv.attr("width",canvas_width+"px");
		canv.attr("height",canvas_height+"px");
	};
		
	// main loop
	o.update = function(){
		var new_date = new Date();
		/*if((new_date.getTime() - this.death_timer_date.getTime()) > this.death_timer){
			alert("Error: Game Timeout ("+(new_date.getTime() - this.death_timer_date.getTime())/1000+" sec delay for main-loop). Game terminated!");
			this.alive = false;
		}*/
		if((new_date.getTime() - this.frame_counter_date) >= 1000){
			$("#"+this.html_id+"_fps").html('fps: '+(this.frame_counter));
			this.frame_counter = 0;
			this.frame_counter_date = new_date;
		}
		this.frame_counter ++;
		this.death_timer_date = new_date;
		if(this.scene.alive){
			this.scene.update();
		}else{
			if(this.scene.new_scene_id != 0)
				this.scene.end();
			this.scene.order_new_scene_data(this.new_scene_id);
		}
		this.trigger_data.update("auto");
		if(!this.alive){
			clearInterval(this.interval_id);
			this.trigger_data.update("end_game");
		}	
	};
	o.create_canvas_element();
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
	
	o.trigger_data.update("start_game");
	o.interval_id = setInterval(function(){o.update()}, o.frame_duration);
	
	return o;
}