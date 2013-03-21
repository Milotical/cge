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
	faceing						:	faceing of chara (chara_id*, faceing == function(f){ return ?;})
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
		this.interpret_event(e);
		e.frame_index++;
		if(e.finished){
			e.active = false;
			e.finished = false;
			var ix = this.parallel_events.indexOf(clone_para_events[i]);
			this.parallel_events.splice(ix, 1);
		}
	}
	if(this.active_event != null){
		var e = this.main.trigger_data.get_event_by_id(this.active_event);
		this.interpret_event(e);
		e.frame_index++;
		if(e.finished){
			e.finished = false;
			e.active = false;
			this.active_event = null;
		}
	}
}

// -----------------------------------------------------------------------------------
// interpretation of an event
// -----------------------------------------------------------------------------------
CGE_Event_Interpreter.prototype.interpret_event = function(event){
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
		case "change_map" :	
			
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
		case "finish" :
			event.finished = true;
			break;
		case "erase" :
			event.finished = true;
			event.erased = true;
			break;
		case "save_game" :
			this.main.save_to_string();
			event.effect_index++;
			break;
		case "load_game" :	
			var t = this.main.save_to_string();
			this.main.load_from_string(t);
			event.effect_index++;
			break;
		case "execute_function" :
			para[0]();
			event.effect_index++;
			break;
		case "kill_game" :
			this.main.alive = false;
			event.effect_index++;
			break;
		default :
			alert("Warning: Event with unknown Effect ID '"+effect_id+"' was called.");
	}
	if(event.effect_index >= event.effects.length){
		event.finished = true;
	}
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
		case "faceing" :
			if(para[0] == -1)
				var chara = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara = this.main.sprites_data.get_image_by_id(para[0]);
			if(para[2] == null)
				return (chara.faceing == para[1]);
			return para[2](chara.faceing, para[1]);
		default :
			alert("Warning: Condition with unknown ID '"+cond_id+"' was called.");
	}
	return false;
}