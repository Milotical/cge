var cge_loading = 0;

$(document).ready(function(){
	cge_enableWindowFunctions();
	cge_resizeWindowWrapper();
	
	//cge_setLoading(true);
	

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
		loadingWrapper.animate({height: 5});
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