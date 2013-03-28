/* ======================================
			CGE SCENE DATA
			----------------------------------------------------------
			manages all scenes
			a change to another scene means changeing the content of this object
====================================== */ 

// -----------------------------------------------------------------------------------
// creates and returns scene_data object
// -----------------------------------------------------------------------------------
function CGE_Scene_Data(main_object){
	this.alive = false;												// if set false the end() function will be automatically called an a new scene will be loaded (initilally false to get first scene from server)		
	this.new_scene_id = 1;									// identifier of the new scene (is sent to the server to get scene data)
	this.main = main_object;								// assiciation to the main object
	this.scene_id;													// id of current scene
	this.images = [];												// list of image ids
	
	// template functions
	// (set from the server if new scene is loaded)
	this.start = function(){ };						// template start-function
	this.update = function(){ };				// template start-function
	this.end = function(){ };						// template start-function

}

// -----------------------------------------------------------------------------------
// called to get new scene_data from the server
// -----------------------------------------------------------------------------------
CGE_Scene_Data.prototype.order_new_scene_data = function(){
	this.main.input_controller.refresh();
	this.main.trigger_data.remove_all_scene_events(); // remove all events related to curent scene
	this.delete_all_images();
	this.scene_id = this.new_scene_id;
	this.start = function(){ };						// template start-function
	this.update = function(){ };				// template start-function
	this.end = function(){ };						// template start-function
	this.images = [];
	var canv = $('#'+this.main.html_id+'_canvas');
	this.ctx = canv[0].getContext('2d');
	
	// AJAX holt sich neue scene_start, scene_update und scene_end function (und gegebenenfalls verwendete Funktionen) und scene_data
	if(this.new_scene_id == "map"){
		if(this.main.map_data.initialised){
			this.main.map_data.reload();
		}else{
			this.main.map_data.load_new_map(this.main.start_map_id);
		}
		
		this.start = function(){
			event_data = {"id" : 10, "parallel" : true, "chara" : 0};
			event_data["conditions"] = [];
			event_data["trigger"] = "start_scene";
			event_data["effects"] = [["set_mouse_display",true]];
			this.add_event(event_data);
			
			this.main.trigger_data.update("start_scene");
		};
	
		this.update = function(){
			this.main.sprites_data.update();
			this.main.sprites_data.draw_images(this.ctx, null, -1);
			this.main.map_data.draw_tiled_map(this.ctx);
			this.main.sprites_data.draw_images(this.ctx, this.main.map_data.layers.length);
		};
	
		this.end = function(){
			this.main.scroll_x = 0;
			this.main.scroll_y = 0;
			this.main.trigger_data.update("end_scene");
			this.main.map_data.unload();
		};
		
	}
	if(this.new_scene_id == "title"){
		this.start = function(){
			var img = {"id" : "OO", "source" : "Omel.png", "width" : 215, "height" : 222, "x" : 500, "y" : 0, "z" : 1};
			this.add_image(img);
			
			/*var img = {"id" : "k", "source" : "knubel.png", "width" : 35, "height" : 34, "x" : 0, "y" : 0, "z" : 0};
			this.add_image(img);
			*/
			var img = {"id" : "cursor", "source" : "mouse.png", "width" : 32, "height" : 24, "x" : 0, "y" : 0, "z" : 100};
			this.add_image(img);
			
			var event_data = {"id" : 11, "parallel" : false, "chara" : 0};
			event_data["conditions"] = [];
			event_data["trigger"] = "keynewpress_49";
			event_data["effects"] = [["change_scene","map"]];
			this.add_event(event_data);
			
			event_data = {"id" : 9, "parallel" : true, "chara" : 0};
			event_data["conditions"] = [];
			event_data["trigger"] = "keynewpress_13";
			event_data["effects"] = [["save_game"], ["kill_game"]];
			this.add_event(event_data);
			
			event_data = {"id" : 10, "parallel" : true, "chara" : 0};
			event_data["conditions"] = [];
			event_data["trigger"] = "auto";
			event_data["effects"] = [["set_mouse_display",false],["erase"]];
			this.add_event(event_data);
			
			event_data = {"id" : 12, "parallel" : true, "chara" : "cursor"};
			event_data["conditions"] = [];
			event_data["trigger"] = "auto";
			event_data["effects"] = [["teleport",-1, function(m, x){ return m.input_controller.mouse_x; }, function(m, y){ return m.input_controller.mouse_y; } ]];
			this.add_event(event_data);
			
			/*var img = new CGE_Text("t", "Das ist ein Test", this.main.sprites_data, 100, 100, 50, 50, 20,"icons.png", 4, 3, 88, 66);
			this.main.sprites_data.add_image(img);
			this.images.push(img.id);*/
			/*var img = new CGE_Text("t2", "Ein [i]Testtext [s=30]zum[/s] [b]ausprobieren[/i] [c=0,0,255]der verschiedenen[/b] Formartierungsmöglichkeiten[/c] und [u=5]Zeilenumbrüchen.[/u] Auch Icons funktionieren hoffentlich noch: [s=15][p=1][p=2][p=0][/s]", this.main.sprites_data, 200, null, 10, 50, 20,"icons.png", 4, 3, 88, 66);
			img.size = 12;
			img.color = "red";
			this.main.sprites_data.add_image(img);
			this.images.push(img.id);
			
			var img = new CGE_Speech_Bubble("t4", "Hallo, /n Ich bin ein dicker Drache mit großem Hunger!", this.main.sprites_data, 200, 100, 200, 550, 70,100, 300, 20,"icons.png", 4, 3, 88, 66);
			img.size = 12;
			img.color = "blue";
			img.status_img_id = "k";
			this.main.sprites_data.add_image(img);
			this.images.push(img.id);
			
			var img = new CGE_Text("t3", "Ein kleiner Testtext in eigenem Font, /n 13 + 17 = 30 oder?/n Wie siehts mit Umlauten aus: Ä Ö Ü ä ö ü ß", this.main.sprites_data, 300, null, 200, 50, 20,"icons.png", 4, 3, 88, 66,"testfont.png",16,16, 352, 352);
			img.size = 22;
			this.main.sprites_data.add_image(img);
			this.images.push(img.id);*/
			
			/*/var img = new CGE_Window("w", this.main.sprites_data, 220, 400, 0, 10, 10, "Testskin.png", 96, 96);
			//this.main.sprites_data.add_image(img);
			//this.images.push(img.id);
			*/
			/*
			var img = new CGE_Window_Select("ws", this.main.sprites_data, 200, 400, 10, 10, 10, "Testskin.png", 96, 96, "cursor_rect.png", 35, 34, [[0,0,0],[0,50,0]], [[100,100],[200,100]]);
			this.main.sprites_data.add_image(img);
			this.images.push(img.id);
			*/
			var list = [["Element0","Element1", "Element2", "Element3"], ["Element4", "Element5", "Element6", "Element7"], ["Element8", "Element9", "a[p=1,2]", "Element11"]];
			var img = new CGE_Window_List("wl" ,list ,[2,2] ,this.main.sprites_data, 400, 400, 10, 10, 10, "Testskin.png", 96, 96, "cursor_rect.png", 35, 34, [5,5], 150, 30, [10,20], [20,30],"scroll_buttons.png",64,64, "icons.png", 4, 3, 88, 66);
			this.main.sprites_data.add_image(img);
			this.images.push(img.id);
			
			this.main.trigger_data.update("start_scene");
		};
		
		this.update = function(){
			this.main.sprites_data.update();
			this.main.sprites_data.draw_images(this.ctx);
		};
		
		this.end = function(){
			
		};
	}
	// ...................		
	
	this.alive = true; 			// set alive
	this.start();					// starts itself
}

CGE_Scene_Data.prototype.delete_all_images = function(){
	for(var i in this.images){
		this.main.sprites_data.remove_image_id(this.images[i]);
	}
}

CGE_Scene_Data.prototype.add_image = function(image_data){
	var img = new CGE_Image(image_data["id"], this.main.sprites_data, image_data["source"], image_data["width"], image_data["height"], image_data["x"], image_data["y"], image_data["z"]);
	this.main.sprites_data.add_image(img);
	this.images.push(img.id);
}

CGE_Scene_Data.prototype.add_event = function(event_data){
	var event = new CGE_Event(event_data["id"], this.main.event_interpreter, event_data["effects"], event_data["conditions"], event_data["parallel"], event_data["chara"]);
	this.main.trigger_data.add_scene_event(event_data["trigger"], event);
}