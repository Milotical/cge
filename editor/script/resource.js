/**
 * 
 */
var cge_LoadedResourceDir = "";
var cge_LoadedProjectDir = "";
var cge_ResDir = "res";

function cge_ResourceManagerOpen(pPath){
	cge_LoadedResourceDir = "" + pPath;

	cge_setLoading(true);
	
	$.get("ajax/resourceManager.php", {res: pPath}, function(data){
		cge_setLoading(false);
		$("#cge_ResourceManager div.cge_EditorWindowContent").html(data);
	});
}

function cge_ResourceManagerUp(){
	var splitPath = cge_LoadedResourceDir.split("/");
	splitPath.pop();
	var newPath = splitPath.join("/");
	
	cge_LoadedResourceDir = newPath;
	
	cge_setLoading(true);
	$.get("ajax/resourceManager.php", {res: newPath}, function(data){
		cge_setLoading(false);
		$("#cge_ResourceManager div.cge_EditorWindowContent").html(data);
	});
}

//function cge_ResourceManagerJumpTo(pPath){
//	cge_setLoading(true);
//	
//	$.get("ajax/resourceManager.php", {res: pPath}, function(data){
//		cge_setLoading(false);
//		$("#cge_ResourceManager div.cge_EditorWindowContent").html(data);
//	});
//}

function cge_ResourceManagerShowPreview(pFile, pId){
//	alert(cge_LoadedResourceDir + "/" + pFile);
//	alert(pId);
	$(".cge_ResourceManagerPreviewZoom").removeClass("cge_ResourceManagerPreviewZoom");
	$(".cge_ResourceManageFileSelected").removeClass("cge_ResourceManageFileSelected");
	$("#" + pId).addClass("cge_ResourceManageFileSelected");
	
	var ext = cge_ResourceManagerGetFileExtension(pFile);
	if(ext == "png" || ext == "gif" || ext == "jpg" || ext == "bmp"){		
		$("#cge_ResourceManagerPreviewImageWrapper img").show();
		$("#cge_ResourceManagerPreviewImageWrapper img").attr("src", cge_LoadedProjectDir + "/" + pFile);
	}else{
		$("#cge_ResourceManagerPreviewImageWrapper img").hide();
	}
}

function cge_ResourceManagerGetFileExtension(pFile){
//	var split = pFile.split(".");
	return pFile.split(".").pop();
}

function cge_ResourceManagerTogglePreviewZoom(){
	$("#cge_ResourceManagerPreviewWrapper").toggleClass("cge_ResourceManagerPreviewZoom");
}