
exports.up = function (knex, Promise) {

    return knex.schema.createTable('storey_test', function (table) {

        table.increments('id');
        table.integer('number').notNullable();
        });
};

exports.down = function (knex, Promise) {

    return knex.schema.dropTableIfExists('storey_test');
};
