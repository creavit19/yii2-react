<?php

namespace app\assets;

use yii\web\AssetBundle;

class ReactAsset extends AssetBundle
{
    public $sourcePath = '@bower/react17';
    
    public $js = [
        'babel.min.js',
        'react.production.min.js',
        'react-dom.production.min.js',
    ];
}