<?php
	$cge_default = array( "windowskin" =>  "res/style/Testskin.png", "window_cursor" => "res/style/cursor_rect.png", "scroll_image" => "res/style/scroll_buttons.png", "icons" => "res/style/icons.png", "icon_rows" => 3, "icon_cols" => 4, "custom_font" => "res/style/testfont.png", "custom_font_cols" => 16, "custom_font_rows" => 16);
	
	function executeScene(){
		echo "scene.start = function(){";
		startScene();
		echo "};";
		
		echo "scene.update = function(){";
		echo "    this.main.sprites_data.update();";
		echo "    this.main.sprites_data.draw_images(this.ctx);";
		echo "};";
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
	
?>