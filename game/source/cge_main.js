/* ======================================
			CGE Main JS File
====================================== */ 

// creates the game object
function create_game_object(html_id, system_infos){
	o = new Object;
	o.html_id = html_id; 												// id of the html-div-element
	o.resolution = system_info["resolution"]; 			// array defining the resolution
	o.alive = true;															// defines if game is running
	o.frame_duration = 1.0/system_info["fps"];		// defines the waiting time between 2 frames
	o.scene_alive = false;											// defines if the scene is up to date
	o.new_scene_id = 0;												// id of the new scene
	
	// called ar the beginning of a scene
	o.scene_start = function(){
		alert("Warning: 'scene_start()' was not defined.");
	};
	// called each frame
	o.scene_update = function(){
		alert("Warning: 'scene_update()' was not defined.");
	};
	// called after a scene
	o.scene_end = function(){
		alert("Warning: 'scene_end()' was not defined.");
	};
	
	// creates the canvas element
	o.create_canvas_element = function(){
		var div = $('#'+this.html_id);
		var canvas_width = this.resolution[0];
		var canvas_height = this.resolution[1];
		div.append('<canvas id="'+html_id+'_canvas" class="game_canvas" style="border-style:solid;border-width:10px;"></canvas>');
		canv = $('#'+this.html_id+'_canvas');
		canv.attr("width",canvas_width+"px");
		canv.attr("height",canvas_height+"px");
	};
	
	// order new scene from the server
	o.order_new_scene_data = function(new_scene_id){
		// AJAX holt sich neue scene_start, scene_update und scene_end function (und gegebenenfalls verwendete Funktionen) und scene_data
		var scene_data = [];
		scene_data["layers"] = [];
		scene_data["layers"][0] = [[9,9,9,9,9,9],[9,9,9,9,9,9],[9,9,9,9,9,9]];
		scene_data["layers"][1] = [[0,0,6,6,0,0],[0,0,7,0,0,7],[0,0,0,0,0,0]];
		scene_data["tileset_name"] = "Testset.png";
		scene_data["tileset_grid_size"] = 32;
		scene_data["tileset_zoom_factor"] = 1.0;
		scene_data["tileset_row_width"] = 8;
		scene_data["sprites"] = [];
		scene_data["sprites"][1] = [];
		this.map_data = cge_create_map_data_object(scene_data, this.html_id);
		
		this.scene_start = function(){
			this.map_data.draw_tiled_map(0,0);
		};
		this.scene_update = function(){
			this.map_data.draw_tiled_map(0,0);
		};
		this.scene_end = function(){
			
		};
		// --------------
		
		this.scene_alive = true;
		this.scene_start();
	};
		
	// main loop
	o.update = function(){
		if(this.scene_alive){
			this.scene_update();
		}else{
			if(this.new_scene_id != 0)
				this.scene_end();
			this.order_new_scene_data(this.new_scene_id);
		}
		if(!this.alive)
			clearInterval(this.interval_id);
	};
	
	o.create_canvas_element();
	o.interval_id = setInterval(function(){o.update()}, o.frame_duration);
	return o;
}