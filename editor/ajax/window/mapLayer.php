<?php
$tilesetWindow = new Window($_GET["w"], cge_getString('Layer'), "", $cge_editorBasePath);

$tilesetWindowControl = '<a href="javascript: cge_MapNewLayer();" class="cge_btn cge_btn_icon cge_plus" title="New Layer"></a>';
$tilesetWindowControl .= '<a href="javascript: cge_MapMoveLayer(true);" class="cge_btn cge_btn_icon cge_arrowUp" title="Move up"></a>';
$tilesetWindowControl .= '<a href="javascript: cge_MapMoveLayer(false);" class="cge_btn cge_btn_icon cge_arrowDown" title="Move down"></a>';
$tilesetWindow->setWindowControl($tilesetWindowControl);

$tilesetWindow->setHeaderColor("purple");
$tilesetWindow->setWidth(300);
$tilesetWindow->setTop(600 + 50);
$tilesetWindow->setLeft(24);
$tilesetWindow->setPositionAnchor('left');
$tilesetWindow->printHead();
?>

<div class="cge_MapLayerActiveWrapper">

<?php 
cge_print('LayerTextDefault');
?>

</div>

<?php
$tilesetWindow->printFoot();
?>