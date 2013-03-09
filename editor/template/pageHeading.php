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
	
	<script type="text/javascript">
		$(window).load(function(){
			<?php echo $cge_startScript; ?>
		});
	</script>
	
	<title><?php cge_print("title"); ?></title>
</head>

<body>

<div id="topBarWrapper">
	<div id="topBarContent">
		<nav id="topBarNavigation">
			<?php 
			$nav->printList();
			?>
		</nav>
	</div>
</div>

<div id="cge_editorLoadingInidicatorWrapper">

</div>

<div id="cge_editorWindowWrapper">
