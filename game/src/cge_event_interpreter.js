/* LIST OF EVENT EFFECTS:
	player_move				:	fast processing for moveing a player with key input (chara_id*, move_id, move_parameters, move_repeat)
	scroll								:	scrolling the complete screen (function(scrollx, event){ return new_scrollx;} , function(scrolly, event){ return new_scrolly;})
	change_map				:	changeing the map (map_id)
	play_music					:	playing a music file (music_id, musicfile, volume, repeat)
	stop_music					:	stop playing music (music_id)
	move								: 	perform a move-command (chara_id*, move_id, move_parameters, move_repeat)
	break_move					:	stops character from all moves (chara_id*)
	character_variable 		:	changes a character-variable (chara_id*, variable_key, function(variable){ return new_value;})	
	finish								:	finishes event-processing (-)
	erase								:	kills event (-)
	execute_function			:	executes specific javascript function (function(){})
	
	*use chara_id=-1 for the associated chara
*/

/* LIST OF EVENT CONDITIONS:
	chara_variable			:	value of character variable (chara_id*, function(v){ return new_v;})
	facing						:	facing of chara (chara_id*, facing == function(f){ return ?;})
*/

/* ======================================
			CGE EVENT INTERPRETER
			----------------------------------------------------------
			interprets event commands & conditions
====================================== */ 
function CGE_Event_Interpreter(main_object){
	this.active_event = null;		// active event
	this.parallel_events = [];	// array of parallel processed events
	this.main = main_object;
}
	
// -----------------------------------------------------------------------------------
// frame update
// -----------------------------------------------------------------------------------
CGE_Event_Interpreter.prototype.update = function(){
	var clone_para_events = this.parallel_events.slice(0);
	for(var i=0; i < clone_para_events.length; i++){
		var e = this.main.trigger_data.get_event_by_id(clone_para_events[i]);
		if(e != null){
			this.interpret_event(e);
			e.frame_index++;
			if(e.finished){
				e.active = false;
				var ix = this.parallel_events.indexOf(clone_para_events[i]);
				this.parallel_events.splice(ix, 1);
			}
		}else{
			alert("Warning: Invalid Event ID '"+clone_para_events[i]+"' was called.");
			var ix = this.parallel_events.indexOf(clone_para_events[i]);
			this.parallel_events.splice(ix, 1);
		}
	}
	if(this.active_event != null){
		var e = this.main.trigger_data.get_event_by_id(this.active_event);
		if(e != null){
			this.interpret_event(e);
			e.frame_index++;
			if(e.finished){
				e.active = false;
				this.active_event = null;
			}
		}else{
			alert("Warning: Invalid Event ID '"+clone_para_events[i]+"' was called.");
			var ix = this.parallel_events.indexOf(clone_para_events[i]);
			this.parallel_events.splice(ix, 1);
		}
	}
}

// -----------------------------------------------------------------------------------
// interpretation of an event
// -----------------------------------------------------------------------------------
CGE_Event_Interpreter.prototype.interpret_event = function(event){
	if(event.effects.length == 0){
		event.finished = true;
		event.effect_index = 0;
		return;
	}
	var effect_id = event.effects[event.effect_index][0];
	var para = event.effects[event.effect_index].slice(1);
	switch(effect_id){
		case "player_move" :
			if(para[0] == -1)
				var chara = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara = this.main.sprites_data.get_image_by_id(para[0]);
			var m = new CGE_Move(this.main.move_interpreter , para[1], para[2], para[3]);
			chara.moves = [];
			chara.add_move(m);
			chara.variables["walking"] = para[4];
			event.finished = true;
			break;
		case "scroll" :
			this.main.scroll_x = para[0](this.main.scroll_x, event);
			this.main.scroll_y = para[1](this.main.scroll_y, event);
			event.effect_index++;
			break;
		case "change_scene" :
			this.main.scene_data.new_scene_id = para[0];
			this.main.scene_data.alive = false;
			if(para[1] == null || para[1] == true)
				event.finished = true;
			event.effect_index++;
			break;
		case "change_map" :
			this.main.map_data.load_new_map(para[0]);
			if(para[1] == null || para[1] == true)
				event.finished = true;
			event.effect_index++;
			break;
		case "teleport" :
			if(para[0] == -1)
				var chara = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara = this.main.sprites_data.get_image_by_id(para[0]);
			chara.x = para[1](this.main, chara.x);
			chara.y = para[2](this.main, chara.y);
			event.effect_index++;
			break;
		case "play_music" :
			var div = $("#"+this.main.html_id);
			var id = this.main.html_id+'_music_'+para[0];
			$('#'+id).remove();
			div.append('<audio id="'+id+'"><source src="'+para[1]+'" type="audio/wav"></audio> ');
			if(para[2] != null)
				$('#'+id)[0].volume = para[2];
			else
				$('#'+id)[0].volume = 0.5;
			$('#'+id)[0].play();
			if(para[3]){
				$("#"+id)[0].addEventListener('ended', function(){ this.play(); });
			}
			event.effect_index++;
			break;
		case "stop_music" :
			var id = this.main.html_id+'_music_'+para[0];
			$('#'+id).remove();
			event.effect_index++;
			break;
		case "move" :
			if(para[0] == -1)
				var chara = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara = this.main.sprites_data.get_image_by_id(para[0]);
			var m = CGE_Move(this.main.move_interpreter , para[1], para[2], para[3]);
			chara.add_move(m);
			event.effect_index++;
			break;
		case "character_variable" :
			if(para[0] == -1)
				var chara = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara = this.main.sprites_data.get_image_by_id(para[0]);
			chara.variables[para[1]] = para[2](chara.variables[para[1]]);
			event.effect_index++;
			break;
		case "break_move" :
			if(para[0] == -1)
				var chara = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara = this.main.sprites_data.get_image_by_id(para[0]);
			chara.moves = [];
			event.effect_index++;
			break;
		case "change_select_index" :
			if(para[0] == -1)
				var win = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var win = this.main.sprites_data.get_image_by_id(para[0]);
			win.select_index = para[1](win.select_index);
			event.effect_index++;
			break;
		case "if" :
			var stack = 0;
			if(!this.check_conditions(event, para[0])){
				while(event.effect_index < event.effects.length){
					event.effect_index++;
					if(event.effects[event.effect_index][0] == "if")
						stack++;
					if(event.effects[event.effect_index][0] == "end"){
						if(stack <= 0){
							break;
						}else{
							stack--;
						}
					}
					if(event.effects[event.effect_index][0] == "else" && stack <= 0){
						event.effect_index++;
						break;
					}
				}
			}else{
				event.effect_index++;
			}
			break;
		case "else" :
			var stack = 0;
			while(event.effect_index < event.effects.length){
				event.effect_index++;
				if(event.effects[event.effect_index][0] == "if")
						stack++;
				if(event.effects[event.effect_index][0] == "end"){
					if(stack <= 0){
						break;
					}else{
						stack--;
					}
				}
			}
			break;
		case "end" :
			event.effect_index++;
			break;
		case "finish" :
			event.finished = true;
			break;
		case "erase" :
			event.finished = true;
			event.erased = true;
			break;
		case "save_game" :
			var save_data = this.main.save_to_string();
			// ...send to server ...
			event.effect_index++;
			break;
		case "load_game" :	
			var save_data = "";
			// ...get save from server...
			cge_load_game(save_data);
			this.main.alive = false;
			break;
		case "set_mouse_display" :
			if(para[0] == false)
				this.main.canv.style.cursor = "none";
			else	
				this.main.canv.style.cursor = "default";
			event.effect_index++;
			break;
		case "change_resolution" :
			this.main.canv.width = para[0](this.main.canv.width, this.main.canv.height);
			this.main.canv.height = para[1](this.main.canv.width, this.main.canv.height);
			this.main.canv_buffer.width = this.main.canv.width;
			this.main.canv_buffer.height = this.main.canv.height;
			event.effect_index++;
			break;
		case "execute_function" :
			para[0]();
			event.effect_index++;
			break;
		case "kill_game" :
			this.main.alive = false;
			break;
		default :
			alert("Warning: Event with unknown Effect ID '"+effect_id+"' was called.");
	}
	if(event.effect_index >= event.effects.length){
		event.finished = true;
		event.effect_index = 0;
	}
}


CGE_Event_Interpreter.prototype.check_conditions = function(event, cond){
	for(var j=0; j < cond.length; j++){
		var r = true;
		for(var i=0; i < cond[j].length; i++){
			if(!this.check_condition(event, cond[j][i])){
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

// -----------------------------------------------------------------------------------
// interpretation of an condition
// -----------------------------------------------------------------------------------
CGE_Event_Interpreter.prototype.check_condition = function(event, cond){
	var cond_id = cond[0];
	var para = cond.slice(1);
	switch(cond_id){
		case "chara_variable" :
			if(para[0] == -1)
				var chara = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara = this.main.sprites_data.get_image_by_id(para[0]);
			return para[2](chara.variables[para[1]]);
		case "facing" :
			if(para[0] == -1)
				var chara = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara = this.main.sprites_data.get_image_by_id(para[0]);
			if(para[2] == null)
				return (chara.facing == para[1]);
			return para[2](chara.facing, para[1]);
		case "select_index" :
			if(para[0] == -1)
				var win = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var win = this.main.sprites_data.get_image_by_id(para[0]);
			return para[1](win.select_index);
		default :
			alert("Warning: Condition with unknown ID '"+cond_id+"' was called.");
	}
	return false;
}