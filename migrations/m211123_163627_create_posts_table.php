<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%posts}}`.
 * Has foreign keys to the tables:
 *
 * - `{{%user}}`
 */
class m211123_163627_create_posts_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%posts}}', [
            'id' => $this->primaryKey(),
            'id_user' => $this->integer()->notNull(),
            'title' => $this->string(),
            'content' => $this->text(),
        ]);

        // creates index for column `id_user`
        $this->createIndex(
            '{{%idx-posts-id_user}}',
            '{{%posts}}',
            'id_user'
        );

        // add foreign key for table `{{%user}}`
        $this->addForeignKey(
            '{{%fk-posts-id_user}}',
            '{{%posts}}',
            'id_user',
            '{{%user}}',
            'id',
            'CASCADE'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        // drops foreign key for table `{{%user}}`
        $this->dropForeignKey(
            '{{%fk-posts-id_user}}',
            '{{%posts}}'
        );

        // drops index for column `id_user`
        $this->dropIndex(
            '{{%idx-posts-id_user}}',
            '{{%posts}}'
        );

        $this->dropTable('{{%posts}}');
    }
}
