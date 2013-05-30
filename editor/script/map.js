/**
 * map.js
 * @version 1.0
 */
var cge_LoadedLayerId = -1;
var cge_LoadedMap = "";
var cge_MapEditing = false;
var cge_MapEditorLastHovered = -1;

var cge_LoadedMapWidth = -1;
var cge_LoadedMapHeight = -1;


/**
 * Toggle a folder in the map list window.
 * @param pId id of the folder to toggle
 */
function cge_EditorMapListToggle(pId){
	$("#cge_mapList" + pId).children().filter(":not(span)").toggle();
}

/**
 * Open the window for a new map layer.
 */
function cge_MapNewLayer(){
	if(cge_LoadedMap != ""){
		cge_loadWinodw("cge_MapNewLayer", null);
		$("#cge_newLayerName").val("");
	}else{
		cge_pushError("You need to load a map to create a new layer.");
	}
}

/**
 * Toggles the grid of tha map editor.
 */
function cge_MapToggleGrid(){
	$("#cge_editorMapWrapper").toggleClass("cge_DisplayMapGrid");
	$(".cge_NavViewMapGrid").toggleClass("cge_checkmark");
}

/**
 * Creates the Markup of a new map layer and place it in the map edtior.
 */
function cge_MapNewLayerCreate(){	
	var newIdNr = $("div.cge_MapLayerActiveWrapper div.cge_MapLayerRow").length;
	
	//Copy the top mapLayer
	cge_EditorCopyMapLayer(parseInt(newIdNr) - 1);
	
	//Fill layer empty
	cge_MapEditorFillLayerTiles(newIdNr, -1, -1);
	
	//Setup the layerWindow and it's functionality
	var layerName = $("#cge_newLayerName").val();
	var templateHTML = $("#cge_MapNewLayer .cge_EditorData").html();
	templateHTML = templateHTML.replace("CGE_LAYER_TEMPLATE_NAME", layerName);
	templateHTML = templateHTML.replace("CGE_MAP_TEMPLATE_NAME", cge_LoadedMap);
	templateHTML = templateHTML.replace("CGE_LAYER_TEMPLATE_KEY", newIdNr);
	$("div.cge_MapLayerActiveWrapper").prepend(templateHTML);
	
	cge_MapRebindLayerClick(newIdNr);
	
	cge_pushLog("Added layer \"" + layerName + "\" as " + newIdNr + ".");
	
	cge_closeWindow('cge_MapNewLayer');
}

function cge_EditorCopyMapLayer(pLayerId){
	var newIdNr = $("div.cge_MapLayerActiveWrapper div.cge_MapLayerRow").length;
	var copyMapLayer = $("<div>").append($("#" + cge_LoadedMap + "_Layer" + pLayerId).clone()).html();
	
	var searchStr = "_Layer" + pLayerId;
	var regEx = new RegExp(searchStr, 'g');
	
	copyMapLayer = copyMapLayer.replace(regEx, "_Layer" + parseInt(newIdNr));
	$("#" + cge_LoadedMap + "_Layer" + (parseInt(newIdNr) - 1)).after(copyMapLayer);
}

/**
 * Load a map into the map editor.
 * @param pMapId the id of the map to load
 */
function cge_EditorLoadMap(pMapId){
	cge_setLoading(true);
	$.get("ajax/map.php", {id: pMapId}, function(data){
		//Remove the currently loaded map
		$("div.cge_MapLoaded").remove();
		
		cge_setLoading(false);
		
		//Update the mapId
		cge_LoadedMap = pMapId;
		
		//Add the maps markup to the dom
		$("#cge_editorMapWrapper").append(data);
		
		$("#cge_editorMapWrapper").disableSelection();
		$("#cge_editorMapWrapper").children().disableSelection();
		
		cge_EditorLoadMapLayer();
		
		cge_pushLog("Loading map " + pMapId + ".");
				
		cge_LoadedMapWidth = $("#" + pMapId + "_Map").children("span.cge_mapWidth").text(); 
		cge_LoadedMapHeight = $("#" + pMapId + "_Map").children("span.cge_mapHeight").text(); 
		
		var cge_MapTileset = $("#" + pMapId + "_Map").children("span.cge_mapTileset").text(); 
		
		cge_changeSelectedTileset(cge_MapTileset);
		
		cge_pushLog("Width: " + cge_LoadedMapWidth + ".");
		cge_pushLog("Height: " + cge_LoadedMapHeight + ".");
		
		document.title = $("#" + pMapId + "_Map").children("span.cge_mapName").text() + " - " + cge_EditorTitle;
	});
}

/**
 * Load the layer functionality and cut the markup it into the layer window.
 */
function cge_EditorLoadMapLayer(){
	$("#cge_MapLayer div.cge_MapLayerActiveWrapper").hide();
	$("#cge_MapLayer div.cge_MapLayerActiveWrapper").remove();
	$("#cge_editorMapWrapper div.cge_MapLayerInfo").appendTo("#cge_MapLayer div.cge_EditorWindowContent");
	
	cge_LoadedLayerId = -1;
	
	$(".cge_MapLayerActiveWrapper").children(".cge_MapLayerRow").each(function(){
		var layerId = parseInt($(this).children("span.cge_layerId").text());
		
		cge_MapRebindLayerClick(layerId);
	});
}

/**
 * Toggle a map layer in the editor.
 * @param pLayerId id of the layer to be edited
 * @param pMapId id of the loaded map
 */
function cge_EditorToggleLayer(pLayerId, pMapId){
	var control = $("#" + pMapId + "_Layer" + pLayerId + "_LayerRow a:first");
	
	if(control.hasClass("cge_layer")){
		control.removeClass("cge_layer");
		$("#" + pMapId + "_Layer" + pLayerId).hide();
	}else{
		control.addClass("cge_layer");
		$("#" + pMapId + "_Layer" + pLayerId).show();
	}
}


/**
 * Select a map layer
 * @param pLayerId id of the selected layer
 * @param pMapId id of the loaded map
 */
function cge_EditorSelectLayer(pLayerId, pMapId){
	cge_LoadedLayerId = pLayerId;
	
	$("div.cge_MapLayerActiveWrapper div.cge_MapLayerActiveIndicator").removeClass("cge_MapLayerActiveIndicator");
	
	$("#" + pMapId + "_Layer" + pLayerId + "_LayerRow").addClass("cge_MapLayerActiveIndicator");
	
	cge_pushLog("Selected layer: " + pLayerId);
}

/**
 * Hover a tile in the map editor
 * @param pTileId id of the hovered tile
 */
function cge_MapEditorHoverTile(pTileId){
	cge_MapEditorLastHovered = pTileId;
	cge_MapEditorEditTile(pTileId);
	
	var helperLeft = cge_TileIdToX(pTileId, cge_LoadedMapWidth, cge_LoadedMapHeight) * cge_tilesetTileWidth - 1;
	var helperTop = cge_TileIdToY(pTileId, cge_LoadedMapWidth) * cge_tilesetTileHeight - 1;
	
	$("div.cge_MapSelectionHelper").css("left", helperLeft + "px");
	$("div.cge_MapSelectionHelper").css("top", helperTop + "px");
}

/**
 * Change the data of a given tile.
 * @param pTileId id of the tile that shall be changed
 */
function cge_MapEditorEditTile(pTileId){
	if(cge_MapEditing && cge_LoadedLayerId >= 0){
		var tilesetX = cge_getTilesetSelectionWidth();
		var tilesetY = cge_getTilesetSelectionHeight();
		
		if(tilesetX == 1 && tilesetY == 1){
			var editedTile = $("#" + cge_LoadedMap + "_Layer" + cge_LoadedLayerId + "_Tile" + pTileId);
			editedTile.css("background-position", cge_getBGOffsetX(0) + "px " + cge_getBGOffsetY(0) + "px");
		}else{
			for(var y = 0; y < tilesetY; y++){
				for(var x = 0; x < tilesetX; x++){
					var editedTile = $("#" + cge_LoadedMap + "_Layer" + cge_LoadedLayerId + "_Tile" + (pTileId + x + (cge_LoadedMapWidth*y)));
					editedTile.css("background-position", cge_getBGOffsetX(x) + "px " + cge_getBGOffsetY(y) + "px");
				}
			}
		}
	}else if(cge_LoadedLayerId <= 0  && cge_MapEditing){
		cge_pushError("You need to select a layer first in order to edit.");
	}
}

/**
 * Fill all tiles of a given layer.
 * @param pLayerId id of the layer that shall be filled
 * @param pOffsetX x-offset of the tile that shall be painted
 * @param pOffsetY y-offset of the tile that shall be painted
 */
function cge_MapEditorFillLayerTiles(pLayerId, pOffsetX, pOffsetY){
	$("#" + cge_LoadedMap + "_Layer" + pLayerId + " div.cge_MapTile").each(function(){
		$(this).css("background-position", -(parseInt(pOffsetX * cge_tilesetTileWidth)) + "px " + -(parseInt(pOffsetY * cge_tilesetTileHeight)) + "px");
	});
}

/**
 * Start editing tiles in the map editor for the selected layer and loaded map.
 * Should be fired onmousedown.
 */
function cge_EditorStartMapEditing(){
	cge_MapEditing = true;
	cge_pushLog("cge_MapEditing: " + cge_MapEditing + ".");
	
	cge_MapEditorEditTile(cge_MapEditorLastHovered);
	
	$(window).bind('mouseup.mapEditing', function(e){
		cge_EditorStopMapEditing();
	});
}

/**
 * Stop the editing of tiles.
 * Should be fired onmouseup.
 */
function cge_EditorStopMapEditing(){
	$(window).unbind('mouseup.mapEditing');
	cge_MapEditing = false;
	
	cge_pushLog("cge_MapEditing: " + cge_MapEditing + ".");
}

/**
 * Toggles the visibility of the selection helper (in the map editor).
 * @param pVisibility 
 */
function cge_MapToggleSelectionHelper(pVisibility){
	if(pVisibility && $("div.cge_MapSelectionHelper").width() > 0){		
		$("div.cge_MapSelectionHelper").show();
	}else{
		$("div.cge_MapSelectionHelper").hide();
	}
}

/**
 * Unbinds and then rebinds the onclick events of a layer in the layer window.
 * This is necessary when shifting the id's and moving layer up and down.
 * @param pLayerId id of the layer
 */
function cge_MapRebindLayerClick(pLayerId){
	$("#" + cge_LoadedMap + "_Layer" + pLayerId + "_LayerRow a:first").unbind("click.visibility");
	$("#" + cge_LoadedMap + "_Layer" + pLayerId + "_LayerRow a.cge_MapLayerNameSelect").unbind("click.selection");
	
	$("#" + cge_LoadedMap + "_Layer" + pLayerId + "_LayerRow a:first").bind("click.visibility", function(){
		cge_EditorToggleLayer(pLayerId, cge_LoadedMap);
	});
	
	$("#" + cge_LoadedMap + "_Layer" + pLayerId + "_LayerRow a.cge_MapLayerNameSelect").bind("click.selection", function(){
		cge_EditorSelectLayer(pLayerId, cge_LoadedMap);
	});
}

/**
 * Rempas all the ids of the tiles within a layer to match the layers id.
 * Important when a layer is moved up or down.
 * @param pLayerId id of the layer that changed it's id
 */
function cge_remapLayerTileId(pLayerId){
	$("#" + cge_LoadedMap + "_Layer" + pLayerId + " div.cge_MapTile").each(function(i){
		$(this).attr("id", cge_LoadedMap + "_Layer" + pLayerId + "_Tile" + i);
	});
}

/**
 * Move a layer in it's order.
 * @param pMoveUp true to move up and false to move down
 */
function cge_MapMoveLayer(pMoveUp){
	if(cge_LoadedLayerId >= 0){
		var selectedLayer = $("#" + cge_LoadedMap + "_Layer" + cge_LoadedLayerId + "_LayerRow");
		var selectedMapLayer = $("#" + cge_LoadedMap + "_Layer" + cge_LoadedLayerId);
		if(pMoveUp){
			var relatedLayer = $("#" + cge_LoadedMap + "_Layer" + (parseInt(cge_LoadedLayerId) + 1) + "_LayerRow");
			var relatedMapLayer = $("#" + cge_LoadedMap + "_Layer" + (parseInt(cge_LoadedLayerId) + 1));
			
			if(relatedLayer.length > 0){
				selectedLayer.insertBefore(relatedLayer);
				selectedMapLayer.insertAfter(relatedMapLayer);
				
				relatedLayer.attr("id", cge_LoadedMap + "_Layer" + cge_LoadedLayerId + "_LayerRow");
				relatedMapLayer.attr("id", cge_LoadedMap + "_Layer" + cge_LoadedLayerId);
				cge_LoadedLayerId++;
				selectedLayer.attr("id", cge_LoadedMap + "_Layer" + cge_LoadedLayerId + "_LayerRow");
				selectedMapLayer.attr("id", cge_LoadedMap + "_Layer" + cge_LoadedLayerId);
				cge_MapRebindLayerClick(cge_LoadedLayerId-1);
				cge_MapRebindLayerClick(cge_LoadedLayerId);
				cge_remapLayerTileId(cge_LoadedLayerId-1);
				cge_remapLayerTileId(cge_LoadedLayerId);
			}
		}else{
			var relatedLayer = $("#" + cge_LoadedMap + "_Layer" + (parseInt(cge_LoadedLayerId) - 1) + "_LayerRow");
			var relatedMapLayer = $("#" + cge_LoadedMap + "_Layer" + (parseInt(cge_LoadedLayerId) - 1));
			
			if(relatedLayer.length > 0){
				selectedLayer.insertAfter(relatedLayer);
				selectedMapLayer.insertBefore(relatedMapLayer);
				
				relatedLayer.attr("id", cge_LoadedMap + "_Layer" + cge_LoadedLayerId + "_LayerRow");
				relatedMapLayer.attr("id", cge_LoadedMap + "_Layer" + cge_LoadedLayerId);
				cge_LoadedLayerId--;
				selectedLayer.attr("id", cge_LoadedMap + "_Layer" + cge_LoadedLayerId + "_LayerRow");
				selectedMapLayer.attr("id", cge_LoadedMap + "_Layer" + cge_LoadedLayerId);
				
				cge_MapRebindLayerClick(cge_LoadedLayerId+1);
				cge_MapRebindLayerClick(cge_LoadedLayerId);
				cge_remapLayerTileId(cge_LoadedLayerId+1);
				cge_remapLayerTileId(cge_LoadedLayerId);
			}
		}
		
		cge_pushLog("Selected layer: " + cge_LoadedLayerId);
		
	}else{
		cge_pushError("You need to select a layer in order to move it.");
	}
}