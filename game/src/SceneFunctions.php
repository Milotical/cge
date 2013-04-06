<?php
	$cge_default = array( "windowskin" =>  "res/style/Testskin.png", "window_cursor" => "res/style/cursor_rect.png", "scroll_image" => "res/style/scroll_buttons.png", "icons" => "res/style/icons.png", "icon_rows" => 3, "icon_cols" => 4, "custom_font" => "res/style/testfont.png", "custom_font_cols" => 16, "custom_font_rows" => 16);
	
	function executeScene(){
		echo "scene.start = function(){";
		startScene();
		echo '    this.main.trigger_data.update("start_scene");';
		echo "};";
		
		echo "scene.update = function(){";
		updateScene();
		echo "};";
		
		echo "scene.end = function(){";
		echo '    this.main.trigger_data.update("end_scene");';
		endScene();
		echo "};";
	}
	
	function executeMap(){
		echo 'map_data.start_map = function(){';
		startMap();
		echo '    this.main.trigger_data.update("start_map");';
		echo '}';
	}
	
	function standardUpdate(){
		echo "    this.main.sprites_data.update();";
		echo "    this.main.sprites_data.draw_images(this.ctx);";
	}
	
	function standardEnd(){
	
	}
	
	function loadMap(){
		echo '    if(this.main.map_data.initialised){';
		echo '    	    this.main.map_data.reload();';
		echo '    }else{';
		echo '    	    this.main.map_data.load_new_map(this.main.start_map_id);';
		echo '    }';
	}
	
	function unloadMap(){
		echo '    this.main.map_data.unload();';
	}
	
	function mapUpdate(){
		echo '    if(this.main.map_data.initialised){';
		echo '        this.main.sprites_data.update();';
		echo '        this.main.sprites_data.draw_images(this.ctx, null, -1);';
		echo '        this.main.map_data.draw_tiled_map(this.ctx);';
		echo '        this.main.sprites_data.draw_images(this.ctx, this.main.map_data.layers.length);';
		echo '    }';
	}
	
	function mapEnd(){
		echo '    this.main.scroll_x = 0;';
		echo '    this.main.scroll_y = 0;';
		echo '    this.main.trigger_data.update("end_scene");';
		unloadMap();
	}
	
	function addImage($id, $source, $x, $y, $z){
			if(file_exists("../".$source)){
				list($w, $h) = getimagesize("../".$source);
				echo 'var img = {"id" : "'.$id.'", "source" : "'.$source.'", "width" : '.$w.', "height" : '.$h.', "x" : '.$x.', "y" : '.$y.', "z" : '.$z.'};';
				echo 'this.add_image(img);';
			}else if(file_exists("../res/img/missing_image.png")){
				list($w, $h) = getimagesize("../res/img/missing_image.png");
				echo 'var img = {"id" : "'.$id.'", "source" : "res/img/missing_image.png", "width" : '.$w.', "height" : '.$h.', "x" : '.$x.', "y" : '.$y.', "z" : '.$z.'};';
				echo 'this.add_image(img);';
			}else{
				echo 'alert("File not found: '.$source.'")';
			}
	}
	
	function addChara($id, $source, $x, $y, $z, $facing=2, $moves="[]", $blocking_classes='["std"]', $rows = 4, $cols = 4){
		if(file_exists("../".$source)){
			list($w, $h) = getimagesize("../".$source);
			echo 'var img = {"id" : "'.$id.'", "source" : "'.$source.'", "width" : '.$w.', "height" : '.$h.', "x" : '.$x.', "y" : '.$y.', "z" : '.$z.', "face" : '.$facing.', "rows" : '.$rows.', "cols" : '.$cols.', "moves" : '.$moves.', "blocking_classes" : '.$blocking_classes.'};';
			echo 'this.add_chara(img);';
		}else if(file_exists("../res/img/missing_chara.png")){
			list($w, $h) = getimagesize("../res/chara/missing_chara.png");
			echo 'var img = {"id" : "'.$id.'", "source" : "res/chara/missing_chara.png", "width" : '.$w.', "height" : '.$h.', "x" : '.$x.', "y" : '.$y.', "z" : '.$z.', "face" : '.$facing.', "rows" : '.$rows.', "cols" : '.$cols.', "moves" : '.$moves.', "blocking_classes" : '.$blocking_classes.'};';
			echo 'this.add_chara(img);';
		}else{
			echo 'alert("File not found: '.$source.'")';
		}
	}
	
	function addListWindow($id, $elements, $max_elements, $width, $height, $x, $y, $z, $element_width, $element_height, $spacing="[10,10]", $border="[20,20]", $cursor_offset="[5,5]", $use_custom_font=false){
		global $cge_default;
		$windowskin = $cge_default["windowskin"];
		list($width_image, $height_image) = getimagesize("../".$windowskin);
		$cursor_image =  $cge_default["window_cursor"];
		list($cursor_width, $cursor_height) = getimagesize("../".$cursor_image);
		$scroll_image =  $cge_default["scroll_image"];
		list($scroll_width, $scroll_height) = getimagesize("../".$scroll_image);
		$icons = $cge_default["icons"];
		list($width_icons, $height_icons) = getimagesize("../".$icons);
		$icon_rows = $cge_default["icon_rows"];
		$icon_cols = $cge_default["icon_cols"];
		if($use_custom_font){
			$font_image = $cge_default["custom_font"];
			list($font_width, $font_height) = getimagesize("../".$font_image);
			$font_image = '"'.$font_image.'"';
			$font_cols = $cge_default["custom_font_cols"];
			$font_rows = $cge_default["custom_font_rows"];
		}else{
			$font_image = "null";
			$font_width = "null";
			$font_height = "null";
			$font_cols = "null";
			$font_rows = "null";
		}
		echo 'var img = new CGE_Window_List("'.$id.'", '.$elements.', '.$max_elements.',this.main.sprites_data, '.$width.', '.$height.', '.$x.', '.$y.', '.$z.', "'.$windowskin.'", '.$width_image.', '.$height_image.', "'.$cursor_image.'", '.$cursor_width.', '.$cursor_height.', '.$cursor_offset.', '.$element_width.', '.$element_height.', '.$spacing.', '.$border.', "'.$scroll_image.'", '.$scroll_width.', '.$scroll_height.', "'.$icons.'", '.$icon_cols.', '.$icon_rows.', '.$width_icons.', '.$height_icons.', '.$font_image.', '.$font_cols.', '.$font_rows.', '.$font_width.', '.$font_height.');';
		echo 'this.main.sprites_data.add_image(img);';
		echo 'this.images.push(img.id);';
	}
	
	function addEvent($id,$trigger ,$effects ,$conditions="[]",$related_img_id=0, $parallel = "false"){
		echo 'event_data = {"id" : "'.$id.'", "parallel" : '.$parallel.', "chara" : "'.$related_img_id.'"};';
		echo 'event_data["conditions"] = '.$conditions.';';
		echo 'event_data["trigger"] = "'.$trigger.'";';
		echo 'event_data["effects"] = '.$effects.';';
		echo 'this.add_event(event_data);';
	}
	
	function addTriggerKey($key){
		echo 'this.main.input_controller.add_trigger_key('.$key.');';
	}
	
	function speakEffect($chara_id, $texts,$dx=-100, $dy=-150, $dx0=10, $dy0=1, $z=5, $freeze = true ,$action_key=13, $distance_killer=50,$id=null, $width=200, $height=100, $radius=20, $distance_event="player", $letter_duration = 5, $use_custom_font=false){
		if($id == null)
			$id = $chara_id."_speech_bubble";
		global $cge_default;
		$r = '';
		$icons = $cge_default["icons"];
		list($width_icons, $height_icons) = getimagesize("../".$icons);
		$icon_rows = $cge_default["icon_rows"];
		$icon_cols = $cge_default["icon_cols"];
		if($use_custom_font){
			$font_image = $cge_default["custom_font"];
			list($font_width, $font_height) = getimagesize("../".$font_image);
			$font_image = '"'.$font_image.'"';
			$font_cols = $cge_default["custom_font_cols"];
			$font_rows = $cge_default["custom_font_rows"];
		}else{
			$font_image = "null";
			$font_width = "null";
			$font_height = "null";
			$font_cols = "null";
			$font_rows = "null";
		}
		if($freeze){
			$r = $r.'["map_variable","frozen" ,function(){ return true;}], ';
		}
		$r = $r.'["speak","'.$id.'",'.$texts.', "'.$chara_id.'", '.$dx.', '.$dy.', '.$dx0.', '.$dy0.', '.$z.', '.$radius.', '.$width.', '.$height.', '.$letter_duration.', "'.$icons.'", '.$icon_cols.', '.$icon_rows.', '.$width_icons.', '.$height_icons.', '.$font_image.', '.$font_cols.', '.$font_rows.', '.$font_width.', '.$font_height.', '.$action_key.', '.$distance_killer.', "'.$distance_event.'"]';
		return $r;
	}
	
	function choiceEffect($chara_id, $text, $choices, $dx=-100, $dy=-150, $dx0=10, $dy0=1, $z=5, $freeze = true ,$variable='["chara", -1, "decision", function(r){ return r;}]', $action_key=13, $change_keys='[38,40]', $special_keys='[]' ,$distance_killer=50 ,$distance_choice='null', $distance_choice='null' ,$id=null, $width=200, $height=100, $radius=20, $distance_event="player", $letter_duration = 5, $choices_borders='[40,30]', $choices_spacing='15' ,$use_custom_font=false, $cursor_source='res/style/cursor.png', $cursor_offsets = '[-18, 10]'){
		if($id == null)
			$id = $chara_id."_speech_bubble";
		global $cge_default;
		$r = '';
		$icons = $cge_default["icons"];
		list($width_icons, $height_icons) = getimagesize("../".$icons);
		$icon_rows = $cge_default["icon_rows"];
		$icon_cols = $cge_default["icon_cols"];
		if($use_custom_font){
			$font_image = $cge_default["custom_font"];
			list($font_width, $font_height) = getimagesize("../".$font_image);
			$font_image = '"'.$font_image.'"';
			$font_cols = $cge_default["custom_font_cols"];
			$font_rows = $cge_default["custom_font_rows"];
		}else{
			$font_image = "null";
			$font_width = "null";
			$font_height = "null";
			$font_cols = "null";
			$font_rows = "null";
		}
		list($cursor_width, $cursor_height) = getimagesize("../".$cursor_source);
		if($freeze){
			$r = $r.'["map_variable","frozen" ,function(){ return true;}], ';
		}
		$r = $r.'["choice","'.$id.'","'.$text.'", "'.$chara_id.'", '.$dx.', '.$dy.', '.$dx0.', '.$dy0.', '.$z.', '.$radius.', '.$width.', '.$height.', '.$letter_duration.', "'.$icons.'", '.$icon_cols.', '.$icon_rows.', '.$width_icons.', '.$height_icons.', '.$font_image.', '.$font_cols.', '.$font_rows.', '.$font_width.', '.$font_height.', '.$action_key.','.$choices.','.$choices_borders.','.$choices_spacing.',"'.$cursor_source.'",'.$cursor_width.','.$cursor_height.','.$cursor_offsets.','.$change_keys.','.$special_keys.','.$variable.', '.$distance_killer.', "'.$distance_event.'",'.$distance_choice.']';
		return $r;
	}
?>