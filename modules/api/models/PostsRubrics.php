<?php

namespace app\modules\api\models;

use Yii;

/**
 * This is the model class for table "posts_rubrics".
 *
 * @property int $posts_id
 * @property int $rubrics_id
 *
 * @property Posts $posts
 * @property Rubrics $rubrics
 */
class PostsRubrics extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'posts_rubrics';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['posts_id', 'rubrics_id'], 'required'],
            [['posts_id', 'rubrics_id'], 'integer'],
            [['posts_id', 'rubrics_id'], 'unique', 'targetAttribute' => ['posts_id', 'rubrics_id']],
            [['posts_id'], 'exist', 'skipOnError' => true, 'targetClass' => Posts::className(), 'targetAttribute' => ['posts_id' => 'id']],
            [['rubrics_id'], 'exist', 'skipOnError' => true, 'targetClass' => Rubrics::className(), 'targetAttribute' => ['rubrics_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'posts_id' => 'Posts ID',
            'rubrics_id' => 'Rubrics ID',
        ];
    }

    /**
     * Gets query for [[Posts]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getPosts()
    {
        return $this->hasOne(Posts::className(), ['id' => 'posts_id']);
    }

    /**
     * Gets query for [[Rubrics]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getRubrics()
    {
        return $this->hasOne(Rubrics::className(), ['id' => 'rubrics_id']);
    }
}
