<?php

/* @var $this yii\web\View */
use app\assets\ReactAppAsset;

ReactAppAsset::register($this);

$this->title = 'News Catalog with API';

echo '<script> window.initUsers = ' . json_encode($users) . '; window.isL = ' . (Yii::$app->user->isGuest == 1 ? 'false': 'true') . '; </script>';

?>
<div id="root"></div>
