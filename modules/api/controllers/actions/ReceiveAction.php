<?php

namespace app\modules\api\controllers\actions;

use Yii;
use yii\rest\Action;

class ReceiveAction extends Action
{
    public function run()
    { 
        $query = Yii::$app->db->createCommand('
          SELECT rubrics.id, rubrics.name, rubrics.id_parent, IF(((Count(rubrics_1.id))=0) And ((Count(posts_rubrics.rubrics_id))=0),TRUE,FALSE) AS deletable
          FROM (rubrics LEFT JOIN posts_rubrics ON rubrics.id = posts_rubrics.rubrics_id)
          LEFT JOIN rubrics AS rubrics_1 ON rubrics.id = rubrics_1.id_parent
          GROUP BY rubrics.id, rubrics.name, rubrics.id_parent
          ')->queryAll();

        return $query;
    }
}
