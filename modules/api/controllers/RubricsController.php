<?php

namespace app\modules\api\controllers;

use app\modules\api\controllers\BaseApiController;
use app\modules\api\models\Rubrics;
use Yii;


class RubricsController extends BaseApiController
{
  public $modelClass = Rubrics::class;

  public function actions()
  {
      $actions = [
          'receive' => [
              'class' => actions\ReceiveAction::class,
              'modelClass' => $this->modelClass,
              'checkAccess' => [$this, 'checkAccess'],
          ],
      ];
      
      return array_merge(parent::actions(), $actions);
  }
}
