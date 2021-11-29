<?php

namespace app\modules\api\models;

use Yii;
use app\models\User;
use lhs\Yii2SaveRelationsBehavior\SaveRelationsBehavior;

/**
 * This is the model class for table "posts".
 *
 * @property int $id
 * @property int $id_user
 * @property string|null $title
 * @property string|null $content
 *
 * @property PostsRubrics[] $postsRubrics
 * @property Rubrics[] $rubrics
 * @property User $user
 */
class Posts extends \yii\db\ActiveRecord
{

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'posts';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id_user'], 'required'],
            [['id_user'], 'integer'],
            [['content'], 'string'],
            [['title'], 'string', 'max' => 255],
            [['id_user'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['id_user' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'id_user' => 'Id User',
            'title' => 'Title',
            'content' => 'Content',
        ];
    }

    public function behaviors()
    {
        return [
            'saveRelations' => [
                'class'     => SaveRelationsBehavior::className(),
                'relations' => [
                    'rubrics',
                ],
            ],
        ];
    }

    /**
     * Gets query for [[PostsRubrics]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getPostsRubrics()
    {
        return $this->hasMany(PostsRubrics::className(), ['posts_id' => 'id']);
    }

    /**
     * Gets query for [[Rubrics]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getRubrics()
    {
        return $this->hasMany(Rubrics::className(), ['id' => 'rubrics_id'])->viaTable('posts_rubrics', ['posts_id' => 'id']);
    }

    /**
     * Gets query for [[User]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'id_user']);
    }

}
