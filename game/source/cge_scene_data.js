/* ======================================
			CGE SCENE DATA
			----------------------------------------------------------
			manages all scenes
			a change to another scene means changeing the content of this object
====================================== */ 

// -----------------------------------------------------------------------------------
// creates and returns scene_data object
// -----------------------------------------------------------------------------------
function CGE_Scene_Data(main_object){
	this.alive = false;												// if set false the end() function will be automatically called an a new scene will be loaded (initilally false to get first scene from server)		
	this.new_scene_id = 1;									// identifier of the new scene (is sent to the server to get scene data)
	this.main = main_object;								// assiciation to the main object
	this.scene_id;
	
	// template functions
	// (set from the server if new scene is loaded)
	this.start = function(){ };						// template start-function
	this.update = function(){ };				// template start-function
	this.end = function(){ };						// template start-function

}

// -----------------------------------------------------------------------------------
// called to get new scene_data from the server
// -----------------------------------------------------------------------------------
CGE_Scene_Data.prototype.order_new_scene_data = function(){
	this.main.trigger_data.remove_all_scene_events(); // remove all events related to curent scene
	this.scene_id = this.new_scene_id;
	
	// AJAX holt sich neue scene_start, scene_update und scene_end function (und gegebenenfalls verwendete Funktionen) und scene_data
	if(this.new_scene_id == "map"){
		if(this.main.map_data.initialised){
			this.main.map_data.reload();
		}else{
			this.main.map_data.load_new_map(this.main.start_map_id);
		}
		
		this.start = function(){
			this.main.trigger_data.update("start_scene");
			var canv = $('#'+this.main.html_id+'_canvas');
			this.ctx = canv[0].getContext('2d');
		};
	
		this.update = function(){
			this.main.sprites_data.update();
			this.main.sprites_data.draw_images(this.ctx, null, -1);
			this.main.map_data.draw_tiled_map(this.ctx);
			this.main.sprites_data.draw_images(this.ctx, this.main.map_data.layers.length);
		};
	
		this.end = function(){
			this.main_object.trigger_data.update("end_scene");
			this.main.map_data.unload();
		};
		
	}
	// ...................		
	
	this.alive = true; 			// set alive
	this.start();					// starts itself
}