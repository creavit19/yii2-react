<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%posts_rubrics}}`.
 * Has foreign keys to the tables:
 *
 * - `{{%posts}}`
 * - `{{%rubrics}}`
 */
class m211123_163628_create_junction_table_for_posts_and_rubrics_tables extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%posts_rubrics}}', [
            'posts_id' => $this->integer(),
            'rubrics_id' => $this->integer(),
            'PRIMARY KEY(posts_id, rubrics_id)',
        ]);

        // creates index for column `posts_id`
        $this->createIndex(
            '{{%idx-posts_rubrics-posts_id}}',
            '{{%posts_rubrics}}',
            'posts_id'
        );

        // add foreign key for table `{{%posts}}`
        $this->addForeignKey(
            '{{%fk-posts_rubrics-posts_id}}',
            '{{%posts_rubrics}}',
            'posts_id',
            '{{%posts}}',
            'id',
            'CASCADE'
        );

        // creates index for column `rubrics_id`
        $this->createIndex(
            '{{%idx-posts_rubrics-rubrics_id}}',
            '{{%posts_rubrics}}',
            'rubrics_id'
        );

        // add foreign key for table `{{%rubrics}}`
        $this->addForeignKey(
            '{{%fk-posts_rubrics-rubrics_id}}',
            '{{%posts_rubrics}}',
            'rubrics_id',
            '{{%rubrics}}',
            'id',
            'CASCADE'
        );
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        // drops foreign key for table `{{%posts}}`
        $this->dropForeignKey(
            '{{%fk-posts_rubrics-posts_id}}',
            '{{%posts_rubrics}}'
        );

        // drops index for column `posts_id`
        $this->dropIndex(
            '{{%idx-posts_rubrics-posts_id}}',
            '{{%posts_rubrics}}'
        );

        // drops foreign key for table `{{%rubrics}}`
        $this->dropForeignKey(
            '{{%fk-posts_rubrics-rubrics_id}}',
            '{{%posts_rubrics}}'
        );

        // drops index for column `rubrics_id`
        $this->dropIndex(
            '{{%idx-posts_rubrics-rubrics_id}}',
            '{{%posts_rubrics}}'
        );

        $this->dropTable('{{%posts_rubrics}}');
    }
}
