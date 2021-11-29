<?php

namespace app\modules\api\controllers\actions;

use Yii;
use yii\rest\Action;

class ReadAction extends Action
{
    public function run()
    { 
      $query = (new \yii\db\Query())
      ->select(['id', 'id_user', 'title', 'content'])
      ->from('posts')
      ->join('INNER JOIN', 'posts_rubrics', 'posts.id = posts_rubrics.posts_id')
      ->where(['rubrics_id' => Yii::$app->getRequest()->getBodyParam('id_rubrics')])
      ->groupBy('id')
      ->all();

      $ids = array_map( fn($item) => $item['id'], $query );

      $rubrics = (new \yii\db\Query())
      ->select(['posts_id', 'rubrics_id'])
      ->from('posts_rubrics')
      ->where(['posts_id' => $ids])
      ->all();

      foreach ($query as &$item) {
        $item['id_rubrics'] = [];
        foreach ($rubrics as $itm) {
          if ($item['id'] == $itm['posts_id']) {
            $item['id_rubrics'][] = $itm['rubrics_id'];
          }
        }  
      }

      return $query;
    }
}
