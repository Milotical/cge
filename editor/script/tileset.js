/**
 * tileset.js
 * @version 1.0
 */
var cge_tileSelectioStartX;
var cge_tileSelectioStartY;

var cge_tileSelectioEndX;
var cge_tileSelectioEndY;

var cge_tilesetTileWidth;
var cge_tilesetTileHeight;

var cge_tilesetTileCountX = -1;

var cge_tileSelection = false;

function cge_tilesetToggleGrid(){
	$("#cge_ProjectTileset").toggleClass("cge_tilesetWithGrid");
}

function cge_unbindTilesetEvents(){
	$("div.cge_tilesetActive span.cge_tilesetSelectTile").unbind('mousedown.tileSelection');
	$("div.cge_tilesetActive span.cge_tilesetSelectTile").unbind('mouseover.tileSelection');
	
	$("div.cge_tilesetSelectionIndicator").remove();
	
	cge_tileSelectioStartX = null;
	cge_tileSelectioStartY = null;
	cge_tileSelectioEndX = null;
	cge_tileSelectioEndY = null;
	cge_tilesetTileWidth = null;
	cge_tilesetTileHeight = null;
	cge_tileSelection = false;
	
	$(window).unbind('mouseup.tileSelection');
}

function cge_bindTilesetEvents(){
	cge_tilesetTileWidth = parseInt($("div.cge_tilesetActive span.cge_tilesizeX").text());
	cge_tilesetTileHeight = parseInt($("div.cge_tilesetActive span.cge_tilesizeY").text());
	cge_tilesetTileCountX = parseInt($("div.cge_tilesetActive span.cge_tilesetTileCountX").text());
	
	cge_tilesetStartX = null;
	cge_tilesetStartY = null;
	
	$(window).bind('mouseup.tileSelection', function(e){
		cge_stopTileSelection();
	});
	
	$("div.cge_tilesetActive span.cge_tilesetSelectTile").bind('mousedown.tileSelection', function(e){
		cge_startTileSelection(e.target);
	});
	
	$("div.cge_tilesetActive span.cge_tilesetSelectTile").bind('mouseover.tileSelection', function(e){
		cge_tileSelectionHoverTile(e.target);
	});
	
	$("span.cge_tilesetSelectTile").disableSelection();
	$("div.cge_tilesetContainerWrapper").disableSelection();
}

function cge_startTileSelection(obj){
	cge_tileSelection = true;
	
	var tileData = $(obj).children("span.cge_tilesetTileInfo").html();
	tileData = tileData.split(";");
	
	
	cge_tileSelectioStartX = tileData[0];
	cge_tileSelectioStartY = tileData[1];
	
	cge_tileSelectioEndX = tileData[0];
	cge_tileSelectioEndY = tileData[1];
	
	cge_tileSelectionRedraw();
}

function cge_tileSelectionHoverTile(obj){
	if(cge_tileSelection){
		var tileData = $(obj).children("span.cge_tilesetTileInfo").html();
		tileData = tileData.split(";");
		
		cge_tileSelectioEndX = tileData[0];
		cge_tileSelectioEndY = tileData[1];
		
		cge_tileSelectionRedraw();
	}
}

function cge_tileSelectionRedraw(){
	if($("div.cge_tilesetContainer div.cge_tilesetSelectionIndicator").length <= 0){
		$("div.cge_tilesetContainer").prepend('<div class="cge_tilesetSelectionIndicator"></div>');
	}
	
	var left = Math.min(cge_tileSelectioStartX, cge_tileSelectioEndX);
	var top = Math.min(cge_tileSelectioStartY, cge_tileSelectioEndY);
	
	var width = Math.max(cge_tileSelectioStartX, cge_tileSelectioEndX) - Math.min(cge_tileSelectioStartX, cge_tileSelectioEndX);
	var height = Math.max(cge_tileSelectioStartY, cge_tileSelectioEndY) - Math.min(cge_tileSelectioStartY, cge_tileSelectioEndY);
	
	$("div.cge_tilesetContainer div.cge_tilesetSelectionIndicator").css("left", (left*cge_tilesetTileWidth) + "px");
	$("div.cge_tilesetContainer div.cge_tilesetSelectionIndicator").css("top", (top*cge_tilesetTileHeight) + "px");
	
	$("div.cge_tilesetContainer div.cge_tilesetSelectionIndicator").width((width*cge_tilesetTileWidth + cge_tilesetTileWidth - 2) + "px");
	$("div.cge_tilesetContainer div.cge_tilesetSelectionIndicator").height((height*cge_tilesetTileHeight + cge_tilesetTileHeight - 2) + "px");

	$("div.cge_MapSelectionHelper").width((width*cge_tilesetTileWidth + cge_tilesetTileWidth - 2) + "px");
	$("div.cge_MapSelectionHelper").height((height*cge_tilesetTileHeight + cge_tilesetTileHeight - 2) + "px");
	
	$("div.cge_tilesetSelectionIndicator").click(function(){
		cge_tileSelectioStartX = null;
		cge_tileSelectioStartY = null;

		cge_tileSelectioEndX = null;
		cge_tileSelectioEndY = null;
		
		$(this).remove();
	});
	
	$(".cge_MapSelectionHelperPreview").css("background-position", cge_getBGOffsetX(0) + "px " + cge_getBGOffsetY(0) + "px");
}

function cge_stopTileSelection(){
	cge_tileSelection = false;
}

function cge_changeSelectedTileset(pNewTileset){
	if($("#cge_tilesetContainer_" + pNewTileset).length > 0){
		cge_unbindTilesetEvents();
		$("div.cge_tilesetActive").removeClass("cge_tilesetActive");
		$("#cge_tilesetContainer_" + pNewTileset).addClass("cge_tilesetActive");
		cge_checkWindowOverlap('cge_ProjectTileset');
		
		cge_bindTilesetEvents();
	}else{
		cge_setLoading(true);
		
		$.get("ajax/loadTileset.php", {t: pNewTileset}, function(data){
			cge_setLoading(false);			
			cge_unbindTilesetEvents();
			$("div.cge_tilesetActive").removeClass("cge_tilesetActive");
			$("#cge_ProjectTileset div.cge_EditorWindowContent").append(data);
			cge_checkWindowOverlap('cge_ProjectTileset');
			
			$("div.cge_MapSelectionHelper").width("0");
			$("div.cge_MapSelectionHelper").height("0");

			
			cge_bindTilesetEvents();
		});
	}
}

function cge_editActiveTileset(){
	var tilesetName = $("div.cge_tilesetActive").children(".cge_tilesetId").text();
	
	cge_loadWinodw("cge_editTileset", [tilesetName, "blah"]);
}

function cge_getTilesetSelectionWidth(){
	var offset = cge_getTilesetSelectionStartX();
	var start = offset;
	var end = offset + (parseInt($("div.cge_tilesetContainer div.cge_tilesetSelectionIndicator").width()) + 2)/cge_tilesetTileWidth
	return end - start;
}

function cge_getTilesetSelectionHeight(){
	var offset = cge_getTilesetSelectionStartY();
	var start = offset;
	var end = offset + (parseInt($("div.cge_tilesetContainer div.cge_tilesetSelectionIndicator").height()) + 2)/cge_tilesetTileHeight;
	return end - start;
}

function cge_getTilesetSelectionStartX(){
	return parseInt($("div.cge_tilesetContainer div.cge_tilesetSelectionIndicator").css("left"))/cge_tilesetTileWidth;
}

function cge_getTilesetSelectionStartY(){
	return parseInt($("div.cge_tilesetContainer div.cge_tilesetSelectionIndicator").css("top"))/cge_tilesetTileHeight;
}

function cge_getBGOffsetX(pOffset){
	return - (parseInt(cge_getTilesetSelectionStartX()) + parseInt(pOffset)) * cge_tilesetTileWidth;
}

function cge_getBGOffsetY(pOffset){
	return - (parseInt(cge_getTilesetSelectionStartY()) + parseInt(pOffset)) * cge_tilesetTileHeight;
}

function cge_TileIdToX(pTileId, pTileWidth, pTileHeight){
	return pTileId - (cge_TileIdToY(pTileId, pTileWidth) * pTileWidth);
}

function cge_TileIdToY(pTileId, pTileWidth){
	return Math.floor(pTileId / pTileWidth);
}