const logging = require('@tryghost/logging');
const {createNonTransactionalMigration} = require('../../utils');
const DatabaseInfo = require('@tryghost/database-info');

module.exports = createNonTransactionalMigration(
    async function up(knex) {
        if (DatabaseInfo.isSQLite(knex)) {
            logging.warn('Skipping migration for SQLite3 (foreign keys and column alters limited)');
            return;
        }

        logging.info('Adding edited_by column to posts table');
        await knex.schema.alterTable('posts', function (table) {
            table
                .integer('edited_by')
                .unsigned()
                .nullable()
                .references('id')
                .inTable('users')
                .onDelete('SET NULL');
        });
    },

    async function down() {
        logging.warn('Dropping edited_by column is not supported (non-reversible migration)');
    }
);
