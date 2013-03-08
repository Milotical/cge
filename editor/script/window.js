/**
 * Functions for windows used in the cge_Editor
 */
function cge_enableWindowFunctions(){
	$("div.cge_EditorWindow").draggable({
		handle: "header",
		cancel: "div.cge_EditorWindowControlPane, div.cge_WindowMaximized header",
		stack: "div.cge_EditorWindow",
		containment: $("#cge_editorWindowWrapper"),
		snap: true,
		snapMode: "outer"
	});
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
		currentWindow.width(currentWindow.children("div.cge_windowSettings").css("width"));
		currentWindow.height(currentWindow.children("div.cge_windowSettings").css("height"));

		currentWindow.removeClass("cge_WindowMaximized");
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
	}else{
		cge_closeWindow(pWindowId);
	}
}

function cge_setWindowHandlerState(pWindowId, pState){
	if(pState){
		$("#cge_EditorWindowHandler_" + pWindowId).addClass("cge_checkmark");
	}else{
		$("#cge_EditorWindowHandler_" + pWindowId).removeClass("cge_checkmark");
	}
}


function cge_resizeWindowWrapper(){
	$("#cge_editorWindowWrapper").width($(window).width() + "px");
	$("#cge_editorWindowWrapper").height(($(window).height() - 42) + "px");
	
	$("div.cge_WindowMaximized").width(($(window).width() - 2) + "px");
	$("div.cge_WindowMaximized").height(($("#cge_editorWindowWrapper").height() - 2) + "px");
}