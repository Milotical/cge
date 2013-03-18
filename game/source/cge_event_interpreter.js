
cge_create_event_interpreter = function(main_object){
	o = new Object;
	o.active_event = null;
	o.parallel_events = [];
	o.main = main_object;
	
	o.update = function(){
		var clone_para_events = this.parallel_events.slice(0);
		for(var i=0; i < clone_para_events.length; i++){
			this.interpret_event(clone_para_events[i]);
			clone_para_events[i].frame_index++;
			if(clone_para_events[i].finished){
				clone_para_events[i].active = false;
				clone_para_events[i].finished = false;
				this.parallel_events.splice(i, 1);
			}
		}
		if(this.active_event != null){
			this.interpret_event(this.active_event);
			this.active_event.frame_index++;
			if(this.active_event.finished){
				this.active_event.finished = false;
				this.active_event.active = false;
				this.active_event = null;
			}
		}
	};
	
	o.interpret_event = function(event){
		var effect_id = event.effects[event.effect_index][0];
		var para = event.effects[event.effect_index].slice(1);
		switch(effect_id){
			case "move" :
				if(para[0] == -1)
					var chara = event.chara;
				else	
					var chara = this.main.sprites_data.images[para[0]];
				var m = cge_create_move(this.main.move_interpreter , para[1], chara, para[2], para[3]);
				chara.add_move(m);
				event.effect_index++;
				break;
			case "break_move" :
				if(para[0] == -1)
					var chara = event.chara;
				else	
					var chara = this.main.sprites_data.images[para[0]];
				chara.moves = [];
				event.effect_index++;
				break;
			case "finish" :
				event.finished = true;
				break;
			case "erase" :
				event.finished = true;
				event.erased = true;
				break;
			case "execute_function" :
				para[0]();
				event.effect_index++;
				break;
			default :
				alert("Warning: Event with unknown Effect ID '"+effect_id+"' was called.");
		}
		if(event.effect_index >= event.effects.length)
			event.effect_index = 0;
	};
	
	return o;
}