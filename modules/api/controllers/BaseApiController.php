<?php

namespace app\modules\api\controllers;

use yii\rest\ActiveController;
use yii\filters\AccessControl;

class BaseApiController extends ActiveController
{
  /* public function behaviors()
  {
      $behaviors = parent::behaviors();
      $behaviors['access'] = [
              'class' => AccessControl::class,
              'only' => ['create', 'update', 'delete'],
              'rules' => [
                  [  
                    'actions' => ['update', 'create', 'delete'], 
                    'allow' => true,
                    'roles' => ['@'],
                ],
              ],
          ];
      return $behaviors;
  } */
}
