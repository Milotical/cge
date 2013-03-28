/* ======================================
			CGE INPUT CONTROLLER
			----------------------------------------------------------
			Object manageing synchronous keyboard input
====================================== */ 
function CGE_Input_Controller(main_object){
	this.main = main_object;
	
	this.old_keys = [];				// keys pressed last frame
	this.pressed_keys = [];		// keys pressed this frame
	this.gathered_keys = [];		// keys pressed (assynchronous)
	
	this.trigger_keys = [];			// keys checked for event triggering
	this.mouse_x = 0;
	this.mouse_y = 0;
	
	var o = this;
	// -----------------------------------------------------------------------------------
	// adding action listeners
	// -----------------------------------------------------------------------------------
	$(document).unbind("keydown");
	$(document).unbind("keyup");
	
	$(document).keydown( function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		o.gathered_keys[key] = true;
		if(key == 122){
			if($("#"+o.main.html_id)[0].requestFullScreen != null)
				$("#"+o.main.html_id)[0].requestFullScreen();
			else if($("#"+o.main.html_id)[0].mozRequestFullScreen != null)
				$("#"+o.main.html_id)[0].mozRequestFullScreen();
			else if($("#"+o.main.html_id)[0].webkitRequestFullScreen != null)
				$("#"+o.main.html_id)[0].webkitRequestFullScreen();
		}
	});
	$(document).mousedown( function() {
		o.gathered_keys["click"] = true;
	});
	$(document).keyup( function(e) {
		var key = e.keyCode ? e.keyCode : e.which;
		o.gathered_keys[key] = false;
	});
	$(document).mouseup( function() {
		o.gathered_keys["click"] = false;
	});
	$(document).mousemove( function(e){
		var canv = $("#"+o.main.html_id+"_canvas_visible");
		var offset = $("#"+o.main.html_id+"_canvas_visible").offset();
		o.mouse_x = (e.pageX-offset.left)/canv.width()*o.main.resolution[0];
		o.mouse_y = (e.pageY-offset.top)/canv.height()*o.main.resolution[1];
	});
	
}

CGE_Input_Controller.prototype.refresh = function(){
	this.old_keys = [];				
	this.pressed_keys = [];		
	this.gathered_keys = [];	
}

// -----------------------------------------------------------------------------------
// add / removes keys for triggering
// -----------------------------------------------------------------------------------
CGE_Input_Controller.prototype.add_trigger_key = function(key){
	this.trigger_keys.push(key);
};
CGE_Input_Controller.prototype.remove_trigger_key = function(key){
	var index = this.trigger_keys.indexOf(key);
	this.trigger_keys.splice(index, 1);
}

// -----------------------------------------------------------------------------------
// frame update
// (also triggers events)
// -----------------------------------------------------------------------------------
CGE_Input_Controller.prototype.update = function(){
	this.old_keys = this.pressed_keys.slice(0);
	this.pressed_keys = this.gathered_keys.slice(0);
	for(var i=0; i < this.trigger_keys.length; i++){
		if(this.press(this.trigger_keys[i])){
			this.main.trigger_data.update("keypress_"+this.trigger_keys[i]);
			if(this.newpress(this.trigger_keys[i])){
				this.main.trigger_data.update("keynewpress_"+this.trigger_keys[i]);
			}
		}else if(this.release(this.trigger_keys[i])){
			this.main.trigger_data.update("keyrelease_"+this.trigger_keys[i]);
		}
	}
}

// -----------------------------------------------------------------------------------
// returns if key is down this frame
// -----------------------------------------------------------------------------------
CGE_Input_Controller.prototype.press= function(key){
	return (this.pressed_keys[key] == true);
}

// -----------------------------------------------------------------------------------
// returns if key is pressed for the first time
// -----------------------------------------------------------------------------------
CGE_Input_Controller.prototype.newpress = function(key){
	return (this.pressed_keys[key] == true && this.old_keys[key] != true); 
}

// -----------------------------------------------------------------------------------
// returns if key was released this frame
// -----------------------------------------------------------------------------------
CGE_Input_Controller.prototype.release = function(key){
	return (this.pressed_keys[key] != true && this.old_keys[key] == true); 
}