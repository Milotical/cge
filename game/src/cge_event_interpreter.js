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
			if(para[2] == null)
				screen_id = 0;
			else	
				screen_id = para[2];
			this.main.scroll_x[screen_id] = para[0](this.main.scroll_x, event);
			this.main.scroll_y[screen_id] = para[1](this.main.scroll_y, event);
			event.effect_index++;
			break;
		case "change_map_point" :
			var x = para[0];
			var y = para[1];
			var layer_index = para[2];
			var new_tileset_index = para[3];
			this.main.map_data.layers[layer_index][y][x] = new_tileset_index;
			event.effect_index++;
			break;
		case "change_map_layer" :
			var layer = this.main.map_data.layers[para[0]];
			for(var y=0; y < layer.length; y++){
				for(var x=0; x < layer[y].length; x++){
					if(para[1](layer[y][x]))
						layer[y][x] = para[2](layer[y][x]);
				}
			}
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
		case "start_timer" :
			var timer = new CGE_Timer(para[0], para[1], para[2]);
			this.main.trigger_data.timer[para[0]] = timer;
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
			var m = new CGE_Move(this.main.move_interpreter , para[1], para[2], para[3]);
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
		case "scene_variable" :
			this.main.scene_data.scene_variables[para[0]] = para[1](this.main.scene_data.scene_variables[para[0]]);
			event.effect_index++;
			break;
		case "map_variable" :
			this.main.map_data.map_variables[para[0]] = para[1](this.main.map_data.map_variables[para[0]]);
			event.effect_index++;
			break;
		case "global_variable" :
			this.main.global_variables[para[0]] = para[1](this.main.global_variables[para[0]]);
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
		case "create_event" :
			var event_data = {"id" : para[0], "trigger" : para[1], "effects" : para[2], "conditions" : para[3], "parallel" : para[5], "chara" : para[4]};
			if(this.main.scene_data.scene_id == "map")
				this.main.map_data.add_event(event_data);
			else	
				this.main.scene_data.add_event(event_data);
			event.effect_index++;
			break;
		case "speak" :
			var id = para[0];
			if(para[2] == null || para[2] == -1)
				var chara = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara = this.main.sprites_data.get_image_by_id(para[2]);
			if(para[3] != null)
				var dx = para[3];
			else
				var dx = -100;
			if(para[4] != null)
				var dy = para[4];
			else
				var dy = -150;
			if(para[5] != null)
				var dx0 = para[5];
			else
				var dx0 = 10;
			if(para[6] != null)
				var dy0 = para[6];
			else
				var dy0 = 1;
			if(event.frame_index  == 0){
				var text = para[1][0];
				if(para[7] != null)
					var z = para[7];
				else
					var z = 5;
				if(para[8] != null)
					var r = para[8];
				else
					var r = 20;
				if(para[9] != null)
					var width = para[9];
				else
					var width = 200;	
				if(para[10] != null)
					var height = para[10];
				else
					var height = 100;
				if(para[11] != null)
					var letter_duration = para[11];
				else
					var letter_duration = 5;
				if(para[12] != null)
					var i_source = para[12];
				else
					var i_source =  "res/style/icons.png";
				if(para[13] != null)
					var i_cols = para[13];
				else
					var i_cols = 4;
				if(para[14] != null)
					var i_rows = para[14];
				else
					var i_rows = 3;
				if(para[15] != null)
					var i_width = para[15];
				else
					var i_width = 88;
				if(para[16] != null)
					var i_height = para[16];
				else
					var i_height = 66;
				if(para[17] != null){
					var f_source = para[17];
					if(para[18] != null)
						var f_cols = para[18];
					else
						var f_cols = 16;
					if(para[19] != null)
						var f_rows = para[19];
					else
						var f_rows = 16;
					if(para[20] != null)
						var f_width = para[20];
					else
						var f_width = 352;
					if(para[21] != null)
						var f_height = para[21];
					else
						var f_height = 352;
				}else{
					var f_source =  null;
					var f_cols = null; 
					var f_rows = null;
					var f_width = null;
					var f_height = null;
				}
				var bubble = new CGE_Speech_Bubble(id, text, this.main.sprites_data, width, height, r, chara.x+dx0, chara.y+dy0, chara.x+dx, chara.y+dy, z,i_source, i_cols, i_rows, i_width, i_height,f_source, f_cols, f_rows, f_width, f_height, letter_duration);
				if(this.main.scene_data.scene_id == "map"){
					this.main.map_data.images.push(bubble);
				}
				this.main.sprites_data.add_image(bubble);
				event.frame_index++;
			}
			var bubble = this.main.sprites_data.get_image_by_id(id);
			bubble.x = chara.x + dx;
			bubble.y = chara.y + dy;
			bubble.x0 = chara.x + dx0; 
			bubble.y0 = chara.y + dy0;
			if(para[22] != null)
				var action_key = para[22];
			else
				var action_key = 13;
			if(this.main.input_controller.newpress(action_key)){
				if(bubble.completed()){
					if(event.frame_index >= para[1].length){
						event.effect_index++;
						event.frame_index  = 0;
						if(this.main.scene_data.scene_id == "map"){
							this.main.map_data.remove_image(bubble);
							this.main.map_data.remove_image_by_id(bubble.status_img_id);
						}
						bubble.remove();
					}else{
						bubble.full_text = para[1][event.frame_index];
						bubble.frame_index  = 0;
						bubble.refresh();
						event.frame_index++;
					}
				}else{
					bubble.complete();
				}
			}
			if(para[23] != null)
				var distance_killer = para[23];
			else
				var distance_killer = null;
			if(distance_killer != null){
				var chara2 = this.main.sprites_data.get_image_by_id(para[24]);
				var dx = (chara.x+chara.get_width()/2)-(chara2.x+chara2.get_width()/2);
				var dy = (chara.y+chara.get_height()/2)-(chara2.y+chara2.get_height()/2);
				var d = Math.sqrt(dx*dx + dy*dy);
				if(d > distance_killer){
					event.effect_index++;
					event.frame_index  = 0;
					//event.finished = true;
					if(this.main.scene_data.scene_id == "map"){
						this.main.map_data.remove_image(bubble);
						this.main.map_data.remove_image_by_id(bubble.status_img_id);
					}
					bubble.remove();
				}
			}
			break;
		case "choice" :
			var id = para[0];
			if(para[2] == null || para[2] == -1)
				var chara = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara = this.main.sprites_data.get_image_by_id(para[2]);
			if(para[3] != null)
				var dx = para[3];
			else
				var dx = -100;
			if(para[4] != null)
				var dy = para[4];
			else
				var dy = -150;
			if(para[5] != null)
				var dx0 = para[5];
			else
				var dx0 = 10;
			if(para[6] != null)
				var dy0 = para[6];
			else
				var dy0 = 1;
			if(event.frame_index  == 0){
				var choices = para[23];//["[s=12]ja","[s=12]nein"];//para[22];
				var choices_borders = para[24];//[40,30];//para[23];
				var choices_spacing = para[25];//15;//para[24];
				var c_source = para[26];//"res/style/cursor.png";//para[25];
				var c_width = para[27];//18;//para[26];
				var c_height = para[28];//17;//para[27];
				var c_offsets = para[29];//[-18,10];//para[28];
				var text = para[1];
				if(para[7] != null)
					var z = para[7];
				else
					var z = 5;
				if(para[8] != null)
					var r = para[8];
				else
					var r = 20;
				if(para[9] != null)
					var width = para[9];
				else
					var width = 200;	
				if(para[10] != null)
					var height = para[10];
				else
					var height = 100;
				if(para[11] != null)
					var letter_duration = para[11];
				else
					var letter_duration = 5;
				if(para[12] != null)
					var i_source = para[12];
				else
					var i_source =  "res/style/icons.png";
				if(para[13] != null)
					var i_cols = para[13];
				else
					var i_cols = 4;
				if(para[14] != null)
					var i_rows = para[14];
				else
					var i_rows = 3;
				if(para[15] != null)
					var i_width = para[15];
				else
					var i_width = 88;
				if(para[16] != null)
					var i_height = para[16];
				else
					var i_height = 66;
				if(para[17] != null){
					var f_source = para[17];
					if(para[18] != null)
						var f_cols = para[18];
					else
						var f_cols = 16;
					if(para[19] != null)
						var f_rows = para[19];
					else
						var f_rows = 16;
					if(para[20] != null)
						var f_width = para[20];
					else
						var f_width = 352;
					if(para[21] != null)
						var f_height = para[21];
					else
						var f_height = 352;
				}else{
					var f_source =  null;
					var f_cols = null; 
					var f_rows = null;
					var f_width = null;
					var f_height = null;
				}
				var bubble = new CGE_Choice_Bubble(id, text, choices, this.main.sprites_data, width, height, r, chara.x+dx0, chara.y+dy0, chara.x+dx, chara.y+dy, z, choices_borders, choices_spacing, c_source, c_width, c_height, c_offsets, i_source, i_cols, i_rows, i_width, i_height,f_source, f_cols, f_rows, f_width, f_height, letter_duration);
				if(this.main.scene_data.scene_id == "map"){
					this.main.map_data.images.push(bubble);
				}
				this.main.sprites_data.add_image(bubble);
				event.frame_index++;
			}
			var bubble = this.main.sprites_data.get_image_by_id(id);
			bubble.x = chara.x + dx;
			bubble.y = chara.y + dy;
			bubble.x0 = chara.x + dx0; 
			bubble.y0 = chara.y + dy0;
			if(para[22] != null)
				var action_key = para[22];
			else
				var action_key = 13;
			var change_keys = para[30];//[38,40];
			var special_keys = para[31];//[[16,1,false]];
			var variable = para[32];//["chara", -1, "decision", function(r){ return r;}];
			if(this.main.input_controller.newpress(change_keys[0])){
				bubble.select_index -= 1;
				if(bubble.select_index < 0)
					bubble.select_index = bubble.choices.length-1;
			}
			if(this.main.input_controller.newpress(change_keys[1])){
				bubble.select_index = (bubble.select_index+1)%bubble.choices.length;
			}
			if(this.main.input_controller.newpress(action_key)){
				if(variable[0] == "chara" && variable[1] == -1)
					v1 = event.chara;
				else	
					v1 = variable[1];
				this.set_variable( [ variable[0], v1, variable[2], variable[3](bubble.select_index, bubble.choices[bubble.select_index]) ]  );
				event.effect_index++;
				event.frame_index  = 0;
				if(this.main.scene_data.scene_id == "map"){
					this.main.map_data.remove_image(bubble);
					this.main.map_data.remove_image_by_id(bubble.status_img_id);
					for(var i=0; i < bubble.choice_image_ids.length; i++){
						this.main.map_data.remove_image_by_id(bubble.id+"_choice_"+i);
					}
					this.main.map_data.remove_image_by_id(bubble.id+"_cursor");
				}
				bubble.remove();
			}
			for(var i=0; i < special_keys.length; i++){
				if(this.main.input_controller.newpress(special_keys[i])){
					bubble.select_index = special_keys[i][1];
					if(special_keys[i][1]){
						if(variable[0] == "chara" && variable[1] == -1)
							v1 = event.chara;
						else	
							v1 = variable[1]
						this.set_variable([variable[0],v1,variable[2],variable[3](bubble.select_index, bubble.choices[bubble.select_index])]);
						event.effect_index++;
						event.frame_index  = 0;
						if(this.main.scene_data.scene_id == "map"){
							this.main.map_data.remove_image(bubble);
							this.main.map_data.remove_image_by_id(bubble.status_img_id);
							for(var i=0; i < bubble.choice_image_ids.length; i++){
								this.main.map_data.remove_image_by_id(bubble.id+"_choice_"+i);
							}
							this.main.map_data.remove_image_by_id(bubble.id+"_cursor");
						}
						bubble.remove();
					}
				}
			}
			if(para[33] != null)
				var distance_killer = para[33];
			else
				var distance_killer = null;
			var distance_killer_choice = para[35];
			if(distance_killer != null){
				var chara2 = this.main.sprites_data.get_image_by_id(para[34]);
				var dx = (chara.x+chara.get_width()/2)-(chara2.x+chara2.get_width()/2);
				var dy = (chara.y+chara.get_height()/2)-(chara2.y+chara2.get_height()/2);
				var d = Math.sqrt(dx*dx + dy*dy);
				if(d > distance_killer){
					event.effect_index++;
					event.frame_index  = 0;
					//event.finished = true;
					if(this.main.scene_data.scene_id == "map"){
						this.main.map_data.remove_image(bubble);
						this.main.map_data.remove_image_by_id(bubble.status_img_id);
						for(var i=0; i < bubble.choice_image_ids.length; i++){
							this.main.map_data.remove_image_by_id(bubble.id+"_choice_"+i);
						}
						this.main.map_data.remove_image_by_id(bubble.id+"_cursor");
					}
					if(variable[0] == "chara" && variable[1] == -1)
						v1 = event.chara;
					else	
						v1 = variable[1];
					this.set_variable( [ variable[0], v1, variable[2], variable[3](distance_killer_choice, bubble.choices[distance_killer_choice]) ]  );
					bubble.remove();
				}
			}
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
		case "wait" :
			if(event.frame_index >= para[0]){
				event.effect_index++;
				event.frame_index  = 0;
			}else{
				event.frame_index++;
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
			var save_id = para[0];
			$.post("src/SaveGame.php", { saveID : save_id, saveData : save_data } );
			event.effect_index++;
			break;
		case "load_game" :
			var save_id = para[0];
			var main = this.main;
			$.post("src/LoadGame.php", { saveID : save_id } ,
				function(data){
					cge_load_game(data);
				}, "text"
			);
			main.alive = false;
			break;
		case "create_data_object" :
			var type = para[0];
			if(this.main.data_objects[type] == null)
				this.main.data_objects[type] = [];
			o = new Object;
			for(var i=0; i < para[1].length; i++){
				o[para[1][i]] = para[2][i];
			}
			this.main.data_objects[type].push(o);
			event.effect_index++;
			break;
		case "delete_data_object" :
			var type = para[1];
			var a = this.data_objects[type];
			var index = a.indexOf(para[0]);
			this.data_objects[type].splice(index, 1);
			event.effect_index++;
			break;
		case "load_database" :
			if(event.frame_index == 0){
				event.frame_index = 1;
				var main = this.main;
				$.post("src/LoadDatabase.php", { ids : para[0], sources : para[1]  } ,
					function(data){
						//main.debug_m(data);
						eval(data);
						event.frame_index = 2;
					}, "text"
				);
			}else if(event.frame_index == 2){
				event.frame_index = 0;
				event.effect_index++;
			}
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
			event.effect_index++;
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

CGE_Event_Interpreter.prototype.set_variable = function(para){
	if(para[0] == "global"){
		this.main.global_variables[para[1]] = para[2];
	}else if(para[0] == "scene"){
		this.main.scene_data.scene_variables[para[1]] = para[2];
	}else if(para[0] == "map"){
		this.main.map_data.map_variables[para[1]] = para[2];
	}else if(para[0] == "chara"){
		var img = this.main.sprites_data.get_image_by_id(para[1]);
		if(img != null){
			img.variables[para[2]] = para[3];
		}
	}
}


CGE_Event_Interpreter.prototype.get_variable = function(para){
	if(para[0] == "global"){
		return this.main.global_variables[para[1]];
	}else if(para[0] == "scene"){
		return this.main.scene_data.scene_variables[para[1]];
	}else if(para[0] == "map"){
		return this.main.map_data.map_variables[para[1]];
	}else if(para[0] == "chara"){
		var img = this.main.sprites_data.get_image_by_id(para[1]);
		if(img != null){
			return img.variables[para[2]];
		}
	}
}

// -----------------------------------------------------------------------------------
// interpretation of an condition
// -----------------------------------------------------------------------------------
CGE_Event_Interpreter.prototype.check_condition = function(event, cond){
	var cond_id = cond[0];
	var para = cond.slice(1);
	switch(cond_id){
		case "distance" :
			if(para[0] == -1)
				var chara1 = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara1 = this.main.sprites_data.get_image_by_id(para[0]);
			
			if(para[1] == -1)
				var chara2 = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara2 = this.main.sprites_data.get_image_by_id(para[1]);
			
			var dx = (chara1.x+chara1.get_width()/2)-(chara2.x+chara2.get_width()/2);
			var dy = (chara1.y+chara1.get_height()/2)-(chara2.y+chara2.get_height()/2);
			var d = Math.sqrt(dx*dx + dy*dy);
			return para[2](d);
			break;
		case "chara_variable" :
			if(para[0] == -1)
				var chara = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara = this.main.sprites_data.get_image_by_id(para[0]);
			return para[2](chara.variables[para[1]]);
		case "scene_variable" :
			return para[1](this.main.scene_data.scene_variables[para[0]]);
		case "map_variable" :
			return para[1](this.main.map_data.map_variables[para[0]]);
		case "global_variable" :
			return para[1](this.main.global_variables[para[0]]);
		case "facing" :
			if(para[0] == -1)
				var chara = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara = this.main.sprites_data.get_image_by_id(para[0]);
			if(para[2] == null)
				return (chara.facing == para[1]);
			return para[2](chara.facing, para[1]);
		case "facing_towards" :
			if(para[0] == -1)
				var chara1 = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara1 = this.main.sprites_data.get_image_by_id(para[0]);
			
			if(para[1] == -1)
				var chara2 = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var chara2 = this.main.sprites_data.get_image_by_id(para[1]);
			
			var dx = (chara1.x+chara1.get_width()/2)-(chara2.x+chara2.get_width()/2);
			var dy = (chara1.y+chara1.get_height()/2)-(chara2.y+chara2.get_height()/2);
			if(chara1.facing == 0)
				return (dy > 0 && Math.abs(dy) > Math.abs(dx));
			else if(chara1.facing == 1)
				return (dx < 0 && Math.abs(dx) > Math.abs(dy));
			else if(chara1.facing == 2)
				return (dy < 0 && Math.abs(dy) > Math.abs(dx));
			else if(chara1.facing == 3)
				return (dx > 0 && Math.abs(dx) > Math.abs(dy));
			
			return false;
		case "select_index" :
			if(para[0] == -1)
				var win = this.main.sprites_data.get_image_by_id(event.chara);
			else	
				var win = this.main.sprites_data.get_image_by_id(para[0]);
			return para[1](win.select_index);
		case "timer" :
			var timer = this.main.trigger_data.timer[para[0]];
			return para[1](timer);
		default :
			alert("Warning: Condition with unknown ID '"+cond_id+"' was called.");
	}
	return false;
}


