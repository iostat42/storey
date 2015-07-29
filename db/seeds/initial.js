var seedTable = 'storey_test';

exports.seed = function (knex, Promise) {

  return Promise.join(
    // Deletes ALL existing entries
    knex(seedTable).del(),

    // Inserts seed entries
    knex(seedTable).insert({
        id: 1,
        number: 1
    }),
    knex(seedTable).insert({
        id: 2,
        number: 2
    }),
    knex(seedTable).insert({
        id: 3,
        number: 3
    }),
    knex(seedTable).insert({
        id: 4,
        number: 4
    }),
    knex(seedTable).insert({
        id: 5,
        number: 5
    }),
    knex(seedTable).insert({
        id: 6,
        number: 6
    })
  );
};
