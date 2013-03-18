/* ======================================
			CGE SCENE DATA
			----------------------------------------------------------
			manages all scenes
			a change to another scene means changeing the content of this object
====================================== */ 

// -----------------------------------------------------------------------------------
// creates and returns scene_data object
// -----------------------------------------------------------------------------------
function cge_create_scene_data(main_object){
	var o = new Object;
	o.alive = false;												// if set false the end() function will be automatically called an a new scene will be loaded (initilally false to get first scene from server)		
	o.new_scene_id = 1;									// identifier of the new scene (is sent to the server to get scene data)
	o.main = main_object;								// assiciation to the main object 
	o.map_data = o.main.map_data 			// assiciation to the map data object
	o.sprites_data = o.main.sprites_data	// assiciation to the sprites data object
	
	// template functions
	// (set from the server if new scene is loaded)
	o.start = function(){ };						// template start-function
	o.update = function(){ };				// template start-function
	o.end = function(){ };						// template start-function

	// -----------------------------------------------------------------------------------
	// called to get new scene_data from the server
	// -----------------------------------------------------------------------------------
	o.order_new_scene_data = function(){
		o.main.trigger_data.remove_all_scene_events(); // remove all events related to curent scene
		
		// AJAX holt sich neue scene_start, scene_update und scene_end function (und gegebenenfalls verwendete Funktionen) und scene_data
		if(this.new_scene_id == "map"){
			if(this.map_data.initialised){
				this.map_data.reload();
			}else{
				this.map_data.load_new_map(this.main.start_map_id);
			}
			
			this.start = function(){
				this.main.trigger_data.update("start_scene");
				var canv = $('#'+this.main.html_id+'_canvas');
				this.ctx = canv[0].getContext('2d');
			};
		
			this.update = function(){
				this.sprites_data.update();
				this.sprites_data.draw_images(this.ctx, null, -1);
				this.map_data.draw_tiled_map(this.ctx);
				this.sprites_data.draw_images(this.ctx, this.map_data.layers.length);
			};
		
			this.end = function(){
				this.main_object.trigger_data.update("end_scene");
				this.map_data.unload();
			};
			
		}
		// ...................
		/*var scene_data = [];
		scene_data["layers"] = [];
		scene_data["layers"][0] = [[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]];
		scene_data["layers"][1] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,7,0,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		scene_data["layers"][2] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,7,7,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0]];
		scene_data["tileset_name"] = "Testset.png";
		scene_data["tileset_grid_size"] = 32;
		scene_data["tileset_zoom_factor"] = 1.0;
		scene_data["tileset_row_width"] = 8;
		scene_data["tileset_passable"] = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1],[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
		scene_data["chara"] = [];
		
		for(var i=0; i<60; i++){
			//scene_data["chara"][i] = {"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : i*10, "y" : i*10, "z" : 1, "face" : 0};
			//scene_data["chara"][i] = {"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : Math.random()*640, "y" : Math.random()*480, "z" : 1, "face" : 0};
			//scene_data["chara"][i]["moves"] = [["walk",[parseInt(Math.random()*200),"random","frames"],0]];
			//scene_data["chara"][i]["moves"] = [ ["walk",[100,"towards_chara","dist",0],0]];
			
			//scene_data["chara"][i]["blocking_classes"] = ["std"];
		}
		
		scene_data["chara"][0] = {"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : 234, "y" : 172, "z" : 1, "face" : 2};
		scene_data["chara"][0]["moves"] = [["wait",[30]],["jump",[100, 100, 1]],["stand"],["wait",[100]],["walk",[100,1,"frames"]],["stand"]];
		scene_data["chara"][0]["blocking_classes"] = ["std"];
		/*scene_data["chara"][1] = {"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : 334, "y" : 172, "z" : 1, "face" : 2};
		scene_data["chara"][1]["moves"] = [["walk",[32,"towards_point","dist",[320,240]]],["stand"],["wait",[100]],["walk",[100,3,"frames"]],["stand"]];
		scene_data["chara"][1]["blocking_classes"] = ["std"];
		/*scene_data["chara"][2] = {"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : 224, "y" : 100, "z" : 1, "face" : 2};
		scene_data["chara"][2]["moves"] = [["walk",[100,2]],["stand"],["wait",[100]],["walk",[100,3]],["stand"]];
		scene_data["chara"][2]["blocking_classes"] = ["std"];
		
		this.sprites_data = cge_create_sprites_data(this.main_object);
		this.main_object.trigger_data.remove_all_map_events();
		this.map_data = cge_create_map_data_object(scene_data, this.sprites_data);
		
		this.ta = [];

		this.new_image = function(image_source, width, height, x, y, z){
			return cge_create_image(this.sprites_data, image_source, width, height,x,y,z);
		};
		this.new_sprite = function(image_source, width, height, rows, cols, x, y, z){
			return cge_create_sprite(this.sprites_data, image_source, width, height, rows, cols, x, y, z);
		};
		this.new_anim_sprite = function(image_source, width, height, rows, cols, x, y, z, frame_sequence){
			return cge_create_anim_sprite(this.sprites_data, image_source, width, height, rows, cols, x, y, z,frame_sequence);
		};*/
		// ...................		
		
		this.alive = true; 			// set alive
		this.start();					// starts itself
	};
	
	return o;
}