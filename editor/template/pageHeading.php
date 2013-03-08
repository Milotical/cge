<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="de-DE" lang="de-DE">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="Author" content="<?php echo $cge_Author; ?>" />

	<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7, IE=9" />
	
	<link rel="stylesheet" href="theme/<?php echo $cge_Theme; ?>/editor.css" type="text/css" />
	<link rel="stylesheet" href="theme/<?php echo $cge_Theme; ?>/dark-hive/jquery-ui-1.9.2.custom.min.css" type="text/css" />

	<script src="script/jquery-1.7.2.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="script/jquery-ui-1.9.2.custom.min.js" type="text/javascript" charset="utf-8"></script>
	<script src="script/editor.js" type="text/javascript" charset="utf-8"></script>
	<script src="script/window.js" type="text/javascript" charset="utf-8"></script>
	
	<title><?php cge_print("title"); ?></title>
</head>


<body>

<div id="topBarWrapper">
	<div id="topBarContent">
		<nav id="topBarNavigation">
			<ul>
				<li>
					<a href="#">Map</a>
					<ul class="topBarSubNavigation">
						<li><a href="#" class="cge_new">New Map</a></li>
						<li><a href="#" class="cge_delete">Delete Map</a></li>
						<li><a href="#" class="cge_close">Close</a></li>
					</ul>
				</li>
				<li>
					<a href="javascript:;" class="noClick">Windows</a>
					<ul class="topBarSubNavigation" id="cge_EditorWindowList">
						<li>
							<a id="cge_EditorWindowHandler_cge_Log" href="#" onclick="cge_openWindow('cge_Log'); return false;">Log</a>
						</li>
						<li>
							<a id="cge_EditorWindowHandler_cge_Feedback" href="#" onclick="cge_openWindow('cge_Feedback'); return false;">Send Feedback</a>
						</li>
					</ul>
				</li>
				<li>
					<a href="#">Logout</a>
				</li>
			</ul>
		</nav>
	</div>
</div>

<div id="cge_editorWindowWrapper">
