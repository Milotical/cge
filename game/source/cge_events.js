
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

function create_event(){
	var o = new Object;
	
	o.update = function(para){
		if(this.conditions_fullfilled){
			this.execute();
		}
	};
	
	o.conditions_fullfilled = function(){
		return false;
	};
	
	o.execute = function(){
		
	}
	
	return o;
}