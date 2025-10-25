/**
 * Custom migration runner for suar-custom/
 * Run manually using: `node core/server/data/migrations/suar-custom/index.js`
 */

const path = require('path');
const fs = require('fs');
const logging = require('@tryghost/logging');
const knex = require('../../db/connection'); // Ghost's existing Knex connection

const CUSTOM_MIGRATIONS_PATH = path.join(__dirname, 'versions');
const STATE_TABLE = 'suar_custom_migrations';

async function ensureStateTable() {
    const hasTable = await knex.schema.hasTable(STATE_TABLE);
    if (!hasTable) {
        await knex.schema.createTable(STATE_TABLE, table => {
            table.increments('id');
            table.string('name').unique().notNullable();
            table.timestamp('executed_at').defaultTo(knex.fn.now());
        });
        logging.info(`✅ Created state table: ${STATE_TABLE}`);
    }
}

async function getExecutedMigrations() {
    const exists = await knex.schema.hasTable(STATE_TABLE);
    if (!exists) return [];
    const rows = await knex(STATE_TABLE).select('name');
    return rows.map(r => r.name);
}

async function runMigrations() {
    await ensureStateTable();
    const executed = await getExecutedMigrations();

    const files = fs.readdirSync(CUSTOM_MIGRATIONS_PATH)
        .filter(f => f.endsWith('.js'))
        .sort(); // chronological order

    for (const file of files) {
        if (executed.includes(file)) {
            logging.info(`⚙️ Skipping already executed migration: ${file}`);
            continue;
        }

        const migration = require(path.join(CUSTOM_MIGRATIONS_PATH, file));

        try {
            logging.info(`🚀 Running migration: ${file}`);
            await migration.up(knex);
            await knex(STATE_TABLE).insert({name: file});
            logging.info(`✅ Completed migration: ${file}`);
        } catch (err) {
            logging.error(`❌ Failed migration ${file}:`, err);
            throw err;
        }
    }

    logging.info('🎉 All custom migrations complete!');
}

runMigrations()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
