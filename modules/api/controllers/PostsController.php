<?php

namespace app\modules\api\controllers;

use Yii;
use app\modules\api\controllers\BaseApiController;
use app\modules\api\models\Posts;

class PostsController extends BaseApiController
{
  public $modelClass = Posts::class;

  public function actions()
  {
      $actions = [
          'create' => [
              'class' => actions\CreateAction::class,
              'modelClass' => $this->modelClass,
              'checkAccess' => [$this, 'checkAccess'],
          ],
          'update' => [
              'class' => actions\UpdateAction::class,
              'modelClass' => $this->modelClass,
              'checkAccess' => [$this, 'checkAccess'],
          ],
          'read' => [
              'class' => actions\ReadAction::class,
              'modelClass' => $this->modelClass,
              'checkAccess' => [$this, 'checkAccess'],
          ],
      ];
      
      return array_merge(parent::actions(), $actions);
  }

}
