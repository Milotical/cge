<div id="cge_ResourceManagerBC">
	<?php 
	$firstBC = true;
	$i = 0;
	foreach($cge_ResManagerBC as $name => $link){
		$i++;
		if(!$firstBC){
			echo " > ";
		}else{
			$firstBC = false;
		}
		
		if($i == count($cge_ResManagerBC)){
		 	echo $name;
		}else{
		?>
		
			<a href="#" class="cge_ResourceManagerBCLink" onclick="cge_ResourceManagerOpen('<?php echo $link;?>'); return false;"><?php echo $name; ?></a>
		
		<?php 
		}
	}
	?>
</div>
<div id="cge_ResourceManagerPreviewWrapper">
	<div id="cge_ResourceManagerPreviewImageWrapper">
		<img src="theme/default/transparentBackground.png" title="<?php cge_print("Preview"); ?>" alt="<?php cge_print("Preview"); ?>" onclick="cge_ResourceManagerTogglePreviewZoom();" />
	</div>
</div>

<div id="cge_ResourceManagerContentWrapper">
	<div id="cge_ResourceManagerContent">
		<table id="cge_ResourceTable">
			<thead>
				<tr>
					<th colspan="2"><?php cge_print("Name"); ?></th>
					<th><?php cge_print("Type"); ?></th>
					<th><?php cge_print("Size"); ?></th>
					<th><?php cge_print("Last changed"); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php 
					if($cge_ResManagerGoUp){
				?>
					<tr onclick="cge_ResourceManagerUp();" title="<?php cge_print("Go up"); ?>">
						<td><a class="cge_icon cge_btn_icon cge_folder" title="New Layer" href="#" onclick="return false;"></a></td>
						<td colspan="4">..</td>
					</tr>
				<?php
					}
				?>
				<?php 
				foreach($fileList as $key => $file){
					$onclick = ' onclick="';
					if(Resource::GetFileTypeDescription($file) == "directory"){
						$onclick .= 'cge_ResourceManagerOpen(\'' . $cge_ScanRes . '/' . $file["name"] . '\');';
						$id = "cge_ResFile_" . cge_String::toId($file["name"]);
					}else{
						$onclick .= 'cge_ResourceManagerShowPreview(\'' . $cge_ScanRes . '/' . $file["name"] . '\', this.id);';
						$id = "cge_ResFile_" . cge_String::toId($file["pathinfo"]["dirname"] . "" . $file["name"]);
					}
					
					$onclick .= '"';
				?>
				<tr<?php echo $onclick; ?> id="<?php echo $id;?>">
					<td>
						<a class="cge_icon cge_btn_icon cge_<?php echo Resource::GetFileIcon($file);?>" href="#" onclick="return false;"></a>
					</td>
					<td><?php echo $file["name"]; ?></td>
					<td><?php echo Resource::GetFileTypeDescription($file); ?> <span class="cge_ResourceManagerExtension"><?php if(isset($file["pathinfo"]["extension"]) != "") echo $file["pathinfo"]["extension"]; ?></span></td>
					<td title="<?php echo $file["size"]*1024; ?> Byte"><?php echo number_format($file["size"], 2); ?> KB</td>
					<td><?php echo cge_String::getDate($file["changed"]); ?></td>
				</tr>
				<?php
				}	
				?>
			</tbody>
		</table>
	</div>
</div>

<div class="clear"></div>