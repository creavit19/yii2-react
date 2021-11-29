<?php

namespace app\modules\api\controllers\actions;

use Yii;
use yii\base\Model;
use yii\db\ActiveRecord;
use yii\web\ServerErrorHttpException;
use yii\rest\Action;

class UpdateAction extends Action
{
    public $scenario = Model::SCENARIO_DEFAULT;

    public function run($id)
    {
        $model = $this->findModel($id);

        if ($this->checkAccess) {
            call_user_func($this->checkAccess, $this->id, $model);
        }

        $model->scenario = $this->scenario;
        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        $model->rubrics = Yii::$app->getRequest()->getBodyParam('id_rubrics');
        if ($model->save() === false && !$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to update the object for unknown reason.');
        }

        return $model;
    }
}
