
/*
	List of Move-ids and their effects:
	
	-wait 															: 	waits a number of frames
	-move														:	moves character a given number of frames in a specific direction
	-walk															:	character walks a given number of frames in a specific direction
	-change_sequence 								:	changes the animation sequence of the character
	-change_image										:	changes the image file of the character
	-turn															:	changes the faceing direction of character
	-change_zoom										:	change zoom of the character
	-load_sequence										:	loads a special sequence of the character
	-execute_function									:	executes a given javascript function
*/

function cge_create_move_interpreter(){
	var o = new Object;
	o.map_data = null;
	o.grid_walk = false;
	
	o.update = function(chara, move){
		switch(move["id"]){
			case "wait": // p = [#frames to wait]
				if(move.frame_index >= move.para[0])
					move.ready = true;
				break;
			case "move":
				this.move_update(chara, move);
				if(move.frame_index >= move.para[0]){
					if(this.grid_walk){
						chara.set_x(parseInt(chara.x));
						chara.set_y(parseInt(chara.y));
					}
					move.ready = true;
				}
				break;
			case "turn":
				chara.faceing = move.para[0];
				chara.load_sequence("stand");
				move.ready = true;
				break;
			case "change_zoom" :
				if(move.para[2] == null)
					move.para[2] = move.para[1];
				if(move.para[0] == "multiply"){
					chara.zoom_x *= move.para[1];
					chara.zoom_y *= move.para[2];
				}else{
					chara.zoom_x = move.para[1];
					chara.zoom_y = move.para[2];
				}
				move.ready = true;
				break;
			case "change_image" : // p = [image_source, image_width, image_height]
				chara.image_source = move.para[0];
				if(move.para[1] != null)
					chara.width = move.para[1];
				if(move.para[2] != null)
					chara.height = move.para[2];
				move.ready = true;
				break;
			case "load_sequence": // p = [sequence key, (faceing)]
				chara.load_sequence(move.para[0], move.para[1]);
				move.ready = true;
				break;
			case "change_sequence" :	// p = [new sequence,  repeat?]
				chara.set_sequence(move.para[0], move_para[1]);
				move.ready = true;
				break;
			case "execute_function": // p = [function(){ some code}]
				move.para[0]();
				move.ready = true;
				break;
			default :
				alert("Warning: Move with unknown Move ID '"+move["id"]+"' was called.");
				move.ready = true;
		}
	};
	
	o.move_update = function(chara, move){
		if(this.grid_walk){
			var grid_size = this.map_data.tileset_grid_size*this.map_data.tileset_zoom_factor;
			var dr;
			switch(move.para[1]){
				case 0 :
					dr = [0,-grid_size];
					break;
				case 1 :
					dr = [grid_size,0];
					break;
				case 2 :
					dr = [0,grid_size];
					break;
				case 3 :
					dr = [-grid_size,0];
					break;
			}
			var blocked = false;
			var sum_dr = 0;
			var new_r = [chara.x, chara.y];
			while((sum_dr+grid_size < chara.speed) && !blocked){
				new_r[0] += dr[0];
				new_r[1] += dr[1];
				if(this.check_collision(new_r, chara)){ // passable
					chara.set_x(new_r[0]);
					chara.set_y(new_r[1]);
					sum_dr += grid_size;
				}else{
					blocked = true;
				}
			}
		}else{
			// Calculate velocity from speed and direction
			if (!(move.para[1] instanceof Array)){
				switch(move.para[1]){
					case 0 :
						move.para[1] = [0,-1];
						break;
					case 1 :
						move.para[1] = [1,0];
						break;
					case 2 :
						move.para[1] = [0,1];
						break;
					case 3 :
						move.para[1] = [-1,0];
						break;
				}
			}else if(move.para[1][2] != null){
				var r = Math.sqrt(move.para[1][0]+move.para[1][1]);
				move.para[1] = [move.para[1][0]/r, move.para[1][1]/r];
			}
			var v = [chara.speed*move.para[1][0], chara.speed*move.para[1][1]];
			// Calculate velocity-related quantities
			var v_abs = [Math.abs(v[0]), Math.abs(v[1])];
			if (v_abs[0] > v_abs[1]){
				if(v_abs[1] > 0){
					var vx_vy = [v_abs[0]/v_abs[1], 1];
				}else{
					var vx_vy = [v_abs[0], 0];
				}
			}else if(v_abs[0] > 0){
				var vx_vy = [1, v_abs[1]/v_abs[0]];
			}else{  
				var vx_vy = [0, v_abs[1]];
			}
			var v_signs = [v[0] > 0, v[1] > 0];
			var dr = [];
			if(v_signs[0])
				dr[0] = 1;
			else
				dr[0]  = -1;
			if(v_signs[1])
				dr[1] = 1;
			else
				dr[1]  = -1;
			// loop until moved full distance/frame or block
			var blocked = false;
			var sum_dr = [0,0];
			var new_r = [chara.x, chara.y];
			var col_counter = [[0],[0]]; // col-counter to prevent bad double collisions
			while((sum_dr[0] < v_abs[0] || sum_dr[1] < v_abs[1]) && (col_counter[0][0] < 2 && col_counter[1][0] < 2) && !blocked){
				for(var i=0; i < 2; i++){
					if(sum_dr[i] < v_abs[i]){ // check if distance in specific direction was reached
						if(sum_dr[i]+1 < v_abs[i]){ // check if full pixel step possiible
							for(var j=0; j < vx_vy[i]; j++){
								if(sum_dr[i]+1 >= v_abs[i]){ // check if no more full integer steps possible
									break;
								}else{ // perform full integer steps
									new_r[i] += dr[i];
									if(this.check_collision(new_r, chara)){ // passable
										chara.set_x(new_r[0]);
										chara.set_y(new_r[1]);
										sum_dr[i]++;
									}else{ // not passable
										blocked = true;
										new_r = [chara.x, chara.y];
										if(col_counter[i][1] == sum_dr[i]){ // double collision checker
											col_counter[i][0]++;
										}else{
											col_counter[i] = [0,sum_dr[i]];
										}
									}
								}
							}
						}else{
							// perform partial integer step
							var dn = v_abs[i]-sum_dr[i];
							if(v_signs[i]){
								new_r[i] += dn;
							}else{
								new_r[i] -= dn;
							}
							if(this.check_collision(new_r, chara)){ // passable
								chara.set_x(new_r[0]);
								chara.set_y(new_r[1]);
								sum_dr[i] += dn;
							}else{
								new_r = [chara.x, chara.y];
								if(col_counter[i][1] == sum_dr[i]){ // double collision checker
									col_counter[i][0]++;
								}else{
									col_counter[i] = [0,sum_dr[i]];
								}
							}
						}
					}
				}
			}
		}
	};
	
	o.check_collision = function(new_r, chara){
		return true;
	}
	
	return o;
}

function cge_create_move(move_interpreter, id, chara, parameter, repeat){
	var o = new Object;
	o.chara = chara;
	o.id = id;
	if(parameter == null)
		parameter = [];
	if(repeat == null)
		repeat = 1;
	o.para = parameter;
	o.repeat_index = repeat; // 1 - for no repeat, 0 for permanent repeat
	o.frame_index = 0;
	o.ready = false;
	o.move_interpreter = move_interpreter;
	
	o.update = function(){
		 this.move_interpreter.update(this.chara, this);
		 this.frame_index++;
		 if(this.ready){
			 if(this.repeat_index > 0){
				this.repeat_index--;
				this.chara.moves.shift();
				if(this.repeat_index != 0){
					this.chara.moves.push(this);	
				}
			 }
		 }
	};
	
	return o;
};