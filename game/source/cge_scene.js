

function cge_create_scene(main_object){
	var o = new Object;
	o.alive = false;									
	o.new_scene_id = 0;
	o.main_object = main_object;
	o.variables = {};
	o.temp_variables = {};
	
	o.start = function(){ };
	o.update = function(){ };
	o.end = function(){ };
	o.ctx = null;
	o.main_object.trigger_data.remove_all_scene_events();
	
	// order new scene from the server
	o.order_new_scene_data = function(){
		// AJAX holt sich neue scene_start, scene_update und scene_end function (und gegebenenfalls verwendete Funktionen) und scene_data
		var scene_data = [];
		scene_data["layers"] = [];
		scene_data["layers"][0] = [[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],[9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9]];
		scene_data["layers"][1] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,7,0,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		scene_data["layers"][2] = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,7,7,0,0,0,0,0,0,7,7,7,0,0,0,0,0,0,0,0]];
		scene_data["tileset_name"] = "Testset.png";
		scene_data["tileset_grid_size"] = 32;
		scene_data["tileset_zoom_factor"] = 1.0;
		scene_data["tileset_row_width"] = 8;
		scene_data["tileset_passable"] = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,1,1,1],[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
		scene_data["chara"] = [];
		
		for(var i=0; i<60; i++){
			//scene_data["chara"][i] = {"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : i*10, "y" : i*10, "z" : 1, "face" : 0};
			scene_data["chara"][i] = {"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : Math.random()*640, "y" : Math.random()*480, "z" : 1, "face" : 0};
			//scene_data["chara"][i]["moves"] = [["walk",[parseInt(Math.random()*200),"random","frames"],0]];
			scene_data["chara"][i]["moves"] = [ ["walk",[100,"towards_chara","dist",0],0]];
			
			scene_data["chara"][i]["blocking_classes"] = ["std"];
		}
		
		/*scene_data["chara"][0] = {"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : 234, "y" : 172, "z" : 1, "face" : 2};
		scene_data["chara"][0]["moves"] = [["wait",[100]],["walk",[32,"angle","dist_away_point",-90,[234,172,100]]],["stand"],["wait",[100]],["walk",[100,1,"frames"]],["stand"]];
		scene_data["chara"][0]["blocking_classes"] = ["std"];
		/*scene_data["chara"][1] = {"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : 334, "y" : 172, "z" : 1, "face" : 2};
		scene_data["chara"][1]["moves"] = [["walk",[32,"towards_point","dist",[320,240]]],["stand"],["wait",[100]],["walk",[100,3,"frames"]],["stand"]];
		scene_data["chara"][1]["blocking_classes"] = ["std"];
		/*scene_data["chara"][2] = {"source" : "Poyo_chara.png", "width" : 156, "height" :175, "rows" : 4, "chols" : 4, "x" : 224, "y" : 100, "z" : 1, "face" : 2};
		scene_data["chara"][2]["moves"] = [["walk",[100,2]],["stand"],["wait",[100]],["walk",[100,3]],["stand"]];
		scene_data["chara"][2]["blocking_classes"] = ["std"];*/
		
		this.sprites_data = cge_create_sprites_data(this.main_object);
		this.main_object.trigger_data.remove_all_map_events();
		this.map_data = cge_create_map_data_object(scene_data, this.sprites_data);
		
		this.ta = [];
		
		this.start = function(){
			this.map_data.restore_images();
		//	this.test_image = this.new_image("Poyo.png",100,100,1,200.1,102);
			/*this.test_image2 = this.new_image("Poyo.png",100,100,50,250,101);
			this.test_image3 = this.new_image("Poyo.png",100,100,100,230,-1);
			this.test_image2.set_z(103);
			this.test_image4 = this.new_sprite("Poyo.png", 228, 940, 10, 2, 200, 200, 101);*/
			//this.test_image5 = this.new_anim_sprite("Poyo.png", 228, 940, 10, 2, 200, 310, 101, [[0,3],[1,3]]);
			//this.test_image5.repeat = true;
			this.main_object.trigger_data.update("start_scene");
			this.main_object.trigger_data.update("start_map");
			var canv = $('#'+this.main_object.html_id+'_canvas');
			this.ctx = canv[0].getContext('2d');
		};
		this.update = function(){
			this.sprites_data.update_images();
			//this.sprites_data.update_images(this.ctx, null, -1);
			//this.map_data.update(this.ctx);
			//this.sprites_data.update_images(this.ctx, this.map_data.layers.length);
			this.sprites_data.draw_images(this.ctx, null, -1);
			this.map_data.draw_tiled_map(this.ctx);
			this.sprites_data.draw_images(this.ctx, this.map_data.layers.length);
		};
		
		this.end = function(){
			this.main_object.trigger_data.update("end_map");
			this.main_object.trigger_data.update("end_scene");
			this.test_image.remove();
			delete  this.test_image;
			this.test_image2.remove();
			delete  this.test_image2;
			this.test_image3.remove();
			delete  this.test_image3;
			this.test_image4.remove();
			delete  this.test_image4;
			this.test_image5.remove();
			delete  this.test_image5;
			this.map_data.remove_images();
		};
		// --------------
		
		o.new_image = function(image_source, width, height, x, y, z){
			return cge_create_image(this.sprites_data, image_source, width, height,x,y,z);
		};
		o.new_sprite = function(image_source, width, height, rows, cols, x, y, z){
			return cge_create_sprite(this.sprites_data, image_source, width, height, rows, cols, x, y, z);
		};
		o.new_anim_sprite = function(image_source, width, height, rows, cols, x, y, z, frame_sequence){
			return cge_create_anim_sprite(this.sprites_data, image_source, width, height, rows, cols, x, y, z,frame_sequence);
		};
		
		this.alive = true;
		this.start();
	};
	
	return o;
}