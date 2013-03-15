
/*
	List of Move-ids and their effects:
	
	-wait 															: 	waits a number of frames
	-move														:	moves character in a specific direction (without any change in its animation)
	-walk															:	character walks in a specific direction (without any change in its animation)
	-stand														: 	character shows stand-anim (e.g. stops walk anim)
	-turn															:	changes the faceing direction of character
	-change_sequence 								:	changes the animation sequence of the character
	-change_image										:	changes the image file of the character
	-change_speed										:	changes the move-speed of the character
	-change_map_col									:	changes the map-col properties of the chatacter
	-change_trough										:	changes the general collision properties
	-change_var												:	changes a gam variable
	-change_zoom										:	change zoom of the character
	-load_sequence										:	loads a special sequence of the character
	-execute_function									:	executes a given javascript function
*/


// creates the object that interprets move-commands
function cge_create_move_interpreter(trigger_data){
	var o = new Object;
	o.map_data = null;
	o.grid_walk = false;
	o.trigger_data = trigger_data;
	o.col_resolution = 10;
	
	o.update = function(chara, move){
		switch(move["id"]){
			case "wait": // p = [#frames to wait]
				if(move.frame_index >= move.para[0])
					move.ready = true;
				break;
			case "stand" : // p = []
				chara.load_sequence("stand");
				move.ready = true;
				break;
			case "walk" : // p = [stop_parameter, direction, stop_event, (direction_parameter, stop_event_parameter)]
				if(move.frame_index == 0){
					move.special_attr = this.get_direction_from_direction_parameter(move.para[1],move.para[3], chara);
					chara.faceing = this.get_faceing_from_direction(move.special_attr);
					chara.load_sequence("walk");
				}
				this.move_update(chara, move, move.special_attr);
				break;
			case "move": // p =  [stop_parameter, direction, stop_event, (direction_parameter, stop_event_parameter)]
				this.move_update(chara, move);
				break;
			case "turn": // p = [direction, (direction_parameter)]
				var dir = this.get_direction_from_direction_parameter(move.para[0], move.para[1], move);
				chara.faceing = this.get_faceing_from_direction(dir);;
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
			case "change_speed" :
				chara.speed = move.para[0];
				move.ready = true;
				break;
			case "change_map_col" :	
				chara.map_collider = move.para[0];
				move.ready = true;
				break;
			case "change_trough" :
				chara.trough = move.para[0];
				move.ready = true;
				break;
			case "change_var" :
				// ...
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
	
	o.get_direction_from_direction_parameter = function(dir_para, dir_para2, chara){
		var dir = dir_para;
		if (!(dir instanceof Array)){
			switch(dir){
				case 0 :
					dir = [0,-1];
					break;
				case 1 :
					dir= [1,0];
					break;
				case 2 :
					dir= [0,1];
					break;
				case 3 :
					dir= [-1,0];
					break;
				case "random":
					var d1 = Math.random();
					dir = [d1, Math.sqrt(1-d1*d1)];
					if(Math.random() > 0.5)
						dir[0] = -dir[0];
					if(Math.random() > 0.5)
						dir[1] = -dir[1];
					break;
				case "random_sharp" :	
					dir = parseInt(Math.random()*4);
					dir = this.get_direction_from_direction_parameter(dir, dir_para2, chara);
					break;
				case "towards_point" :
					var dx = dir_para2[0]-chara.x;
					var dy = dir_para2[1]-chara.y;
					var r = Math.sqrt(dx*dx+dy*dy);
					dir = [(dx)/r, (dy)/r];
					break;
				case "away_point" :
					var dx = chara.x-dir_para2[0];
					var dy = chara.y-dir_para2[1];
					var r = Math.sqrt(dx*dx+dy*dy);
					dir = [(dx)/r, (dy)/r];
					break;
				case "towards_chara" :
					var chara2 = this.map_data.images[dir_para2];
					var dx = chara2.x-chara.x;
					var dy = chara2.y-chara.y;
					var r = Math.sqrt(dx*dx+dy*dy);
					dir = [(dx)/r, (dy)/r];
					break;
				case "away_chara" :
					var chara2 = this.map_data.images[dir_para2];
					var dx = chara.x-chara2.x;
					var dy = chara.y-chara2.y;
					var r = Math.sqrt(dx*dx+dy*dy);
					dir = [(dx)/r, (dy)/r];
					break;
				case "angle" :
					dir = this.get_direction_from_direction_parameter(chara.faceing, dir_para2, chara);
					var sin = Math.sin(dir_para2*Math.PI/180);
					var cos = Math.cos(dir_para2*Math.PI/180);
					dir = [dir[0]*cos-dir[1]*sin, dir[0]*sin+dir[1]*cos];
					break;
				case "forward" :
					dir = this.get_direction_from_direction_parameter(chara.faceing, chara, move);
					break;
				case "backward" :
					dir = this.get_direction_from_direction_parameter(this.get_opposite_faceing(chara.faceing), chara, move);
					break;
				default :
					alert("Warning: Move with unknown Direction ID '"+dir+"' was called.");
			}
		}else if(dir[2] != null){
			var r = Math.sqrt(dir[0]*dir[0]+dir[1]*dir[1]);
			dir = [dir[0]/r, dir[1]/r];
		}
		return dir;
	};
	
	o.get_opposite_faceing = function(faceing){
		switch(dir){
			case 0 :
				return 3;
			case 1 :
				return 2;
			case 2 :
				return 1;
			case 3 :
				return 0;
		}
		return 0;
	}
	
	o.move_update = function(chara, move, dir){
		if(move.frame_index == 0){
			// Calculate velocity from speed and direction
			if(dir == null)
				move.dir = this.get_direction_from_direction_parameter(move.para[1]);
			else	
				move.dir = dir;
			move.v = [chara.speed*dir[0], chara.speed*dir[1]];
			// Calculate velocity-related quantities
			move.v_abs = [Math.abs(move.v[0]), Math.abs(move.v[1])];
			if (move.v_abs[0] > move.v_abs[1]){
				if(move.v_abs[1] > 0){
					move.vx_vy = [move.v_abs[0]/move.v_abs[1], 1];
				}else{
					move.vx_vy = [move.v_abs[0], 0];
				}
			}else if(move.v_abs[0] > 0){
				move.vx_vy = [1, move.v_abs[1]/move.v_abs[0]];
			}else{  
				move.vx_vy = [0, move.v_abs[1]];
			}
			move.v_signs = [move.v[0] > 0, move.v[1] > 0];
			move.dr = [];
			
			if(move.v_signs[0])
				move.dr[0] = 1;
			else
				move.dr[0]  = -1;
			
			if(move.v_signs[1])
				move.dr[1] = 1;
			else
				move.dr[1]  = -1;
			
		}
		// loop until moved full distance/frame or block
		var blocked = false;
		var sum_dr = [0,0];
		var new_r = [chara.x, chara.y];
		var col_counter = [[0],[0]]; // col-counter to prevent bad double collisions
		while((sum_dr[0] < move.v_abs[0] || sum_dr[1] < move.v_abs[1]) && (col_counter[0][0] < 2 && col_counter[1][0] < 2) && !blocked){
			for(var i=0; i < 2; i++){
				if(sum_dr[i] < move.v_abs[i]){ // check if distance in specific direction was reached
					if(sum_dr[i]+this.col_resolution < move.v_abs[i]){ // check if full pixel step possiible
						for(var j=0; j < move.vx_vy[i] && !blocked; j++){
							if(sum_dr[i]+this.col_resolution >= move.v_abs[i]){ // check if no more full integer steps possible
								break;
							}else{ // perform full integer steps
								new_r[i] += move.dr[i];
								if(this.check_collision(new_r, chara, move.v, i)){ // passable
									if(i == 0){
										chara.set_x(new_r[0]);
									}else{
										chara.set_y(new_r[1]);
									}
									sum_dr[i] += this.col_resolution;
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
						var dn = move.v_abs[i]-sum_dr[i];
						if(move.v_signs[i]){
							new_r[i] += dn;
						}else{
							new_r[i] -= dn;
						}
						if(this.check_collision(new_r, chara, move.v, i)){ // passable
							if(i == 0){
								chara.set_x(new_r[0]);
							}else{
								chara.set_y(new_r[1]);
							}
							sum_dr[i] += dn;
						}else{
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
			}
		}
		switch(move.para[2]){
			case "frames" :
				if(move.frame_index >= move.para[0]){
					if(!this.grid_walk || this.check_grid_walk_point(chara.x, chara.y)){
						move.ready = true;
					}
				}
				break;
			case "dist" :
				if(!this.grid_walk){
					move.special_counter += chara.speed;
				}else if(this.grid_walk && this.check_grid_walk_point(chara.x, chara.y)){
					move.special_counter++;
				}
				if(move.special_counter == move.para[0]){
					move.ready = true;
					move.special_counter = 0;
				}
				break;
			case "dist_away_point" 	:
				if(!this.grid_walk || this.check_grid_walk_point(chara.x, chara.y)){
					var dx = move.para[4][0]-chara.x;
					var dy = move.para[4][1]-chara.y;
					var dist = move.para[4][2];
					if(dx*dx+dy*dy >= dist*dist){
						move.ready = true;
					}
				}
				break;
			case "dist_towards_point" 	:
				if(!this.grid_walk || this.check_grid_walk_point(chara.x, chara.y)){
					var dx = move.para[4][0]-chara.x;
					var dy = move.para[4][1]-chara.y;
					var dist = move.para[4][2];
					if(dx*dx+dy*dy <= dist*dist){
						move.ready = true;
					}
				}
				break;
			case "dist_away_x" 	:
				if(!this.grid_walk || this.check_grid_walk_point(chara.x, chara.y)){
					var dx = move.para[4][0]-chara.x;
					var dist = move.para[4][1];
					if(dx*dx >= dist*dist){
						move.ready = true;
					}
				}
				break;
			case "dist_away_y" 	:
				if(!this.grid_walk || this.check_grid_walk_point(chara.x, chara.y)){
					var dy = move.para[4][0]-chara.y;
					var dist = move.para[4][1];
					if(dy*dy >= dist*dist){
						move.ready = true;
					}
				}
				break;
			case "dist_towards_x" 	:
				if(!this.grid_walk || this.check_grid_walk_point(chara.x, chara.y)){
					var dx = move.para[4][0]-chara.x;
					var dist = move.para[4][1];
					if(dx*dx <= dist*dist){
						move.ready = true;
					}
				}
				break;
			case "dist_towards_y" 	:
				if(!this.grid_walk || this.check_grid_walk_point(chara.x, chara.y)){
					var dy = move.para[4][0]-chara.y;
					var dist = move.para[4][1];
					if(dy*dy <= dist*dist){
						move.ready = true;
					}
				}
				break;
			case "dist_away_x" 	:
				if(!this.grid_walk || this.check_grid_walk_point(chara.x, chara.y)){
					var dx = move.para[4][0]-chara.x;
					var dist = move.para[4][1];
					if(dx*dx >= dist*dist){
						move.ready = true;
					}
				}
				break;
			case "blocked" 	:
				if(!this.grid_walk || this.check_grid_walk_point(chara.x, chara.y)){
					if(blocked){
						move.ready = true;
					}
				}
				break;
			default :
				alert("Warning: Move with unknown Stop Event ID '"+move.para[2]+"' was called.");
				move.ready = true;
				break;
		}
	};
	
	o.check_grid_walk_point = function(x, y){
		return (parseInt(x)%(this.map_data.tileset_grid_size*this.map_data.tileset_zoom_factor)==0 && parseInt(y)%(this.map_data.tileset_grid_size*this.map_data.tileset_zoom_factor)==0);
	};
	
	o.check_collision = function(new_r, chara, velocity, coord_index){
		if(chara.trough)
			return false;
		var return_value = true;
		var map_collision = false;
		var x0, y0, xi, yi;
		var cw = chara.get_hitbox().width;
		var ch = chara.get_hitbox().height;
		// calculate the potential collision direction
		var dir;
		if(velocity[coord_index] > 0){
			dir = 1+coord_index;
		}else{
			dir = 3-coord_index;
		}
		// Map-Collision
		if(this.map_data.loaded && chara.map_collider){
			if(coord_index == 0){
				var dy = (this.map_data.tileset_grid_size*this.map_data.tileset_zoom_factor);
				x0 = new_r[0];
				if(velocity[coord_index] > 0){
					x0 += cw;
				}
				y0 = new_r[1];
				yi = 0;
				while(yi+1 < ch){
					if(!this.map_data.passable(x0, y0+yi, dir)){
						map_collision = true;
						return_value = false;
					}
					yi += dy;
				}
			}else{
				var dx = (this.map_data.tileset_grid_size*this.map_data.tileset_zoom_factor);
				y0 = new_r[1];
				if(velocity[coord_index] > 0){
					y0 += ch;
				}
				x0 = new_r[0];
				xi = 0;
				while(xi+1 < cw){
					if(!this.map_data.passable(x0+xi, y0, dir)){
						map_collision = true;
						return_value = false;
					}
					xi += dx;
				}
			}
			if(map_collision){
				this.trigger_data.update("collision", [chara, "map"]);
			}
		}
		// Character Collision
		for(var i = 0;i < chara.col_spritesets.length; i++){
			if(chara.col_spritesets[i].check_collision(new_r, chara, dir)){
				return_value = false;
			}
		}
		return return_value;
	};
	
	o.get_faceing_from_direction = function(dir){
		if (!(dir instanceof Array)){
			return dir;
		}
		var x_abs = Math.abs(dir[0]);
		var y_abs = Math.abs(dir[1]);
		if(x_abs > y_abs){
			if(dir[0] > 0){
				return 1;
			}else{
				return 3;
			}
		}else{
			if(dir[1] > 0){
				return 2;
			}else{
				return 0;
			}
		}
		return 2;
	};
	
	return o;
}

// creates a move-command
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
	o.frame_index = 0; // counts the execution frames
	o.ready = false;
	o.move_interpreter = move_interpreter;
	o.special_counter = 0;
	
	o.update = function(){
		 this.move_interpreter.update(this.chara, this);
		 this.frame_index++;
		 if(this.ready){
			 if(this.repeat_index > 0){
				this.repeat_index--;
				this.chara.moves.shift();
				if(this.repeat_index != 0){
					this.ready = false;
					this.frame_index = 0;
					this.chara.moves.push(this);	
				}
			 }else{
				this.ready = false;
				this.frame_index = 0;
				this.chara.moves.push(this);
			 }
		 }
	};
	
	return o;
};