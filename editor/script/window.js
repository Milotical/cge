var cge_focusedWindowId = "";
var cge_focusedWindowZ = 5;

/**
 * Functions for windows used in the cge_Editor
 */
function cge_loadWinodw(pWindowName){
	if($("#" + pWindowName).length <= 0){
		cge_setLoading(true);
		$.get("ajax/getWindow.php", {w: pWindowName}, function(data){
			cge_setLoading(false);
			$("#cge_editorWindowWrapper").append(data);
			cge_enableWindowFunctions();
			cge_windowPushStack($("#" + pWindowName));
		});
	}else{
		cge_openWindow(pWindowName);
	}
}

function cge_enableWindowFunctions(){
	$("div.cge_EditorWindow").draggable({
		handle: "header",
		cancel: "div.cge_EditorWindowControlPane, div.cge_WindowMaximized header",
		start: function(e, u){
			cge_windowPushStack($(e.target));
		},
		containment: $("#cge_editorWindowWrapper"),
		snap: true,
		snapMode: "outer"
	});
	
	$("div.cge_EditorWindow").bind("click", function(e){
		cge_windowPushStack($(e.target).parents("div.cge_EditorWindow"));
	});
}

function cge_windowPushStack(pWindowObj){
	if(pWindowObj.attr("id") != cge_focusedWindowId){
		cge_focusedWindowId = pWindowObj.attr("id");
		cge_focusedWindowZ++;
		pWindowObj.css("z-index", cge_focusedWindowZ);
		
		$(".cge_alwaysOnTop").each(function(){
			$(this).css("z-index", parseInt($(this).css("z-index"))+1);
		});
	}
}

function cge_maximizeWindow(pWindowId){
	var currentWindow = $("#" + pWindowId);
	
	if(!currentWindow.hasClass("cge_WindowMaximized")){
		//Store css settings in windowSettings element
		currentWindow.children("div.cge_windowSettings").css("top", currentWindow.css("top"));
		currentWindow.children("div.cge_windowSettings").css("left", currentWindow.css("left"));
		currentWindow.children("div.cge_windowSettings").css("width", currentWindow.css("width"));
		currentWindow.children("div.cge_windowSettings").css("height", currentWindow.css("height"));
		
		//Set the maximized style
		currentWindow.css("top", 0);
		currentWindow.css("left", 0);
		currentWindow.width(($(window).width() - 2) + "px");
		currentWindow.height(($("#cge_editorWindowWrapper").height() - 2) + "px");
		currentWindow.addClass("cge_WindowMaximized");
	}else{
		//Restore style settings
		currentWindow.css("top", currentWindow.children("div.cge_windowSettings").css("top"));
		currentWindow.css("left", currentWindow.children("div.cge_windowSettings").css("left"));
		
		if(!currentWindow.hasClass("cge_WindowAutoSizeWidth")){
			currentWindow.width(currentWindow.children("div.cge_windowSettings").css("width"));
			
		}else{
			currentWindow.css("width", "auto");
		}
		
		if(!currentWindow.hasClass("cge_WindowAutoSizeHeight")){
			currentWindow.width(currentWindow.children("div.cge_windowSettings").css("height"));
			
		}else{
			currentWindow.css("height", "auto");
		}
		
		currentWindow.removeClass("cge_WindowMaximized");
		cge_checkWindowOverlap(pWindowId);
	}
}

function cge_closeWindow(pWindowId){
	$("#" + pWindowId).hide();
	cge_setWindowHandlerState(pWindowId, false);
}

function cge_openWindow(pWindowId){
	var currentWindow = $("#" + pWindowId);
	
	if(currentWindow.css("display") == "none"){
		currentWindow.show();
		cge_setWindowHandlerState(pWindowId, true);
		cge_windowPushStack($("#" + pWindowId));
	}else{
		cge_closeWindow(pWindowId);
	}
}

function cge_positionWindow(pWindowId, pAnchor, pMargin){
	if(pAnchor == 'center'){
		cge_centerWindow(pWindowId);
	}
	
	if(pAnchor == 'right'){
		$("#" + pWindowId).css("left", $("#cge_editorWindowWrapper").width() - $("#" + pWindowId).outerWidth(true) - pMargin + "px");
	}
}

function cge_centerWindow(pWindowId){
	cge_resizeWindowWrapper();
	
	var currentWindow = $("#" + pWindowId);

	currentWindow.css("left", $("#cge_editorWindowWrapper").width()/2 - currentWindow.width()/2 + "px");
	currentWindow.css("top", $("#cge_editorWindowWrapper").height()/2 - currentWindow.height()/2 + "px");
}

function cge_setWindowHandlerState(pWindowId, pState){
	if(pState){
		$("#cge_EditorWindowHandler_" + pWindowId).addClass("cge_checkmark");
	}else{
		$("#cge_EditorWindowHandler_" + pWindowId).removeClass("cge_checkmark");
	}
}

function cge_checkWindowOverlap(pWindowId){
	var currentWindow = $("#" + pWindowId);
	
	if(parseInt(currentWindow.outerWidth(true)) + parseInt(currentWindow.css("left")) > parseInt($(window).width())){
		cge_positionWindow(pWindowId, 'right', 5);
	}
	
	if(parseInt(currentWindow.outerHeight(true)) + parseInt(currentWindow.css("top")) +  parseInt($("#topBarWrapper").outerHeight(true)) > parseInt($(window).height())){
		currentWindow.css("top", parseInt($(window).height()) - parseInt(currentWindow.outerHeight(true)) - parseInt($("#topBarWrapper").outerHeight(true) + 5) + "px");
	}
}

function cge_resizeWindowWrapper(){
	$("#cge_editorWindowWrapper").width($(window).width() + "px");
	$("#cge_editorWindowWrapper").height(($(window).height() - 42) + "px");
	
	$("div.cge_WindowMaximized").width(($(window).width() - 2) + "px");
	$("div.cge_WindowMaximized").height(($("#cge_editorWindowWrapper").height() - 2) + "px");
	
	$("div.cge_EditorWindow").each(function(){
		cge_checkWindowOverlap($(this).attr("id"));
	});
}
