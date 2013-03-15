
function cge_create_trigger_data(){
	var o = new Object;
	o.global_events = {};
	o.map_events = {}
	o.scene_events = {}
	
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
	
	o.update = function(id, para){
		for(i in this.global_events[id]){
			this.global_events[id][i].update(para);
		};
		for(i in this.map_events[id]){
			this.map_events[id][i].update(para);
		};
		for(i in this.scene_events[id]){
			this.scene_events[id][i].update(para);
		};
	};
	
	return o;
}

function create_event(event_interpreter, effects, conditions, parallel, related_chara){
	var o = new Object;
	o.effects = effects;
	o.conditions = conditions;
	o.parallel = parallel;
	o.effect_index = 0;
	o.chara = related_chara;
	o.interpreter = event_interpreter;
	
	o.update = function(para){
		if(this.conditions_fullfilled){
			if(this.parallel){
				this.execute_effect(this.effect_index, para);
				this.effect_index++;
				if(this.effect_index >= effects.length)
					this.effect_index = 0;
			}else{
				for(var i=0; i < effects.length; i++){
					this.execute_effect(i, para);
				}
			}
		}
	};
	
	o.execute_effect = function(index, para){
		this.interpreter.execute(this, this.effects[index], para);
	};
	
	o.conditions_fullfilled = function(){
		for(var i=0; i < this.conditions.length; i++){
			if(!this.check_condition(this.condition[i])){
				return false;
			}
		}
		return true;
	};
	
	o.check_condition = function(cond){
		
		return false;
	};
	
	return o;
}