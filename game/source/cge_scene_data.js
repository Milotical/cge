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
		
		this.alive = true; 			// set alive
		this.start();					// starts itself
	};
	
	return o;
}