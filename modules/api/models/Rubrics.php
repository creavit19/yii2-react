<?php

namespace app\modules\api\models;

use Yii;

/**
 * This is the model class for table "rubrics".
 *
 * @property int $id
 * @property int $id_parent
 * @property string|null $name
 *
 * @property Posts[] $posts
 * @property Posts[] $posts0
 * @property PostsRubrics[] $postsRubrics
 */
class Rubrics extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'rubrics';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id_parent'], 'integer'],
            [['name'], 'string', 'max' => 255],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'id_parent' => 'Id Parent',
            'name' => 'Name',
        ];
    }

    /**
     * Gets query for [[Posts]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getPosts()
    {
        return $this->hasMany(Posts::className(), ['id_rubric' => 'id']);
    }

    /**
     * Gets query for [[Posts0]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getPosts0()
    {
        return $this->hasMany(Posts::className(), ['id' => 'posts_id'])->viaTable('posts_rubrics', ['rubrics_id' => 'id']);
    }

    /**
     * Gets query for [[PostsRubrics]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getPostsRubrics()
    {
        return $this->hasMany(PostsRubrics::className(), ['rubrics_id' => 'id']);
    }
}
