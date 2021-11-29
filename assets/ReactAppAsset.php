<?php

namespace app\assets;

use yii\web\AssetBundle;

class ReactAppAsset extends  AssetBundle
{
    public $css = [
      'css/react.css'
    ];

    public $js = [
        'js/ReactApp.js'
    ];

    public $jsOptions = [
        'type' => 'text/babel'
    ];

    public $depends = [
        ReactAsset::class
    ];
}
