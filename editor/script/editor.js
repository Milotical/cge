var cge_loading = 0;

$(document).ready(function(){
	cge_enableWindowFunctions();
	cge_resizeWindowWrapper();
	
//	cge_setLoading(true);
		
//	$("body").children().tooltip({
//		position: {
//			my: "center bottom",
//			at: "right top-5"
//		},
//		tooltipClass: "cge_Tooltip cge_alwaysOnTop",
//		show: {delay: 1000}
//	});
});

function cge_toggleFullscreen(){
	if(!document.mozFullScreen){
		var e = document.getElementById("editorBody");
		e.mozRequestFullScreen();
	}else{
		document.mozCancelFullScreen();
	}
}

$(window).resize(function(){
	cge_resizeWindowWrapper();
});

function cge_unloadProject(){
	cge_setLoading(true);
	$.get("ajax/unloadProject.php", function(data){
		if(data == ""){
			window.location.href = ".";
		}else{
			cge_pushLog(data);
		}
	});
}

function cge_pushLog(pMessage){
	//TODO: Implement this!
}

function cge_setLoading(pBool){
	if(pBool){
		cge_loading++;
	}else{
		cge_loading--;
	}

	var loadingWrapper = $("#cge_editorLoadingInidicatorWrapper");
	
	if(cge_isLoading()){
		loadingWrapper.show();
		loadingWrapper.animate({height: 10});
		cge_startLoadingAnimation();
	}else{
		loadingWrapper.animate({height: 0}, function(){
			loadingWrapper.hide();
			loadingWrapper.html("");
		});
	}
}

function cge_isLoading(){
	return (cge_loading > 0);
}

function cge_toggleContent(pContentId){
	if($("#cge_toggleContent_" + pContentId).css("display") == 'none'){
		$("#cge_toggleContent_" + pContentId).stop(true, true);
		$("#cge_toggleContent_" + pContentId).slideDown(500);
		$("#cge_toggleButton_" + pContentId).addClass("cge_arrowUp");
		$("#cge_toggleButton_" + pContentId).addClass("cge_ToggleButtonActive");
		$("#cge_toggleButton_" + pContentId).removeClass("cge_arrowDown");
	}else{
		$("#cge_toggleContent_" + pContentId).stop(true, true);
		$("#cge_toggleContent_" + pContentId).slideUp(500);
		$("#cge_toggleButton_" + pContentId).addClass("cge_arrowDown");
		$("#cge_toggleButton_" + pContentId).removeClass("cge_ToggleButtonActive");
		$("#cge_toggleButton_" + pContentId).removeClass("cge_arrowUp");
	}
	
	$("#cge_toggleButton_" + pContentId).blur();
}

function cge_startLoadingAnimation(){
	var loadingWrapper = $("#cge_editorLoadingInidicatorWrapper");
	loadingWrapper.html("");
	
	for(var i = 0; i < 5; i++){
		var id = "cge_loadingIndicator" + i;
		loadingWrapper.append('<div style="left: ' + (-100 + (i*15)) + 'px;" id="' + id + '"></div>');
	}
	var wrapperWidth = loadingWrapper.width();
	
	$("#cge_editorLoadingInidicatorWrapper div").each(function(id){
		$(this).clear
		$(this).delay(id*100).animate({left: (wrapperWidth + 5 + (15*id))}, 5000, 'easeInOutCirc', function(){
			if(cge_isLoading() && id == 0){
				cge_startLoadingAnimation();
			}
		});
	});
}