/* ======================================
			CGE INPUT CONTROLLER
			----------------------------------------------------------
			Object manageing synchronous keyboard input
====================================== */ 
function cge_create_input_controller(main_object){
	o = new Object;
	o.main = main_object;
	o.trigger_data = o.main.trigger_data;
	
	o.old_keys = [];				// keys pressed last frame
	o.pressed_keys = [];		// keys pressed this frame
	o.gathered_keys = [];		// keys pressed (assynchronous)
	
	o.trigger_keys = [];			// keys checked for event triggering
	
	
	// -----------------------------------------------------------------------------------
	// add / removes keys for triggering
	// -----------------------------------------------------------------------------------
	o.add_trigger_key = function(key){
		this.trigger_keys.push(key);
	};
	o.remove_trigger_key = function(key){
		var index = this.trigger_keys.indexOf(key);
		this.trigger_keys.splice(index, 1);
	};
	
	// -----------------------------------------------------------------------------------
	// frame update
	// (also triggers events)
	// -----------------------------------------------------------------------------------
	o.update = function(){
		this.old_keys = this.pressed_keys.slice(0);
		this.pressed_keys = this.gathered_keys.slice(0);
		for(var i=0; i < this.trigger_keys.length; i++){
			if(this.press(this.trigger_keys[i])){
				this.trigger_data.update("keypress_"+this.trigger_keys[i]);
				if(this.newpress(this.trigger_keys[i])){
					this.trigger_data.update("keynewpress_"+this.trigger_keys[i]);
				}
			}else if(this.release(this.trigger_keys[i])){
				this.trigger_data.update("keyrelease_"+this.trigger_keys[i]);
			}
		}
	};
	
	// -----------------------------------------------------------------------------------
	// returns if key is down this frame
	// -----------------------------------------------------------------------------------
	o.press= function(key){
		return (this.pressed_keys[key] == true);
	};
	
	// -----------------------------------------------------------------------------------
	// returns if key is pressed for the first time
	// -----------------------------------------------------------------------------------
	o.newpress = function(key){
		return (this.pressed_keys[key] == true && this.old_keys[key] != true); 
	};
	
	// -----------------------------------------------------------------------------------
	// returns if key was released this frame
	// -----------------------------------------------------------------------------------
	o.release = function(key){
		return (this.pressed_keys[key] != true && this.old_keys[key] == true); 
	};
	
	// -----------------------------------------------------------------------------------
	// adding action listeners
	// -----------------------------------------------------------------------------------
	$(document).keydown( function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		o.gathered_keys[key] = true;
	});
	$(document).keyup( function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		o.gathered_keys[key] = false;
	});
	
	return o;
}