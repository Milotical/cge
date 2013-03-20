/* ======================================
			CGE TRIGGER DATA
			----------------------------------------------------------
			manages (triggers) events
====================================== */ 
function cge_create_trigger_data(main_object){
	var o = new Object;
	o.global_events = {};
	o.map_events = {}
	o.scene_events = {}
	o.event_interpreter = main_object.event_interpreter;
	o.input_controller = main_object.input_controller;
	
	// -----------------------------------------------------------------------------------
	// Add event to a specific trigger
	// -----------------------------------------------------------------------------------
	o.add_global_event = function(id, event){
		if(this.global_events[id] == null)
			this.global_events[id] = [];
		this.global_events[id].push(event);
	};
	o.add_map_event = function(id, event){
		if(this.map_events[id] == null)
			this.map_events[id] = [];
		this.map_events[id].push(event);
	};
	o.add_scene_event = function(id, event){
		if(this.scene_events[id] == null)
			this.scene_events[id] = [];
		this.scene_events[id].push(event);
	};
	
	// -----------------------------------------------------------------------------------
	// Removes event from a trigger
	// -----------------------------------------------------------------------------------
	o.remove_global_event = function(id, event){
		var a = this.global_events[id];
		var index = a.indexOf(event);
		this.global_events[id].splice(index, 1);
	};
	o.remove_map_event = function(id, event){
		var a = this.map_events[id];
		var index = a.indexOf(event);
		this.map_events[id].splice(index, 1);
	};
	o.remove_scene_event = function(id, event){
		var a = this.scene_events[id];
		var index = a.indexOf(event);
		this.scene_events[id].splice(index, 1);
	};
	
	// -----------------------------------------------------------------------------------
	// removes all events from a trigger
	// -----------------------------------------------------------------------------------
	o.remove_all_global_events = function(id){
		if(id == null){
			this.global_events = [];
		}else{
			this.global_events[id] = [];
		}
	};
	o.remove_all_map_events = function(id){
		if(id == null){
			this.map_events = [];
		}else{
			this.map_events[id] = [];
		}
	};
	o.remove_all_scene_events = function(id){
		if(id == null){
			this.scene_events = [];
		}else{
			this.scene_events[id] = [];
		}
	};

	// -----------------------------------------------------------------------------------
	// trigger update (always called if trigger was called)
	// -----------------------------------------------------------------------------------
	o.update = function(id, para){
		var e;
		if(this.global_events[id] != null){
			for(var i=0; i < this.global_events[id].length; i++){
				e = this.global_events[id][i];
				if(!e.active && e.conditions_fullfilled()){
					if(e.parallel){
						e.frame_index = 0;
						e.effect_index = 0;
						e.active = true;
						this.event_interpreter.parallel_events.push(e);
					}else if(this.event_interpreter.active_event == null){
						e.frame_index = 0;
						e.effect_index = 0;
						e.active = true;
						this.event_interpreter.active_event = e;
					}
				}
			}
		}
		if(this.map_events[id] != null){
			for(var i=0; i < this.map_events[id].length; i++){
				e = this.map_events[id][i];
				if(!e.active && e.conditions_fullfilled()){
					if(e.parallel){
						e.frame_index = 0;
						e.effect_index = 0;
						e.active = true;
						this.event_interpreter.parallel_events.push(e);
					}else if(this.event_interpreter.active_event == null){
						e.frame_index = 0;
						e.effect_index = 0;
						e.active = true;
						this.event_interpreter.active_event = e;
					}
				}
			}
		}
		if(this.scene_events[id] != null){
			for(var i=0; i < this.scene_events[id].length; i++){
				e = this.scene_events[id][i];
				if(!e.active && e.conditions_fullfilled()){
					if(e.parallel){
						e.frame_index = 0;
						e.effect_index = 0;
						e.active = true;
						this.event_interpreter.add_prallel_event(e);
					}else if(this.event_interpreter.active_event == null){
						e.frame_index = 0;
						e.effect_index = 0;
						e.active = true;
						this.event_interpreter.active_event = e;
					}
				}
			}
		}
	};
	
	return o;
}

/* ======================================
			CGE EVENT
			----------------------------------------------------------
====================================== */ 
function cge_create_event(id, event_interpreter, effects, conditions, parallel, related_chara){
	var o = new Object;
	
	o.id = id;
	o.effects = effects;								// List of event-effects
	o.conditions = conditions;					// List of event conditions
	o.parallel = parallel;							// defines if event is parallel processed
	o.chara = related_chara;					// realted character or image
	
	o.effect_index = 0;								// current effect index of event
	o.interpreter = event_interpreter;		// event interpreter object
	o.finished = false;
	o.active = false;
	o.frame_index = 0;
	o.erased = false;
	
	o.conditions_fullfilled = function(){
		if(this.erased)
			return false;
		if(this.conditions.length == 0)
			return true;
		for(var j=0; j < this.conditions.length; j++){
			var r = true;
			for(var i=0; i < this.conditions[j].length; i++){
				if(!this.check_condition(this.conditions[j][i])){
					r = false;
					break;
				}
			}
			if(r == true){
				return true;
			}
			r = true;
		}
		return false;
	};
	
	o.check_condition = function(cond){
		return this.interpreter.check_condition(this, cond);
	};
	
	return o;
}