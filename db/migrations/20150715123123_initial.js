
exports.up = function (knex, Promise) {

    return knex.schema.createTable('storey', function (table) {

        table.increments('id');
        table.integer('number').notNullable();
        });
};

exports.down = function (knex, Promise) {

    return knex.schema.dropTableIfExists('storey');
};
