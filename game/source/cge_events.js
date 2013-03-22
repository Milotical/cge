/* ======================================
			CGE TRIGGER DATA
			----------------------------------------------------------
			manages (triggers) events
====================================== */ 
function CGE_Trigger_Data(main_object){
	this.global_events = {};
	this.map_events = {};
	this.scene_events = {};
	this.id_events = {};
	this.main = main_object;
}
	
CGE_Trigger_Data.prototype.get_event_by_id = function(id){
	return this.id_events[id];
};

// -----------------------------------------------------------------------------------
// Add event to a specific trigger
// -----------------------------------------------------------------------------------
CGE_Trigger_Data.prototype.add_global_event = function(id, event){
	if(this.global_events[id] == null)
		this.global_events[id] = [];
	this.global_events[id].push(event);
	this.id_events[event.id] = event;
}
CGE_Trigger_Data.prototype.add_map_event = function(id, event){
	if(this.map_events[id] == null)
		this.map_events[id] = [];
	this.map_events[id].push(event);
	this.id_events[event.id] = event;
}
CGE_Trigger_Data.prototype.add_scene_event = function(id, event){
	if(this.scene_events[id] == null)
		this.scene_events[id] = [];
	this.scene_events[id].push(event);
	this.id_events[event.id] = event;
}

// -----------------------------------------------------------------------------------
// Removes event from a trigger
// -----------------------------------------------------------------------------------
CGE_Trigger_Data.prototype.remove_global_event = function(id, event){
	delete this.id_events[event.id];
	var a = this.global_events[id];
	var index = a.indexOf(event);
	this.global_events[id].splice(index, 1);
}
CGE_Trigger_Data.prototype.remove_map_event = function(id, event){
	delete this.id_events[event.id];
	var a = this.map_events[id];
	var index = a.indexOf(event);
	this.map_events[id].splice(index, 1);
}
CGE_Trigger_Data.prototype.remove_scene_event = function(id, event){
	delete this.id_events[event.id];
	var a = this.scene_events[id];
	var index = a.indexOf(event);
	this.scene_events[id].splice(index, 1);
}

// -----------------------------------------------------------------------------------
// removes all events from a trigger
// -----------------------------------------------------------------------------------
CGE_Trigger_Data.prototype.remove_all_global_events = function(id){
	if(id == null){
		for(var i in this.global_events){
			for(var j in this.global_events[i]){
				this.remove_global_event(i, this.global_events[i][j]);
			}
		}
	}else{
		for(var j in this.global_events[id]){
			this.remove_global_event(id, this.global_events[id][j]);
		}
	}
}
CGE_Trigger_Data.prototype.remove_all_map_events = function(id){
	if(id == null){
		for(var i in this.map_events){
			for(var j in this.map_events[i]){
				this.remove_map_event(i, this.map_events[i][j]);
			}
		}
	}else{
		for(var j in this.map_events[id]){
			this.remove_map_event(i, this.map_events[id][j]);
		}
	}
}
CGE_Trigger_Data.prototype.remove_all_scene_events = function(id){
	if(id == null){
		for(var i in this.scene_events){
			for(var j in this.scene_events[i]){
				this.remove_scene_event(i, this.scene_events[i][j]);
			}
		}
	}else{
		for(var j in this.scene_events[id]){
			this.remove_scene_event(id, this.scene_events[id][j]);
		}
	}
}

// -----------------------------------------------------------------------------------
// trigger update (always called if trigger was called)
// -----------------------------------------------------------------------------------
CGE_Trigger_Data.prototype.update = function(id, para){
	var e;
	if(this.global_events[id] != null){
		for(var i=0; i < this.global_events[id].length; i++){
			e = this.global_events[id][i];
			if(!e.active && e.conditions_fullfilled()){
				if(e.parallel){
					e.frame_index = 0;
					e.effect_index = 0;
					e.active = true;
					e.finished = false;
					this.main.event_interpreter.parallel_events.push(e.id);
				}else if(this.main.event_interpreter.active_event == null){
					e.frame_index = 0;
					e.effect_index = 0;
					e.active = true;
					e.finished = false;
					this.main.event_interpreter.active_event = e.id;
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
					e.finished = false;
					this.main.event_interpreter.parallel_events.push(e.id);
				}else if(this.main.event_interpreter.active_event == null){
					e.frame_index = 0;
					e.effect_index = 0;
					e.active = true;
					e.finished = false;
					this.main.event_interpreter.active_event = e.id;
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
					e.finished = false;
					this.main.event_interpreter.parallel_events.push(e.id);
				}else if(this.main.event_interpreter.active_event == null){
					e.frame_index = 0;
					e.effect_index = 0;
					e.active = true;
					e.finished = false;
					this.main.event_interpreter.active_event = e.id;
				}
			}
		}
	}
}


CGE_Trigger_Data.prototype.prepare_save = function(){
	for(var i in this.global_events){
		for(var j in this.global_events[i]){
			this.global_events[i][j].prepare_save();
		}
	}
	/*for(var i in this.map_events){
		for(var j in this.map_events[i]){
			this.map_events[i][j].prepare_save();
		}
	}*/
	for(var i in this.scene_events){
		for(var j in this.scene_events[i]){
			this.scene_events[i][j].prepare_save();
		}
	}
	this.id_events = {};
	this.main = null;
}

CGE_Trigger_Data.prototype.reload_save = function(main){
	for(var i in this.global_events){
		for(var j in this.global_events[i]){
			this.global_events[i][j].reload_save(main);
			this.id_events[this.global_events[i][j].id] = this.global_events[i][j];
		}
	}
	/*for(var i in this.map_events){
		for(var j in this.map_events[i]){
			this.map_events[i][j].reload_save(main);
			this.id_events[this.map_events[i][j].id] = this.map_events[i][j];
		}
	}*/
	for(var i in this.scene_events){
		for(var j in this.scene_events[i]){
			this.scene_events[i][j].reload_save(main);
			this.id_events[this.scene_events[i][j].id] = this.scene_events[i][j];
		}
	}
	this.main = main;
}

/* ======================================
			CGE EVENT
			----------------------------------------------------------
====================================== */ 
function CGE_Event(id, event_interpreter, effects, conditions, parallel, related_chara_id){
	this.id = id;
	this.effects = effects;								// List of event-effects
	this.conditions = conditions;					// List of event conditions
	this.parallel = parallel;							// defines if event is parallel processed
	this.chara = related_chara_id;					// realted character or image
	
	this.effect_index = 0;								// current effect index of event
	this.interpreter = event_interpreter;		// event interpreter object
	this.finished = false;								// defines if event-process is finished
	this.active = false;									//  defines if event is processing
	this.frame_index = 0;								// dummy vaiable for frame counting at event interpretation
	this.erased = false;								  	// defines if event is erased (erased events are literally dead)
}

CGE_Event.prototype.get_chara =function(){
	return this.interpreter.main.sprites_data.get_image_by_id(this.chara);
}

// -----------------------------------------------------------------------------------
// returns if all conditions are fullfilled
// -----------------------------------------------------------------------------------
CGE_Event.prototype.conditions_fullfilled = function(){
	if(this.erased)
		return false;
	if(this.conditions.length == 0)
		return true;
	for(var j=0; j < this.conditions.length; j++){
		var r = true;
		for(var i=0; i < this.conditions[j].length; i++){
			if(!this.interpreter.check_condition(this, this.conditions[j][i])){
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
}

CGE_Event.prototype.prepare_save = function(){
	this.interpreter = null;
}

CGE_Event.prototype.reload_save = function(main){
	this.interpreter = main.event_interpreter;
}
