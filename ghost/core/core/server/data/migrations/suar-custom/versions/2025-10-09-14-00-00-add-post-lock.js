/**
 * Example migration for adding suar_post_lock table
 */
module.exports.up = async function (knex) {
    const hasTable = await knex.schema.hasTable('suar_post_lock');
    if (!hasTable) {
        await knex.schema.createTable('suar_post_lock', table => {
            table.string('id').primary();
            table.string('post_id').references('id').inTable('posts').onDelete('CASCADE');
            table.string('user_id').references('id').inTable('users').onDelete('SET NULL');
            table.timestamp('locked_at').defaultTo(knex.fn.now());
        });
        console.log('✅ Created suar_post_lock table');
    } else {
        const hasColumn = await knex.schema.hasColumn('suar_post_lock', 'locked_at');
        if (!hasColumn) {
            await knex.schema.table('suar_post_lock', table => {
                table.timestamp('locked_at').defaultTo(knex.fn.now());
            });
            console.log('🔧 Added locked_at column to suar_post_lock table');
        } else {
            console.log('⚙️ suar_post_lock table already up-to-date');
        }
    }
};
