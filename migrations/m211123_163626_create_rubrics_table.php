<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%rubrics}}`.
 * Has foreign keys to the tables:
 *
 * - `{{%rubrics}}`
 */
class m211123_163626_create_rubrics_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%rubrics}}', [
            'id' => $this->primaryKey(),
            'id_parent' => $this->integer()->notNull()->defaultValue(0),
            'name' => $this->string(),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown()
    {
        $this->dropTable('{{%rubrics}}');
    }
}
