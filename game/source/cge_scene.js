

function cge_create_scene(main_object){
	var o = new Object;
	o.alive = false;									
	o.new_scene_id = 0;
	o.main_object = main_object;
	
	o.start = function(){ };
	o.update = function(){ };
	o.end = function(){ };
	
	// order new scene from the server
	o.order_new_scene_data = function(){
		// AJAX holt sich neue scene_start, scene_update und scene_end function (und gegebenenfalls verwendete Funktionen) und scene_data
		var scene_data = [];
		scene_data["layers"] = [];
		scene_data["layers"][0] = [[9,9,9,9,9,9],[9,9,9,9,9,9],[9,9,9,9,9,9]];
		scene_data["layers"][1] = [[0,0,6,6,0,0],[0,0,7,0,0,7],[0,0,0,0,0,0]];
		scene_data["tileset_name"] = "Testset.png";
		scene_data["tileset_grid_size"] = 32;
		scene_data["tileset_zoom_factor"] = 1.0;
		scene_data["tileset_row_width"] = 8;
		scene_data["sprites"] = [];
		scene_data["sprites"][1] = [];
		this.sprites_data = cge_create_sprites_data();
		this.map_data = cge_create_map_data_object(scene_data, this.sprites_data);
		
		this.start = function(){
			this.test_image = this.new_image("Poyo.png",100,100,0,0,102);
			this.test_image2 = this.new_image("Poyo.png",100,100,50,50,101);
			this.test_image3 = this.new_image("Poyo.png",100,100,100,30,-1);
			this.test_image2.set_z(103);
			this.test_image4 = this.new_sprite("Poyo.png", 228, 940, 10, 2, 200, 200, 101);
			this.test_image5 = this.new_anim_sprite("Poyo.png", 228, 940, 10, 2, 200, 10, 101, [[0,3],[1,3]]);
			this.test_image5.repeat = true;
		};
		this.update = function(){
			var canv = $('#'+this.main_object.html_id+'_canvas');
			var ctx = canv[0].getContext('2d');
			ctx.clearRect ( 0 , 0 , this.main_object.resolution[0] , this.main_object.resolution[1] );
			this.sprites_data.update_images(ctx, null, -1);
			this.map_data.draw_tiled_map(ctx,0,0);
			this.sprites_data.update_images(ctx, this.map_data.layers.length-1);
		};
		this.end = function(){
			
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