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
	this.scene_id;													// id of current scene
	this.images = [];												// list of image ids
	
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
	this.main.input_controller.refresh();
	this.main.trigger_data.remove_all_scene_events(); // remove all events related to curent scene
	this.delete_all_images();
	this.scene_id = this.new_scene_id;
	this.start = function(){ };						// template start-function
	this.update = function(){ };					// template start-function
	this.end = function(){ };							// template start-function
	this.images = [];
	var canv = $('#'+this.main.html_id+'_canvas');
	this.ctx = canv[0].getContext('2d');
	this.scene_variables = {};
	
	// load scene via AJAX from server
	var scene_id = this.new_scene_id;
	var scene = this;
	this.started = false;
	$.post("src/LoadScene.php", { sceneID : scene_id } ,
		function(data){
			//scene.main.debug_m(data);
			if(!scene.alive){
				eval(data);
				scene.start();					// starts itself
				scene.alive = true; 			// set alive
			}
		}, "text"
	);
	
}

// -----------------------------------------------------------------------------------
// deletes all scene images
// -----------------------------------------------------------------------------------
CGE_Scene_Data.prototype.delete_all_images = function(){
	for(var i in this.images){
		this.main.sprites_data.remove_image_id(this.images[i]);
	}
}

// -----------------------------------------------------------------------------------
// creating and adding scene image
// -----------------------------------------------------------------------------------
CGE_Scene_Data.prototype.add_image = function(image_data){
	var img = new CGE_Image(image_data["id"], this.main.sprites_data, image_data["source"], image_data["width"], image_data["height"], image_data["x"], image_data["y"], image_data["z"]);
	this.main.sprites_data.add_image(img);
	this.images.push(img.id);
}

// -----------------------------------------------------------------------------------
// creating and adding scene  event
// -----------------------------------------------------------------------------------
CGE_Scene_Data.prototype.add_event = function(event_data){
	var event = new CGE_Event(event_data["id"], this.main.event_interpreter, event_data["effects"], event_data["conditions"], event_data["parallel"], event_data["chara"]);
	this.main.trigger_data.add_scene_event(event_data["trigger"], event);
}